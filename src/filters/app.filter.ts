import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';
import { ResponseModel } from 'src/models/global.model';

@Catch()
export class AppFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Response<ResponseModel<any>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string;

    switch (true) {
      case exception instanceof NotFoundException:
        statusCode = 404;
        message = exception.message;
        break;
      case exception instanceof PrismaClientKnownRequestError &&
        exception.code === 'P2002':
        statusCode = 409;
        message =
          exception.message || 'A record with the same value already exists.';
        break;
      case exception instanceof PrismaClientKnownRequestError:
        statusCode = 400;
        message = exception.message;
        break;
      case exception instanceof PrismaClientUnknownRequestError:
        statusCode = 500;
        message = exception.message;
        break;
      case exception instanceof PrismaClientInitializationError:
        statusCode = 500;
        message = exception.message;
        break;
      case exception instanceof BadRequestException:
        statusCode = 400;
        const res = exception.getResponse() as { message: string[] | string };
        message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
        break;
      case exception instanceof ForbiddenException:
        statusCode = 403;
        message = exception.message;
        break;
      case exception instanceof UnauthorizedException:
        statusCode = 401;
        message = exception.message;
        break;
      case exception instanceof ConflictException:
        statusCode = 409;
        message = exception.message;
        break;
      default:
        statusCode = 500;
        message = 'Unexpected error occurred, try again.';
        break;
    }

    const responseModel: ResponseModel<any> = {
      isSuccessful: false,
      message,
    };

    return response.status(statusCode).json(responseModel);
  }
}
