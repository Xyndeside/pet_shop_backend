import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { AnimalStatus, Gender, Size } from '@prisma/client';

export class UpdateAnimalDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    age?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    color?: string;

    @IsEnum(Size)
    @IsOptional()
    size?: Size;

    @IsString()
    @IsOptional()
    location?: string;

    @IsEnum(AnimalStatus)
    @IsOptional()
    status?: AnimalStatus;
}