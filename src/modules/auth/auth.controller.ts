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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RequestUser } from 'src/decorators/request-user.decorator';
import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';
import { ErrorResponse } from 'src/filters/interfaces/error-response.interface';
import { ValidationGuard } from 'src/guards/validation.guard';
import { UserEntity } from 'src/modules/users/entities/user.entity';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenUserDto } from './dto/token-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginSuccessResponse } from './interfaces/auth.interface';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    // NOTE: @nestjs/swagger does not allow to use interfaces as response (or any) type. NICE!..
    type: LoginSuccessResponse,
    description: 'Created an Admin user.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registerUserDto: RegisterUserDto,
  ) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    type: LoginSuccessResponse,
    description: 'Logged in as Admin user.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  @HttpCode(200)
  @UseGuards(new ValidationGuard(LoginUserDto), LocalAuthGuard)
  async login(@RequestUser() userEntity: UserEntity) {
    return this.authService.login(userEntity);
  }

  @Post('token')
  @ApiBody({ type: TokenUserDto })
  @ApiResponse({
    status: 200,
    type: LoginSuccessResponse,
    description: "Redeemed the Admin user's tokens.",
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  @HttpCode(200)
  @UseGuards(new ValidationGuard(TokenUserDto), JwtRefreshAuthGuard)
  async token(
    @RequestUser() userEntity: UserEntity,
    @Body('oldRefreshToken') oldRefreshToken: string,
  ) {
    return this.authService.redeemTokens(userEntity, oldRefreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiBody({ type: TokenUserDto })
  @ApiResponse({
    status: 204,
    description: "Logged out. Refresh token won't work anymore.",
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  @HttpCode(204)
  @UseGuards(new ValidationGuard(TokenUserDto), JwtRefreshAuthGuard)
  async logout(
    @RequestUser() userEntity: UserEntity,
    @Body('oldRefreshToken') oldRefreshToken: string,
  ) {
    this.authService.logout(userEntity, oldRefreshToken);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  async getProfile(@RequestUser() userEntity: UserEntity) {
    return userEntity;
  }
}
