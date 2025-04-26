import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategyModule } from '../jwt-strategy/jwt-strategy.module';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
    imports: [JwtStrategyModule],
    controllers: [UsersController],
    providers: [UsersService, RolesGuard],
    exports: [UsersService],
})
export class UsersModule {}
