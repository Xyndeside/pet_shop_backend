import { Role } from '@prisma/client';

export interface UserFromRequest {
    user: {
        id: number;
        role: Role;
    }
}