import {
  IsDefined,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Match } from 'src/decorators/validations/match.decorator';

export class RegisterUserDto {
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

  @Match('password')
  passwordConfirmation: string;
}
