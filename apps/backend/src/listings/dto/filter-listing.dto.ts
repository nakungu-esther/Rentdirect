import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../entities/listing.entity';

export class FilterListingDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsOptional() @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  minPrice?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(1)
  limit?: number = 20;
}
