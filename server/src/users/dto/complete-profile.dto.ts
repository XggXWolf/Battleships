import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CompleteProfileDto {
  @IsString()
  @Length(3, 14)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Nickname can only contain letters, numbers, and underscores, and no spaces',
  })
  nickname!: string;
}
