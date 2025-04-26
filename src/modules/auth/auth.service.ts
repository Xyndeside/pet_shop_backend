import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	async register(userData: CreateUserDto) {
		const existingUser = await this.usersService.findByEmail(userData.email);
		if (existingUser) {
			throw new ConflictException('User already exists');
		}

		return await this.usersService.create(userData);
	}

	async login(loginData: LoginDto) {
		const user = await this.usersService.findByEmail(loginData.email);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isMatch = await bcrypt.compare(loginData.password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const token = this.generateJwtToken(user.id, user.role);

		return {
			access_token: token,
		};
	}

	private generateJwtToken(userId: number, role: Role) {
		return this.jwtService.sign({
			id: userId,
			role,
		});
	}
}
