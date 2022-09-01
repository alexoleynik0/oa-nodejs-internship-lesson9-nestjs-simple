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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

import { DbDuplicationErrorFilter } from 'src/filters/db-duplication-error.filter';
import { ErrorResponse } from 'src/filters/interfaces/error-response.interface';
import { ResourceNotFoundInterceptor } from 'src/interceptors/resource-not-found.interceptor';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UserEntityByIdPipe } from 'src/pipes/user-entity-by-id.pipe';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ResourceNotFoundInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Created User model.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [UserEntity],
    description: 'All User models.',
  })
  @ApiNotFoundResponse({ type: ErrorResponse })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'User with provided ID.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiNotFoundResponse({ type: ErrorResponse })
  async findOne(@Param('id', UserEntityByIdPipe) userEntity: UserEntity) {
    return userEntity;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Updated User model.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @UseFilters(new DbDuplicationErrorFilter('email'))
  async update(
    @Param('id', ParseObjectIdPipe) id: ObjectID,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: 'Removed user model.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Validation Error.',
  })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectID) {
    return this.usersService.remove(id);
  }
}
