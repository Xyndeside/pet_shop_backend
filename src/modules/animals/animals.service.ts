import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AnimalStatus, Role } from '@prisma/client';
import { AnimalFullDto, AnimalPublicDto } from './dto/animal-public.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { JwtPayload } from '../../common/types/jwt-strategy.types';

@Injectable()
export class AnimalsService {
	constructor(private readonly prisma: PrismaService) {}

	async findAllPublic(): Promise<AnimalPublicDto[]> {
		const animals = await this.prisma.animal.findMany({
			where: {
				status: AnimalStatus.AVAILABLE,
			},
			select: {
				id: true,
				title: true,
				description: true,
				gender: true,
				age: true,
				price: true,
				color: true,
				size: true,
				location: true,
				petImages: true,
				customerImages: true,
			},
		});

		if (!animals || animals.length === 0) {
			throw new NotFoundException('No animals found');
		}

		return animals;
	}

	async findAllAdmin(): Promise<AnimalFullDto[]> {
		const animals = await this.prisma.animal.findMany({
			include: {
				petImages: true,
				customerImages: true,
				user: {
					select: {
						id: true,
						username: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		if (!animals || animals.length === 0) {
			throw new NotFoundException('No animals found');
		}

		return animals;
	}

	async findById(id: number): Promise<AnimalFullDto> {
		const animal = await this.prisma.animal.findUnique({
			where: { id },
			include: {
				petImages: true,
				customerImages: true,
				user: {
					select: {
						id: true,
						username: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		if (!animal) {
			throw new NotFoundException(`Animal not found`);
		}

		return animal;
	}

	async findMyAnimals(userId: number): Promise<AnimalFullDto[]> {
		const animals = await this.prisma.animal.findMany({
			where: {
				userId,
			},
			include: {
				petImages: true,
				customerImages: true,
			},
		});
		if (!animals || animals.length === 0) {
			throw new NotFoundException('No animals found');
		}

		return animals;
	}

	async create(animalData: CreateAnimalDto, userId: number) {
		const animal = await this.prisma.animal.create({
			data: {
				...animalData,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		if (!animal) {
			throw new BadRequestException('Animal not created');
		}

		return animal;
	}

	async update(id: number, animalData: UpdateAnimalDto, requestUser: JwtPayload) {
		const animal = await this.prisma.animal.findUnique({
			where: { id },
		});
		if (!animal) {
			throw new NotFoundException(`Animal not found`);
		}

		this.checkUserPermission(animal.userId, requestUser);

		return this.prisma.animal.update({
			where: { id },
			data: { ...animalData },
		});
	}

	async delete(id: number, requestUser: JwtPayload) {
		const animal = await this.prisma.animal.findUnique({
			where: { id },
		});
		if (!animal) {
			throw new NotFoundException(`Animal not found`);
		}

		this.checkUserPermission(animal.userId, requestUser);

		await this.prisma.$transaction([
			this.prisma.petImage.deleteMany({
				where: { animalId: id },
			}),
			this.prisma.customerImage.deleteMany({
				where: { animalId: id },
			}),
			this.prisma.animal.delete({
				where: { id },
			}),
		]);

		return { message: 'Animal deleted successfully' };
	}

	private checkUserPermission(animalUserId: number, requestUser: JwtPayload) {
		if (animalUserId !== requestUser.id && requestUser.role !== Role.ADMIN) {
			throw new ForbiddenException('You dont have permission to perform this action');
		}
	}
}
