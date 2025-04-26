import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { JwtStrategyModule } from '../jwt-strategy/jwt-strategy.module';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [JwtStrategyModule],
  controllers: [AnimalsController],
  providers: [AnimalsService, RolesGuard],
})
export class AnimalsModule {}
