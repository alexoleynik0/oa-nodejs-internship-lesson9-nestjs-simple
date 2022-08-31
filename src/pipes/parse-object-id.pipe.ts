import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectID } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectID> {
  transform(value: string): ObjectID {
    const validObjectId = ObjectID.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectID');
    }

    return new ObjectID(value);
  }
}
