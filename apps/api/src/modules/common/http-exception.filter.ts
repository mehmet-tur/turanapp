import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Record<string, any>>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : null;
    const details =
      typeof payload === 'object' && payload && 'message' in payload && Array.isArray((payload as any).message)
        ? (payload as any).message.map((message: string) => ({ message }))
        : undefined;

    response.status(status).json({
      error: {
        code:
          (typeof payload === 'object' && payload && 'code' in payload && (payload as any).code) ||
          this.mapCode(status),
        message:
          (typeof payload === 'object' && payload && 'message' in payload && typeof (payload as any).message === 'string'
            ? (payload as any).message
            : this.defaultMessage(status)) ?? 'Beklenmeyen bir hata oluştu.',
        details,
        requestId: request.requestId ?? null,
      },
    });
  }

  private mapCode(status: number) {
    switch (status) {
      case 400:
        return 'VALIDATION_ERROR';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      default:
        return 'INTERNAL_ERROR';
    }
  }

  private defaultMessage(status: number) {
    return status >= 500 ? 'Sunucu hatası oluştu.' : 'İstek işlenemedi.';
  }
}
