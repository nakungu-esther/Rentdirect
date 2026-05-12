import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '../entities/payment.entity';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsUUID() listingId: string;

  @ApiProperty({ example: 800000 })
  @IsNumber() @Min(1000)
  amountUGX: number;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ example: '+256700123456' })
  @IsString() @IsNotEmpty()
  @Matches(/^\+256[0-9]{9}$/, { message: 'Valid Uganda phone required: +256XXXXXXXXX' })
  phoneNumber: string;
}
