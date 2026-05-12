import { IsEmail, IsEnum, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Role } from '../../common/enums/roles.enum';

const SELF_REGISTER_ROLES = [Role.TENANT, Role.LANDLORD, Role.AGENT] as const;

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Invalid phone number' })
  phone: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export function normalizeRegisterRole(role?: Role): Role {
  const r = role ?? Role.TENANT;
  if (!SELF_REGISTER_ROLES.includes(r as (typeof SELF_REGISTER_ROLES)[number])) {
    return Role.TENANT;
  }
  return r;
}
