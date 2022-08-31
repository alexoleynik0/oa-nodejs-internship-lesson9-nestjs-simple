import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ObjectID } from 'mongodb';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('oldRefreshToken'), // TODO: add type check from TokenUserDto
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<null | UserEntity> {
    const oldRefreshToken: string = req.body.oldRefreshToken; // TODO: is there a way to not use express req?

    if (payload.tokenType !== 'refresh') {
      return null;
    }
    const userId = new ObjectID(payload.sub);

    const userEntity = await this.usersService.findOne(userId);
    if (userEntity === null) {
      return null;
    }

    const refreshToken = await this.authService.validateRefreshToken(
      userEntity,
      oldRefreshToken,
    );
    if (refreshToken === null) {
      return null;
    }

    return userEntity;
  }
}
