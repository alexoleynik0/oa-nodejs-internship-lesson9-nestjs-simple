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

  findOne(id: ObjectID) {
    return this.usersRepository.findOneBy({ _id: id });
  }

  async update(
    id: ObjectID,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const userEntity = await this.findOne(id);

    return this.usersRepository.save({
      ...userEntity,
      ...updateUserDto,
    });
  }

  async remove(id: ObjectID) {
    const userEntity = await this.findOne(id);

    return this.usersRepository.remove(userEntity);
  }
}
