import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../interfaces/role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => (value ?? '').toString())
  _id: ObjectID;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ default: Role.User, enum: Role })
  @Exclude()
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
