import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    format: 'email',
    maximum: 100,
    example: 'sample@email.com',
  })
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    format: 'password',
    minimum: 4,
    maximum: 20,
    example: '123456',
  })
  password: string;

  @Match('password')
  @ApiProperty({
    format: 'password',
    description: 'must be the same as the `password`',
    example: '123456',
  })
  passwordConfirmation: string;
}
