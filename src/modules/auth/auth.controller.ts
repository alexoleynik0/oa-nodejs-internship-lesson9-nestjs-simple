import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import { RequestUser } from 'src/decorators/request-user.decorator';
import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';
import { ValidationGuard } from 'src/guards/validation.guard';
import { UserEntity } from 'src/modules/users/entities/user.entity';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenUserDto } from './dto/token-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registerUserDto: RegisterUserDto,
  ) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(new ValidationGuard(LoginUserDto), LocalAuthGuard)
  async login(@RequestUser() userEntity: UserEntity) {
    return this.authService.login(userEntity);
  }

  @Post('token')
  @UseGuards(new ValidationGuard(TokenUserDto), JwtRefreshAuthGuard)
  async token(
    @RequestUser() userEntity: UserEntity,
    @Body('oldRefreshToken') oldRefreshToken: string,
  ) {
    return this.authService.redeemTokens(userEntity, oldRefreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(new ValidationGuard(TokenUserDto), JwtRefreshAuthGuard)
  async logout(
    @RequestUser() userEntity: UserEntity,
    @Body('oldRefreshToken') oldRefreshToken: string,
  ) {
    this.authService.logout(userEntity, oldRefreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@RequestUser() userEntity: UserEntity) {
    return userEntity;
  }
}
