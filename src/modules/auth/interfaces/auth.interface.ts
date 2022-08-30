export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayloadTokenType = 'access' | 'refresh';

export type JwtPayload = {
  sub: string;
  email: string;
  tokenType: JwtPayloadTokenType;
};
