

import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger("HTTP");

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, originalUrl } = request as any;
		const userAgent = request.get("user-agent") || "";

        const start = Date.now();

		response.on("finish", () => {
			const { statusCode } = response;
			const contentLength = response.get("content-length");
            const responseTime = Date.now() - start;


			this.logger.log(
				`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${responseTime}ms`,
			);
		});

		next();
	}
}
