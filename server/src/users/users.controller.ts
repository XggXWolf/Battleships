import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TO-DO: Delete this endpoint after testing and move the create method to AuthController
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // TO-DO: GUARDS!
  @Get()
  findMany(@Query() PaginationDto: PaginationDto) {
    return this.usersService.findMany(PaginationDto);
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

  @Delete(':identifier')
  remove(@Param('identifier') identifier: string) {
    return this.usersService.remove(identifier);
  }
}
