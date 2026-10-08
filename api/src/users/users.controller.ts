import { Body, Controller, Get, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const full = await this.users.findById(user.id);
    if (!full) {
      throw new NotFoundException('User not found');
    }
    return this.users.toPublic(full);
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto) {
    const updated = await this.users.updateProfile(user.id, dto);
    return this.users.toPublic(updated);
  }
}
