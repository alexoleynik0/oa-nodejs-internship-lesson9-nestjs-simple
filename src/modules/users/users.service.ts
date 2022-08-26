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

  async create(createUserDto: CreateUserDto) {
    const userEntity = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(userEntity);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: ObjectID): Promise<null | UserEntity> {
    return this.usersRepository.findOneBy({ _id: id });
  }

  async update(
    id: ObjectID,
    updateUserDto: UpdateUserDto,
  ): Promise<null | UserEntity> {
    const userEntity = await this.findOne(id);

    if (userEntity === null) {
      return null;
    }

    return this.usersRepository.save(
      new UserEntity({ ...userEntity, ...updateUserDto }),
    );
  }

  async remove(id: ObjectID): Promise<null | UserEntity> {
    const userEntity = await this.findOne(id);

    if (userEntity === null) {
      return null;
    }

    this.usersRepository.delete(id); // IDEA: check if deleted

    return userEntity;
  }
}
