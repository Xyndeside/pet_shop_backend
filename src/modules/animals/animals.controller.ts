import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../../common/types/jwt-strategy.types';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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
	async create(@Body() animalData: CreateAnimalDto, @CurrentUser() user: JwtPayload) {
		return this.animalsService.create(animalData, user.id);
	}

	@Get('my')
	@UseGuards(AuthGuard('jwt'))
	async findMyAnimals(@CurrentUser() user: JwtPayload) {
		return this.animalsService.findMyAnimals(user.id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard('jwt'))
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() animalData: UpdateAnimalDto,
		@CurrentUser() user: JwtPayload,
	) {
		return this.animalsService.update(id, animalData, user);
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
		return this.animalsService.delete(id, user);
	}

	@Get(':id')
	async findById(@Param('id', ParseIntPipe) id: number) {
		return this.animalsService.findById(id);
	}
}
