import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import { JwtPayload, ValidateResponse } from '../../common/types/jwt-strategy.types';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        const secret = process.env.JWT_SECRET || configService.get<string>('JWT_SECRET');
		if (!secret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    validate(payload: JwtPayload): ValidateResponse {
        return {
            id: payload.id,
            role: payload.role,
        }
    }
}