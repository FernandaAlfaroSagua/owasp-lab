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

  // Just the column/direction names the UI sends, so a fixed list of
  // options felt like overkill here.
  @IsOptional()
  @IsString()
  @MaxLength(200)
  sort?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  dir?: string;
}
