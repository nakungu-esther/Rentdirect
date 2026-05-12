import { IsString, Length, Matches } from 'class-validator';

export class OtpVerifyDto {
  @IsString()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Invalid phone number' })
  phone: string;

  @IsString()
  @Length(4, 8)
  code: string;
}
