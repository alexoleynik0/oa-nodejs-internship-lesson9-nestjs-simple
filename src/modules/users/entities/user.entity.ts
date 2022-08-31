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
  _id: ObjectID;

  @Column({
    unique: true,
  })
  @IsNotEmpty()
  email: string;

  @Column()
  firstName?: string;

  @Column()
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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
