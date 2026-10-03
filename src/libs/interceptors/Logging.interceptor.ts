import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

// Values of these keys are never written to the logs
const SENSITIVE_KEYS = new Set([
  'memberPassword',
  'password',
  'token',
  'accessToken',
]);
const MAX_LOG_LENGTH = 300;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQL');

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    if (context.getType<GqlContextType>() !== 'graphql') return next.handle();

    const startedAt = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const operation = `${info.parentType.name}.${info.fieldName}`;

    this.logger.log(
      `${operation} args: ${this.stringify(gqlContext.getArgs())}`,
      'REQUEST',
    );

    return next.handle().pipe(
      tap({
        next: (result) =>
          this.logger.log(
            `${operation} ${Date.now() - startedAt}ms ${this.stringify(result)}`,
            'RESPONSE',
          ),
        error: (err: Error) =>
          this.logger.warn(
            `${operation} ${Date.now() - startedAt}ms ${err.message}`,
            'ERROR',
          ),
      }),
    );
  }

  private stringify(value: unknown): string {
    const json =
      JSON.stringify(value, (key, val: unknown) =>
        SENSITIVE_KEYS.has(key) ? '***' : val,
      ) ?? '';
    return json.length > MAX_LOG_LENGTH
      ? `${json.slice(0, MAX_LOG_LENGTH)}...`
      : json;
  }
}
