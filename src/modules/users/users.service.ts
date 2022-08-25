import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectID } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: ObjectID) {
    return this.usersRepository.findOneBy({ _id: id });
  }

  async update(id: ObjectID, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: ObjectID) {
    const user = await this.findOne(id);

    return this.usersRepository.remove(user);
  }
}
