import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { OtpService } from './otp.service';
import { RegisterDto, normalizeRegisterRole } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly otp: OtpService,
  ) {}

  health() {
    return { module: 'auth', status: 'ok' };
  }

  async register(dto: RegisterDto) {
    const role = normalizeRegisterRole(dto.role);
    const user = await this.users.createUser({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      phone: dto.phone,
      role,
    });
    return this.issueTokenPair(user);
  }

  async login(dto: { email?: string; phone?: string; password: string }) {
    const password = dto.password;

    const hasEmail = typeof dto.email === 'string' && dto.email.trim().length > 0;
    const hasPhone =
      typeof dto.phone === 'string' && dto.phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      throw new BadRequestException('Provide email or phone');
    }

    const user = hasPhone
      ? await this.users.findByPhoneWithCredentials(dto.phone!)
      : await this.users.findByEmailWithCredentials(dto.email!);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const ok = await this.users.validatePassword(user, password);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account disabled');
    }
    const fresh = await this.users.findById(user.id);
    return this.issueTokenPair(fresh!);
  }

  async sendOtp(phone: string) {
    const extra = await this.otp.sendForPhone(phone);
    return { sent: true, ...extra };
  }

  async verifyOtp(phone: string, code: string) {
    await this.otp.verifyPhone(phone, code);
    const user = await this.users.findByPhone(phone);
    if (!user) {
      throw new BadRequestException('No user with this phone');
    }
    await this.users.setPhoneVerified(user.id, true);
    return { verified: true };
  }

  async refresh(refreshToken: string, userId: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(
        refreshToken,
        {
          secret:
            this.config.get<string>('jwt.refreshSecret') ?? 'change_me_refresh',
        },
      );
      if (payload.sub !== userId) {
        throw new UnauthorizedException();
      }
      const user = await this.users.findById(userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }
      return this.issueTokenPair(user!);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.users.toPublicUser(user);
  }

  private async issueTokenPair(user: User) {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        secret:
          this.config.get<string>('jwt.refreshSecret') ?? 'change_me_refresh',
        expiresIn:
          this.config.get<string>('jwt.refreshExpiresIn') ?? '30d',
      },
    );
    const full = await this.users.findById(user.id);
    return {
      user: this.users.toPublicUser(full ?? user),
      accessToken,
      refreshToken,
    };
  }
}
