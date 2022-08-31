import { IsNotEmpty } from 'class-validator';
import { ObjectID } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';

import configuration from 'src/config/configuration';

@Entity({ name: 'users.refresh_tokens' })
export class RefreshTokenEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  /**
   * NOTE: ManyToOne/OneToMany/ManyToMany/OneToOne - those decorators are only supported in relational databases
   * {@see https://github.com/typeorm/typeorm/issues/655} typeorm is a joke..
   */
  @Column()
  @IsNotEmpty()
  userId: ObjectID; // UserEntity._id

  @Column()
  @IsNotEmpty()
  @Index()
  token: string;

  /**
   * NOTE: indices/indexes should be recreated if this value for `expireAfterSeconds` changes.
   */
  @CreateDateColumn()
  @Index({
    expireAfterSeconds: configuration().jwt.auth_refresh_token_expires_in,
  })
  createdAt: Date;

  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }
}
