import { Role } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);