import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

function convertBigInt(obj: any): any {
	if (typeof obj === "bigint") return obj.toString();
	if (Array.isArray(obj)) return obj.map(convertBigInt);
	if (obj && typeof obj === "object") {
		const out: any = {};
		for (const k of Object.keys(obj)) out[k] = convertBigInt(obj[k]);
		return out;
	}
	return obj;
}

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(map((data) => convertBigInt(data)));
	}
}
