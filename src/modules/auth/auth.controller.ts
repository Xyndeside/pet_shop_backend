import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() userData: CreateUserDto) {
        return this.authService.register(userData);
    }

    @Post('login')
    async login(@Body() userData: LoginDto) {
        return this.authService.login(userData);
    }
}
