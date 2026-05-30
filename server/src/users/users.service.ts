import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client';
import * as bcrypt from 'bcryptjs';
import { PaginationDto } from './dto/pagination.dto';
import {
  buildUserQuery,
  buildUserSelect,
  parseExtensions,
} from './users.helper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserOAuthDto } from './dto/create-user-oauth.dto';

type PublicUser = Pick<
  User,
  'id' | 'nickname' | 'elo' | 'role' | 'email' | 'isProfileComplete'
>;
type InternalUser = Pick<
  User,
  'id' | 'email' | 'nickname' | 'password' | 'role' | 'isProfileComplete'
>;

const PUBLIC_USER_SELECT = {
  id: true,
  nickname: true,
  elo: true,
  role: true,
  email: true,
  isProfileComplete: true,
} as const;

const DUMMY_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8GryuVYJFA9qv1n5yH9iY7vHne'; // dummy bcrpyt hash for timing attack mitigation

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): Promise<string> {
    // bcrypt recommendation for interactive logins, increase for sensitive data
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          nickname: createUserDto.nickname,
          email: createUserDto.email,
          password: hashedPassword,
          provider: 'local',
          providerId: createUserDto.email, // Using email as providerId for local users
          isProfileComplete: true, // Local users are considered to have complete profiles by default
        },
        select: PUBLIC_USER_SELECT,
      });

      return user;
    } catch (err) {
      // P2002: Unique constraint failed (e.g., email or nickname already exists)
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const field = err.meta?.target as string;
        if (field === 'User_email_key')
          throw new ConflictException('Email already in use');
        if (field === 'User_nickname_key')
          throw new ConflictException('Nickname already in use');
        throw new ConflictException('User already exists');
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  async findOrCreateOAuthUser({
    email,
    provider,
    providerId,
  }: CreateUserOAuthDto): Promise<PublicUser> {
    try {
      return this.prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          provider,
          providerId,
          nickname: `user_${Math.random().toString(36).slice(2, 8)}`, // Temporary nickname, should be updated by user later
        },
        select: PUBLIC_USER_SELECT,
      });
    } catch (err) {
      // P2002: Unique constraint failed (e.g., email already exists)
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async findMany(
    { limit, offset, extend }: PaginationDto,
    role: string,
  ): Promise<PublicUser[]> {
    const extensions = parseExtensions(role, extend);

    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      select: buildUserSelect(extensions),
    });

    return users;
  }

  // External method with error handling, used for public API where we want to control the response
  async findOne(
    identifier: string,
    role: string,
    extend?: string,
  ): Promise<PublicUser> {
    const extensions = parseExtensions(role, extend);

    const query = buildUserQuery(identifier);

    const user = await this.prisma.user.findUnique({
      where: query,
      select: buildUserSelect(extensions),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Internal method without error handling, used for authentication where we need the password hash
  private async findOneInternal(email: string): Promise<InternalUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nickname: true,
        password: true,
        role: true,
        isProfileComplete: true,
      },
    });

    return user;
  }

  async completeProfile(
    identifier: string,
    nickname: string,
  ): Promise<PublicUser> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: buildUserQuery(identifier),
        data: {
          nickname,
          isProfileComplete: true,
        },
        select: PUBLIC_USER_SELECT,
      });

      return updatedUser;
    } catch (err) {
      // P2025: record not found
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      // P2002: Unique constraint failed (e.g., nickname already exists)
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        err.meta?.target === 'User_nickname_key'
      ) {
        throw new ConflictException('Nickname already in use');
      }

      throw new BadRequestException('Failed to complete profile');
    }
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Omit<InternalUser, 'password'> | null> {
    const user = await this.findOneInternal(email);
    const hashToCompare = user?.password ?? DUMMY_HASH;

    const isValid = await bcrypt.compare(password, hashToCompare);

    // Always run bcrypt to prevent timing attacks, but reject if user not found or is an OAuth user
    if (!user || !user.password || !isValid) return null;
    return user;
  }

  async update(
    identifier: string,
    updateUserDto: UpdateUserDto,
  ): Promise<PublicUser> {
    const query = buildUserQuery(identifier);

    const data = {
      ...updateUserDto,
      ...(updateUserDto.password && {
        password: await this.hashPassword(updateUserDto.password),
      }),
    };
    try {
      const updatedUser = await this.prisma.user.update({
        where: query,
        data: data,
        select: PUBLIC_USER_SELECT,
      });

      return updatedUser;
    } catch (err) {
      // P2025: record not found
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(identifier: string): Promise<Pick<User, 'id' | 'nickname'>> {
    const query = buildUserQuery(identifier);

    try {
      const deletedUser = await this.prisma.user.delete({
        where: query,
        select: {
          id: true,
          nickname: true,
        },
      });
      return deletedUser;
    } catch (err) {
      // P2025: record not found
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to delete user');
    }
  }
}
