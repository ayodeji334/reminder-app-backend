import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export const RequestHeaders = createParamDecorator(
    async (value: any, ctx: ExecutionContext) => {
        const headers = ctx.switchToHttp().getRequest().headers;

        if (headers["content-type"] === "application/json") {
            throw new HttpException(`Invalid request header`, HttpStatus.BAD_REQUEST);
        }

        return headers;
    },
);