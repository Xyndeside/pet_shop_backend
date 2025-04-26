import { Controller } from '@nestjs/common';
import { JwtStrategyService } from './jwt-strategy.service';

@Controller('jwt-strategy')
export class JwtStrategyController {
    constructor(private readonly jwtStrategyService: JwtStrategyService) {}
}
