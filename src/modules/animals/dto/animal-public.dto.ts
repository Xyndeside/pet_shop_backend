import { AnimalStatus, CustomerImage, Gender, PetImage, Size } from '@prisma/client';

export interface AnimalPublicDto {
    id: number,
    title: string,
    description: string,
    gender: Gender,
    age: number,
    price: number,
    color: string,
    size: Size,
    location: string | null,
    petImages: PetImage[],
    customerImages: CustomerImage[],
}

export interface AnimalFullDto extends AnimalPublicDto {
    status: AnimalStatus,
    userId: number,
    created_at: Date,
    updated_at: Date,
}