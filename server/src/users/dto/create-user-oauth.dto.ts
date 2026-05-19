import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserOAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsString()
  @IsNotEmpty()
  providerId!: string;
}
