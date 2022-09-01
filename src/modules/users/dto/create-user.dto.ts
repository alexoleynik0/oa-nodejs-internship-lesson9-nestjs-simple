import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @ApiProperty({
    format: 'email',
    maximum: 100,
    example: 'adam.smith@email.com',
  })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    required: false,
    maximum: 100,
    example: 'Adam',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    required: false,
    maximum: 100,
    example: 'Smith',
  })
  lastName?: string;
}
