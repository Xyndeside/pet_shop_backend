import { Module } from '@nestjs/common';
import { JwtStrategyService } from './jwt-strategy.service';
import { JwtStrategyController } from './jwt-strategy.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [JwtStrategyController],
    providers: [JwtStrategyService, JwtStrategy],
    exports: [JwtStrategy],
})
export class JwtStrategyModule {}
