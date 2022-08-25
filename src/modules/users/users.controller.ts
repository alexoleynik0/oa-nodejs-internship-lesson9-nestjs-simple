import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectID } from 'typeorm';

import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UserByIdPipe } from 'src/pipes/user-by-id.pipe';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
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
  findOne(@Param('id', UserByIdPipe) user: User) {
    if (null === user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  @UseFilters(new DbDuplicationErrorFilter('email'))
  update(
    @Param('id', new ParseObjectIdPipe()) id: ObjectID,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseObjectIdPipe()) id: ObjectID) {
    return this.usersService.remove(id);
  }
}
