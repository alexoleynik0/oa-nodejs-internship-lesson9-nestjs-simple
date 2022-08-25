import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registerUserDto: RegisterUserDto,
  ) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    loginUserDto: LoginUserDto,
  ) {
    const userEntity = await this.authService.login(loginUserDto);

    if (userEntity === null) {
      throw new BadRequestException('invalid credentials');
    }

    return userEntity;
  }
}
