import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  validateUser(loginDto: LoginDto): boolean {
    const user = this.usersService.findOne(loginDto.nickname);

    return true;
  }
}
