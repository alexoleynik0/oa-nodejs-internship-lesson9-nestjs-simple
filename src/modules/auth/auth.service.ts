import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { RoleEnum } from 'src/modules/users/interfaces/role.enum';
import { UsersService } from 'src/modules/users/users.service';

import { PasswordHelper } from './helpers/password.helper';
import { JwtPayload, LoginResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<null | UserEntity> {
    const userEntity = await this.usersService.findOneByEmail(email);

    if (
      userEntity === null ||
      userEntity.role !== RoleEnum.Admin ||
      !PasswordHelper.isPasswordCorrect(password, userEntity.password)
    ) {
      return null;
    }

    return userEntity;
  }

  async register(registerUserDto: Partial<UserEntity>): Promise<LoginResponse> {
    const userDto: Partial<UserEntity> = {
      ...registerUserDto,
      role: RoleEnum.Admin,
      password: PasswordHelper.getPasswordHash(registerUserDto.password),
    };

    const userEntity = await this.usersService.create(userDto);

    return this.login(userEntity);
  }

  async login(userEntity: UserEntity): Promise<LoginResponse> {
    const accessToken = this.jwtService.sign(
      this.getAccessTokenPayload(userEntity),
      {
        expiresIn: this.configService.get<string>(
          'jwt.auth_refresh_token_expires_in',
        ),
      },
    );

    const refreshToken = this.jwtService.sign(
      this.getRefreshTokenPayload(userEntity),
      {
        expiresIn: this.configService.get<string>(
          'jwt.auth_refresh_token_expires_in',
        ),
      },
    );

    // TODO: save refreshToken for the user

    return {
      accessToken,
      refreshToken,
    };
  }

  protected getAccessTokenPayload(userEntity: UserEntity): JwtPayload {
    return {
      sub: userEntity._id.toString(),
      email: userEntity.email,
      tokenType: 'access',
    };
  }

  protected getRefreshTokenPayload(userEntity: UserEntity): JwtPayload {
    return {
      sub: userEntity._id.toString(),
      email: userEntity.email,
      tokenType: 'refresh',
    };
  }
}
