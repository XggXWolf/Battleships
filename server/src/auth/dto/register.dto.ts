import { OmitType } from '@nestjs/mapped-types';
import { LoginDto } from './login.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto extends OmitType(LoginDto, ['rememberMe'] as const) {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, and a number',
    },
  )
  declare password: string;

  @IsString()
  @Length(3, 14)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Nickname can only contain letters, numbers, and underscores, and no spaces',
  })
  nickname!: string;

  @IsBoolean()
  acceptTerms!: boolean;
}
