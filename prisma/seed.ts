// prisma/seed.ts
import {
	PrismaClient,
	Role,
	Gender,
	Size,
	ProductType,
	NoticeType,
	AnimalStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE "PetImage" RESTART IDENTITY CASCADE`);
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE "CustomerImage" RESTART IDENTITY CASCADE`);
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Animal" RESTART IDENTITY CASCADE`);
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`);
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Notice" RESTART IDENTITY CASCADE`);
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`);

	// Create users
	await prisma.user.create({
		data: {
			username: 'admin',
			email: 'admin@example.com',
			phone: '1234567890',
			password: await bcrypt.hash('admin', 5),
			role: Role.ADMIN,
		},
	});

	const user = await prisma.user.create({
		data: {
			username: 'userTest',
			email: 'userTest@example.com',
			phone: '0987654321',
			password: await bcrypt.hash('123456', 5),
		},
	});

	// Create animals
	for (let i = 1; i <= 3; i++) {
		const animal = await prisma.animal.create({
			data: {
				title: `Animal ${i}`,
				description: `Description for animal ${i}`,
				gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
				age: 2 + i,
				price: 100 + i * 50,
				color: 'Brown',
				size: Size.MEDIUM,
				location: 'City Center',
				status: AnimalStatus.AVAILABLE,
				userId: user.id,
			},
		});

		// Add pet images
		for (let j = 1; j <= 3; j++) {
			await prisma.petImage.create({
				data: {
					url: `pet-image-${i}-${j}.jpg`,
					isMain: j === 1,
					animalId: animal.id,
				},
			});
		}

		// Add customer images
		for (let k = 1; k <= 3; k++) {
			await prisma.customerImage.create({
				data: {
					url: `customer-image-${i}-${k}.jpg`,
					animalId: animal.id,
				},
			});
		}
	}

	// Create products
	await prisma.product.createMany({
		data: [
			{ title: 'Dog Food Premium', size: 1.5, type: ProductType.DOG_FOOD, price: 25.99 },
			{ title: 'Cat Costume Cute', size: 0.3, type: ProductType.COSTUME, price: 15.5 },
			{ title: 'Chew Toy', size: 0.2, type: ProductType.TOY, price: 8.75 },
		],
	});

	// Create notices
	await prisma.notice.createMany({
		data: [
			{
				title: 'How to Train Your Pet',
				type: NoticeType.PET_TRAINING,
				text: 'Training tips...',
			},
			{ title: 'Adopting a Pet', type: NoticeType.PET_ADOPTION, text: 'Adoption info...' },
			{
				title: 'Pet Health Basics',
				type: NoticeType.PET_HEALTH,
				text: 'Health guidelines...',
			},
		],
	});
}

main()
	.then(() => {
		console.log('Seed complete');
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
