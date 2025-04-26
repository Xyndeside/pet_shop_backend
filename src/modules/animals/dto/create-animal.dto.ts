import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { AnimalStatus, Gender, Size } from '@prisma/client';

export class CreateAnimalDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsEnum(Gender)
	gender: Gender;

	@IsNumber()
	@Min(0)
	@Max(100)
	age: number;

	@IsNumber()
    @Min(0)
	price: number;

	@IsString()
	@IsNotEmpty()
	color: string;

	@IsEnum(Size)
	size: Size;

	@IsString()
	@IsOptional()
	location?: string;

	@IsEnum(AnimalStatus)
	@IsOptional()
	status?: AnimalStatus;
}
