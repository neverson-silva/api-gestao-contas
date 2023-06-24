/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { converterString } from '@utils/index';

export class AllExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const isProduction = false;

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let responseMessage = null;
    try {
      // @ts-ignore
      responseMessage = exception?.getResponse()?.message;
    } catch (e) {}
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toDateString(),
      path: request.url,
      method: request.method,
      message: converterString(
        isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : // @ts-ignore
            responseMessage ??
              // @ts-ignore
              exception.message.message ??
              // @ts-ignore
              exception.message.error ??
              exception.message ??
              null,
      ),
    };

    if (errorResponse.statusCode === HttpStatus.UNAUTHORIZED) {
      errorResponse.message = 'Credenciais inválidas, tente novamente';
    }

    // Logger.error(exception.stack); stacktrace não ajuda muito pois não é tão completo
    Logger.error(
      `${request.method} ${request.url} - [${errorResponse.statusCode}] ${errorResponse.message}`,
      exception.stack,
      exception.name ?? 'ExceptionFilter',
    );

    // @ts-ignore
    response.status(status).json(errorResponse);
  }
}
