import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListProductsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}
