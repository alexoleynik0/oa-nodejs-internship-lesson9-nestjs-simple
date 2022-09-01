import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class TokenUserDto {
  @IsDefined()
  @IsString()
  @ApiProperty({
    description:
      "HS256 signed JWT of user's refreshToken (from `LoginSuccessResponse`) payload.",
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJyZWZyZXNoIn0.LYUldjsVju1MZGhlYgclQRv5OOV6ppd8y5bfDMGbpxs',
  })
  oldRefreshToken: string;
}
