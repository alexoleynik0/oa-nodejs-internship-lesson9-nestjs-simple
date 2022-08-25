import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectID } from 'typeorm';

import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UserEntityByIdPipe } from 'src/pipes/user-entity-by-id.pipe';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(new DbDuplicationErrorFilter('email'))
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UserEntityByIdPipe) userEntity: UserEntity) {
    if (null === userEntity) {
      throw new NotFoundException();
    }
    return userEntity;
  }

  @Patch(':id')
  @UseFilters(new DbDuplicationErrorFilter('email'))
  update(
    @Param('id', ParseObjectIdPipe) id: ObjectID,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: ObjectID) {
    return this.usersService.remove(id);
  }
}
