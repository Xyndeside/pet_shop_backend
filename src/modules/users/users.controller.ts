import {
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from '../../common/types/jwt-strategy.types';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async findMe(@Req() req: Request): Promise<UserResponseDto> {
        const requestUser = req.user as JwtPayload;
        if (!requestUser || !requestUser.id) {
            throw new UnauthorizedException('User not found in request');
        }

        const user = await this.usersService.findById(requestUser.id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.usersService.findById(id);
    }

}
