import { IsString, Matches } from 'class-validator';

export class OtpSendDto {
  @IsString()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Invalid phone number' })
  phone: string;
}
