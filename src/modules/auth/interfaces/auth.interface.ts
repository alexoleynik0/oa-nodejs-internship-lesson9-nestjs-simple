import { ApiProperty } from '@nestjs/swagger';

export class LoginSuccessResponse {
  @ApiProperty({ description: 'jwt signed string' })
  accessToken: string;

  @ApiProperty({ description: 'jwt signed string' })
  refreshToken: string;
}

export type JwtPayloadTokenType = 'access' | 'refresh';

export type JwtPayload = {
  sub: string;
  email: string;
  tokenType: JwtPayloadTokenType;
};
