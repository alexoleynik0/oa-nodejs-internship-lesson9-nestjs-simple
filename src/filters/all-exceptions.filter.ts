import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let restException =
      exception instanceof Object && this.configService.get<boolean>('debug')
        ? exception
        : {};

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      restException = exception.getResponse();
    }

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';
    const name = exception instanceof Error ? exception.name : 'Error';

    const responseBody = {
      statusCode,
      message,
      name,
      ...restException,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);

    // TODO: log exceptions
  }
}
