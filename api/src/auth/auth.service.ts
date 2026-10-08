import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.users.findByEmail(email);
    // Same error for unknown email and wrong password, so accounts cannot be enumerated.
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
