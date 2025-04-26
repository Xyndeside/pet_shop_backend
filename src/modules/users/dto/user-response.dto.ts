import { Role } from '@prisma/client';

export class UserResponseDto {
    id: number;
    username: string;
    email: string;
    phone: string | null;
    role: Role;
    created_at: Date;
}