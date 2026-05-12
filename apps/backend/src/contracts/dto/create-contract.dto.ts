import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateContractDto {
  @IsUUID()
  listingId: string;

  @IsUUID()
  tenantId: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  body?: string;
}
