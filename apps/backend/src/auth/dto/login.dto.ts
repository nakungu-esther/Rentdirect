import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Invalid phone number' })
  phone?: string;

  @IsString()
  @MinLength(1)
  password: string;
}
