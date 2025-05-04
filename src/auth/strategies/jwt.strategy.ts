import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../auth.module';

interface JwtPayload {
  username: string;
  sub: number; // 'sub' is standard JWT terminology for subject (usually user ID)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Passport automatically verifies the JWT signature and expiration based on the options
  // It then calls this validate method with the decoded payload
  validate(payload: JwtPayload): { userId: number; username: string } {
    // We trust the payload because Passport verified the token
    // You could add extra validation here (e.g., check if user ID exists in DB)
    return { userId: payload.sub, username: payload.username };
    // The return value is attached to request.user
  }
}
