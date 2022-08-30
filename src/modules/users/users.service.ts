import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectID } from 'typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: MongoRepository<UserEntity>,
  ) {}

  async create(userDto: Partial<UserEntity>) {
    const userEntity = this.usersRepository.create(userDto);

    return this.usersRepository.save(userEntity);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: ObjectID): Promise<null | UserEntity> {
    return this.usersRepository.findOneBy({ _id: id });
  }

  async findOneByEmail(email: string): Promise<null | UserEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(
    id: ObjectID,
    userDto: Partial<UserEntity>,
  ): Promise<null | UserEntity> {
    const userEntity = await this.findOne(id);

    if (userEntity === null) {
      return null;
    }

    return this.usersRepository.save(
      new UserEntity({ ...userEntity, ...userDto }),
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
