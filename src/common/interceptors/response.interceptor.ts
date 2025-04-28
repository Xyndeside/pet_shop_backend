import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';

interface SuccessResponse<T> {
	statusCode: number;
	status: string;
	data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponse<T>> {
		const ctx = context.switchToHttp();
		const response = ctx.getResponse<Response>();

		return next.handle().pipe(
			map((data) => ({
				statusCode: response.statusCode,
				status: getReasonPhrase(response.statusCode).toLowerCase(),
				data,
			})),
		);
	}
}
