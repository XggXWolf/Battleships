import { IsNumber, IsString } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class AdminUpdateUserDto extends UpdateUserDto {
  @IsString()
  role?: string;

  @IsNumber()
  elo?: number;
}
