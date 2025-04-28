import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userData: CreateUserDto) {
		const hashedPassword = await bcrypt.hash(userData.password, 5);

		const user = await this.prisma.user.create({
			data: {
				username: userData.username,
				email: userData.email,
				password: hashedPassword,
			},
		});

		return {
			userId: user.id,
		};
	}

	async findByEmail(email: string) {
        return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async findAll(): Promise<UserResponseDto[]> {
		const users = await this.prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				phone: true,
				role: true,
				created_at: true,
			},
		});
		if (!users || users.length === 0) {
			throw new NotFoundException('No users found');
		}

		return users;
	}

	async findById(id: number): Promise<UserResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				email: true,
				phone: true,
				role: true,
				created_at: true,
			},
		});
		if (!user) {
			throw new NotFoundException(`User not found`);
		}

		return user;
	}
}
