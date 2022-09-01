import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    example: 400,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    required: false,
    oneOf: [{ type: 'string' }, { type: '[string]' }, { type: 'object' }],
    example: ['email must be an email'],
  })
  message?: string | string[] | object;

  @ApiProperty({
    required: false,
    example: 'BadRequestException',
  })
  name?: string;

  @ApiProperty({
    required: false,
    example: 'Bad Request',
  })
  error?: string;

  @ApiProperty({
    required: false,
    format: 'date-time',
  })
  timestamp?: string;

  @ApiProperty({
    required: false,
    example: '/api/v1/auth/register',
  })
  path?: string;
}
