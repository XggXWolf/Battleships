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
import { isMongoId } from 'class-validator';
import {
  buildUserQuery,
  buildUserSelect,
  parseExtensions,
} from './users.helper';

// TO-DO: Prevent user from updating their own type and elo : DONE with whitelisted validation pipe in main.ts
// or at least make sure they can't set them to values that are not allowed.
// Also, add validation to the create and update DTOs to ensure that the data being sent by the client is valid and meets the required criteria
// (e.g., email format, password strength, etc.).

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

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

    // If a user with the same email or nickname exists, throw a ConflictException
    if (userExists) {
      throw new ConflictException(
        'User with this email or nickname already exists',
      );
    }

    // Hash the password before storing it in the database
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create the user in the database with the hashed password
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
          type: true,
          email: true,
        },
      });

      return user;
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('User already exists');
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  // Retrieves a list of users from the database with pagination support.
  async findMany({ limit, offset, extend }: PaginationDto) {
    // Determine which additional fields to retrieve based on the 'extend' query parameter
    const extensions = parseExtensions(extend);

    // Retrieve users from the database with pagination
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      select: buildUserSelect(extensions),
    });

    return users;
  }

  // Retrieves a single user from the database based on the provided identifier (either ID or nickname).
  async findOne(identifier: string, extend?: string) {
    // Determine which additional fields to retrieve based on the 'extend' query parameter
    const extensions = parseExtensions(extend);

    // Determine if the identifier is a MongoDB ObjectId or a nickname and construct the query accordingly
    const query = buildUserQuery(identifier);

    // Retrieve the user from the database based on the constructed query
    const user = await this.prisma.user.findUnique({
      where: query,
      select: buildUserSelect(extensions),
    });

    // If the user is not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Updates a user's information in the database based on the provided identifier and update data.
  async update(identifier: string, updateUserDto: UpdateUserDto) {
    // Determine if the identifier is a MongoDB ObjectId or a nickname and construct the query accordingly
    const query = buildUserQuery(identifier);

    // If the updateUserDto contains a password field, hash the new password before updating the user in the database
    const data = {
      ...updateUserDto,
      ...(updateUserDto.password && {
        password: await this.hashPassword(updateUserDto.password),
      }),
    };
    try {
      // Update the user in the database based on the constructed query and the provided update data
      const updatedUser = await this.prisma.user.update({
        where: query,
        data: data,
        select: {
          id: true,
          nickname: true,
          elo: true,
          type: true,
          email: true,
        },
      });

      return updatedUser;
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  // Deletes a user from the database based on the provided identifier.
  async remove(identifier: string) {
    // Determine if the identifier is a MongoDB ObjectId or a nickname and construct the query accordingly
    const query = buildUserQuery(identifier);

    try {
      // Delete the user from the database based on the constructed query
      const deletedUser = await this.prisma.user.delete({
        where: query,
        select: {
          id: true,
          nickname: true,
        },
      });
      return deletedUser;
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to delete user');
    }
  }
}
