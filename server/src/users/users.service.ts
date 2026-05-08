import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Creates a new user in the database after validating that the email and nickname are unique.
  async create(createUserDto: CreateUserDto) {
    // Check if a user with the same email or nickname already exists
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { nickname: createUserDto.nickname },
        ],
      },
    });

    if (userExists) {
      throw new ConflictException(
        'User with this email or nickname already exists',
      );
    }

    // Hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Create the user in the database with the hashed password
    try {
      const user = await this.prisma.user.create({
        data: {
          nickname: createUserDto.nickname,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });

      // Remove the password field from the returned user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('User already exists');
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  // Retrieves a list of users from the database with pagination support.
  findMany({ limit, offset, extend }: PaginationDto) {
    // Determine which additional fields to retrieve based on the 'extend' query parameter
    const extensions =
      typeof extend === 'string' && extend.length > 0 ? extend.split(',') : [];

    // Retrieve users from the database with pagination
    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        nickname: true,
        ...(extensions.includes('elo') && { elo: true }),
        ...(extensions.includes('type') && { type: true }),
        ...(extensions.includes('email') && { email: true }),
      },
    });
  }

  // TO-DO: Implement

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
