import { ApiProperty } from '@nestjs/swagger';
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
}
