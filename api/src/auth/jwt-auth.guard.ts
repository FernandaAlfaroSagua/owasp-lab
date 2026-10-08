import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from './auth.service';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export type AuthenticatedRequest = Request & { user: AuthUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      // verifyAsync checks the signature and the expiry using the configured secret.
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      request.user = { id: payload.sub, email: payload.email, role: payload.role };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}
