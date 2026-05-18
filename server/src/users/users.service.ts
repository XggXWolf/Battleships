import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PaginationDto } from './dto/pagination.dto';
import {
  buildUserQuery,
  buildUserSelect,
  parseExtensions,
} from './users.helper';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): Promise<string> {
    // bcrypt recommendation for interactive logins, increase for sensitive data
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          nickname: createUserDto.nickname,
          email: createUserDto.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          nickname: true,
          elo: true,
          role: true,
          email: true,
        },
      });

      return user;
    } catch (err) {
      // P2002: Unique constraint failed (e.g., email or nickname already exists)
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('User already exists');
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  async findMany({ limit, offset, extend }: PaginationDto, role: string) {
    const extensions = parseExtensions(role, extend);

    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      select: buildUserSelect(extensions),
    });

    return users;
  }

  // External method with error handling, used for public API where we want to control the response
  async findOne(identifier: string, role: string, extend?: string) {
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
  async findOneInternal(identifier: string) {
    const query = buildUserQuery(identifier);

    const user = await this.prisma.user.findUnique({
      where: query,
      select: {
        id: true,
        nickname: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(identifier: string, updateUserDto: UpdateUserDto) {
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
        select: {
          id: true,
          nickname: true,
          elo: true,
          role: true,
          email: true,
        },
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

  async remove(identifier: string) {
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
