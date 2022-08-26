import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectID } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: MongoRepository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const userEntity = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(userEntity);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: ObjectID): Promise<null | UserEntity> {
    return this.usersRepository.findOneBy({ _id: id });
  }

  async update(
    id: ObjectID,
    updateUserDto: UpdateUserDto,
  ): Promise<null | UserEntity> {
    let userEntity = await this.findOne(id);

    if (userEntity === null) {
      return null;
    }

    userEntity = { ...userEntity, ...updateUserDto };

    await this.usersRepository.save(userEntity);

    return await this.findOne(id);
  }

  async remove(id: ObjectID): Promise<null | UserEntity> {
    const userEntity = await this.findOne(id);

    if (userEntity === null) {
      return null;
    }

    this.usersRepository.remove(userEntity);

    return userEntity;
  }
}
