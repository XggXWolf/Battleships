import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

import { Roles } from '../decorators/roles.decorator';

@Roles(['admin', 'user']) // Default roles for all routes in this controller, can be overridden by specific routes
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Creates a new user in the database. This endpoint is protected and can only be accessed by users with the 'admin' role.
  For sign-up, use the /auth/register endpoint instead, which is public and does not require authentication. */
  @Roles(['admin'])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findMany(@Req() { user }: Request, @Query() PaginationDto: PaginationDto) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.usersService.findMany(PaginationDto, user.role || 'user');
  }

  @Get(':identifier')
  findOne(
    @Req() { user }: Request,
    @Param('identifier') identifier: string,
    @Query('extend') extend?: string,
  ) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.usersService.findOne(identifier, user.role || 'user', extend);
  }

  @Patch(':identifier')
  update(
    @Req() { user }: Request,
    @Param('identifier') identifier: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isSelf = identifier === user!.sub || identifier === user!.nickname;
    const isAdmin = user!.role === 'admin';

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Regular users cannot change their role, or elo
    if (!isAdmin) {
      delete updateUserDto.role;
      delete updateUserDto.elo;
    }

    return this.usersService.update(identifier, updateUserDto);
  }

  @Roles(['admin'])
  @Delete(':identifier')
  remove(@Param('identifier') identifier: string) {
    return this.usersService.remove(identifier);
  }
}
