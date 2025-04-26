import {
    Body,
    Controller, Delete,
    Get,
    Param,
    ParseIntPipe, Patch,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../../common/types/jwt-strategy.types';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Controller('animals')
export class AnimalsController {
    constructor(private readonly animalsService: AnimalsService) {}

    @Get()
    async findAllPublic() {
        return this.animalsService.findAllPublic();
    }

    @Get('admin')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async findAllAdmin() {
        return this.animalsService.findAllAdmin();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() animalData: CreateAnimalDto, @Req() req: Request) {
        const requestUser = req.user as JwtPayload;
        if (!requestUser || !requestUser.id) {
            throw new UnauthorizedException('User not found in request');
        }

        return this.animalsService.create(animalData, requestUser.id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() animalData: UpdateAnimalDto,
        @Req() req: Request,
    ) {
        const requestUser = req.user as JwtPayload;
        if (!requestUser || !requestUser.id) {
            throw new UnauthorizedException('User not found in request');
        }

        return this.animalsService.update(id, animalData, requestUser);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        const requestUser = req.user as JwtPayload;
        if (!requestUser || !requestUser.id) {
            throw new UnauthorizedException('User not found in request');
        }

        return this.animalsService.delete(id, requestUser);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.animalsService.findById(id);
    }
}
