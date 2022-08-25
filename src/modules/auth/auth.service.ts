import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities/user.entity';

import { Roles } from '../users/interfaces/roles.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PasswordHelper } from './helpers/password.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: MongoRepository<UserEntity>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    registerUserDto.password = PasswordHelper.getPasswordHash(
      registerUserDto.password,
    );

    const userEntity = this.usersRepository.create(registerUserDto);
    userEntity.role = Roles.Admin;

    return this.usersRepository.save(userEntity);
  }

  async login(loginUserDto: LoginUserDto): Promise<null | UserEntity> {
    const userEntity = await this.usersRepository.findOneBy({
      email: loginUserDto.email,
    });
    if (userEntity === null || userEntity.role !== Roles.Admin) {
      return null;
    }
    if (
      !PasswordHelper.isPasswordCorrect(
        loginUserDto.password,
        userEntity.password,
      )
    ) {
      return null;
    }

    return userEntity;
  }
}
