import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { RoleEnum } from 'src/modules/users/interfaces/role.enum';
import { UsersService } from 'src/modules/users/users.service';

import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { PasswordHelper } from './helpers/password.helper';
import { JwtPayload, LoginSuccessResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: MongoRepository<RefreshTokenEntity>,
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

  async validateRefreshToken(
    userEntity: UserEntity,
    oldRefreshToken: string,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokenRepository.findOneBy({
      userId: userEntity._id,
      token: oldRefreshToken,
    });
  }

  async register(
    registerUserDto: Partial<UserEntity>,
  ): Promise<LoginSuccessResponse> {
    const userDto: Partial<UserEntity> = {
      ...registerUserDto,
      role: RoleEnum.Admin,
      password: PasswordHelper.getPasswordHash(registerUserDto.password),
    };

    const userEntity = await this.usersService.create(userDto);

    return this.login(userEntity);
  }

  async login(userEntity: UserEntity): Promise<LoginSuccessResponse> {
    return {
      accessToken: this.generateAccessToken(userEntity),
      refreshToken: this.generateRefreshToken(userEntity),
    };
  }

  async redeemTokens(
    userEntity: UserEntity,
    oldRefreshToken: string,
  ): Promise<LoginSuccessResponse> {
    this.logout(userEntity, oldRefreshToken);

    return this.login(userEntity);
  }

  async logout(userEntity: UserEntity, oldRefreshToken: string): Promise<void> {
    const refreshToken_toDelete = await this.refreshTokenRepository.findOneBy({
      userId: userEntity._id,
      token: oldRefreshToken,
    });

    this.refreshTokenRepository.remove(refreshToken_toDelete);
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

  protected generateAccessToken(userEntity: UserEntity): string {
    const accessToken = this.jwtService.sign(
      this.getAccessTokenPayload(userEntity),
      {
        expiresIn: this.configService.get<string>(
          'jwt.auth_refresh_token_expires_in',
        ),
      },
    );

    return accessToken;
  }

  protected generateRefreshToken(userEntity: UserEntity): string {
    const refreshToken = this.jwtService.sign(
      this.getRefreshTokenPayload(userEntity),
      {
        expiresIn: this.configService.get<string>(
          'jwt.auth_refresh_token_expires_in',
        ),
      },
    );

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: userEntity._id,
      token: refreshToken,
    });
    this.refreshTokenRepository.save(refreshTokenEntity);

    return refreshToken;
  }
}
