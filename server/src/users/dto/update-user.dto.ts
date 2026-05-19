import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['provider', 'providerId'] as const),
) {
  @IsNumber()
  elo?: number;

  @IsString()
  role?: string;
}
