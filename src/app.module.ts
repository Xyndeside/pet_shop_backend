import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategyModule } from './modules/jwt-strategy/jwt-strategy.module';
import { AnimalsModule } from './modules/animals/animals.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		UsersModule,
		AuthModule,
		JwtStrategyModule,
		AnimalsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
