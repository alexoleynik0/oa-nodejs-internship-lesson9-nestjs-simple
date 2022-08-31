import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectID } from 'mongodb';

import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';
import { ResourceNotFoundInterceptor } from 'src/interceptors/resource-not-found.interceptor';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UserEntityByIdPipe } from 'src/pipes/user-entity-by-id.pipe';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ResourceNotFoundInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', UserEntityByIdPipe) userEntity: UserEntity) {
    return userEntity;
  }

  @Patch(':id')
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async update(
    @Param('id', ParseObjectIdPipe) id: ObjectID,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectID) {
    return this.usersService.remove(id);
  }
}
