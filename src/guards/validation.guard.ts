import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

type ValidationRequestPropertyName = 'body' | 'query' | 'params';

@Injectable()
export class ValidationGuard implements CanActivate {
  constructor(
    private expectedType: Type<any>,
    private validationRequestPropertyName: ValidationRequestPropertyName = 'body',
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    return this.validate(request[this.validationRequestPropertyName]);
  }

  async validate(body: any) {
    const pipe = new ValidationPipe({
      validateCustomDecorators: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      expectedType: this.expectedType,
    });

    await pipe.transform(body, { type: 'custom' });

    return true;
  }
}
