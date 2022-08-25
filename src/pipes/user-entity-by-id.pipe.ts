import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class UserEntityByIdPipe
  implements PipeTransform<string, Promise<UserEntity>>
{
  constructor(private readonly usersService: UsersService) {}

  // IDEA: use ParseObjectIdPipe here
  transform(value: string) {
    const validObjectId = ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }

    const id: ObjectId = new ObjectId(value);

    return this.usersService.findOne(id);
  }
}
