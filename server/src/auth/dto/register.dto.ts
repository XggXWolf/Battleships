import { LoginDto } from './login.dto';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  declare password: string;

  @IsString()
  @Length(3, 14)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Nickname can only contain letters, numbers, and underscores, and no spaces',
  })
  nickname!: string;
}
