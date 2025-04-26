import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserFromRequest } from '../types/users.types';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isAuthenticated = await super.canActivate(context);
		if (!isAuthenticated) return false;

		const requiredRole = this.reflector.get<Role>(ROLES_KEY, context.getHandler());
		if (!requiredRole) return true;

		const request = context.switchToHttp().getRequest<UserFromRequest>();
		const user = request.user;

		if (!user || user.role !== requiredRole) {
			throw new UnauthorizedException('Access denied. Insufficient role.');
		}

		return true;
	}
}
