import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-strategy.types';
import { UserFromRequest } from '../types/users.types';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtPayload => {
        const request = ctx.switchToHttp().getRequest<UserFromRequest>();

        const user = request.user as JwtPayload;
        if (!user || !user.id) {
            throw new UnauthorizedException('User not found in request');
        }

        return user;
    }
);