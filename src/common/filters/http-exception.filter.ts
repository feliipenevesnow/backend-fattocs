
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../dto/api-response.dto';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status   = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message  = exception instanceof HttpException 
      ? (typeof exception.getResponse() === 'string' ? exception.getResponse() : exception.getResponse()['message'] || exception.message) 
      : 'Internal server error';

    const apiResponse: ApiResponse<null> = {
      success: false,
      message: message,
      data: null, 
    };

    response.status(status).json(apiResponse);
  }
}
