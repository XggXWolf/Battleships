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
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Roles } from '../decorators/roles.decorator';

@Roles(['admin', 'user']) // Default roles for all routes in this controller, can be overridden by specific routes
@UseGuards(AuthenticationGuard, AuthorizationGuard)
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
    @Param('identifier') identifier: string,
    @Query('extend') extend?: string,
  ) {
    return this.usersService.findOne(identifier, extend);
  }

  @Patch(':identifier')
  update(
    @Param('identifier') identifier: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(identifier, updateUserDto);
  }

  @Roles(['admin'])
  @Delete(':identifier')
  remove(@Param('identifier') identifier: string) {
    return this.usersService.remove(identifier);
  }
}
