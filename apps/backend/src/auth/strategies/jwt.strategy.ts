import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../common/enums/roles.enum';

export type JwtUser = { sub: string; email?: string; role?: Role };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret') ?? 'change_me',
    });
  }

  async validate(payload: {
    sub: string;
    email?: string;
    role?: Role;
  }): Promise<JwtUser> {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
