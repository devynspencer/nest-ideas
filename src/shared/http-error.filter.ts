import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message
          : 'Internal server error',
    };

    Logger.error(
      `${request.method} ${request.url}`,
      exception.stack,
      'ExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
