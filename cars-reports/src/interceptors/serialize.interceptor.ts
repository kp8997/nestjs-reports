
import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';


interface ClassConstructor { // make sure this type will be a class
  new (...arg: any[]): {}
}

export function Serialize (dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // run before request is handled
    // console.log("interceptor request context", context);
    return next.handle().pipe(
      map((data: any) => {
        // run something before response is sent out
        // console.log("interceptor response data", data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true // unless specify @Expose(), it will not show in response data
        })
      })
    );
  }
}