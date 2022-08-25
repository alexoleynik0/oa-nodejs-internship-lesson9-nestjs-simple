import {
  IsDefined,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
