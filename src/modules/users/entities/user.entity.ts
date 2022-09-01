import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ObjectID } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleEnum } from '../interfaces/role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => (value ?? '').toString())
  @ApiProperty({
    description: 'ObjectID as string of the model.',
    example: '6308cffbe027e703305aed79',
  })
  _id: ObjectID;

  @Column({
    unique: true,
  })
  @IsNotEmpty()
  @ApiProperty({
    format: 'email',
    example: 'example@email.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    required: false,
    example: 'Adam',
  })
  firstName?: string;

  @Column()
  @ApiProperty({
    required: false,
    example: 'Smith',
  })
  lastName?: string;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ select: false })
  @Exclude()
  password?: string;

  @Column({ default: RoleEnum.User, enum: RoleEnum })
  @Exclude()
  role?: RoleEnum;

  @CreateDateColumn()
  @ApiProperty({
    format: 'date-time',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    format: 'date-time',
  })
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
