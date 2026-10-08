import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  // Lets support flip a user's role without going through the admin panel.
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: UserRole;
}
