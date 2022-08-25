import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { BulkWriteError } from 'mongodb';

@Catch(BulkWriteError)
export class DbDuplicationErrorFilter implements ExceptionFilter {
  constructor(private readonly fieldName: string) {}

  catch(exception: BulkWriteError, host: ArgumentsHost) {
    if (exception.message.indexOf('E11000') === -1) {
      return;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = 400;
    const message = [`${this.fieldName} is already taken`];

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Bad Request',
      name: 'BadRequestException',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
