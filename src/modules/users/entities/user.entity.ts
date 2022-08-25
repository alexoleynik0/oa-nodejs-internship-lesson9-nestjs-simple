import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Roles } from '../interfaces/roles.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @ObjectIdColumn()
  @Transform(({ value }: { value: ObjectID }) => value.toString())
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

  @Column({ default: Roles.User, enum: Roles })
  @Exclude()
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
