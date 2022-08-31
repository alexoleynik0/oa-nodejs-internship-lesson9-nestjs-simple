import { IsDefined, IsString } from 'class-validator';

export class TokenUserDto {
  @IsDefined()
  @IsString()
  oldRefreshToken: string;
}
