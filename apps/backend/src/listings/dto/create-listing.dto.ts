import {
  IsString, IsEnum, IsNumber, IsBoolean,
  IsOptional, IsArray, Min, IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../entities/listing.entity';

export class CreateListingDto {
  @ApiProperty({ example: 'Modern 2-bedroom apartment in Kololo' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Spacious apartment with great views...' })
  @IsString() @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 800000, description: 'Monthly rent in UGX' })
  @IsNumber() @Min(0)
  priceUGX: number;

  @ApiProperty({ example: 'Kampala' })
  @IsString() @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Kololo Hill Drive, Plot 12' })
  @IsString() @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: '0.3476' })
  @IsOptional() @IsString()
  latitude?: string;

  @ApiPropertyOptional({ example: '32.5825' })
  @IsOptional() @IsString()
  longitude?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional() @IsNumber() @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsNumber() @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  isFurnished?: boolean;

  @ApiPropertyOptional({ example: ['wifi', 'parking', 'water'] })
  @IsOptional() @IsArray() @IsString({ each: true })
  amenities?: string[];
}
