import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const OTP_TTL_SEC = 600;

@Injectable()
export class OtpService {
  private readonly redis: Redis | null;
  private readonly memory = new Map<string, { code: string; expiresAt: number }>();

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('REDIS_URL');
    this.redis = url ? new Redis(url, { maxRetriesPerRequest: 1 }) : null;
  }

  private key(phone: string) {
    return `otp:phone:${phone.trim()}`;
  }

  /** Generate and store OTP for phone. In non-production, dev code can be fixed via OTP_DEV_CODE. */
  async sendForPhone(phone: string): Promise<{ debugOtp?: string }> {
    const isProd = this.config.get('NODE_ENV') === 'production';
    const devCode = this.config.get<string>('OTP_DEV_CODE') ?? '123456';
    const code = isProd
      ? String(Math.floor(100000 + Math.random() * 900000))
      : devCode;

    const k = this.key(phone);
    if (this.redis) {
      await this.redis.set(k, code, 'EX', OTP_TTL_SEC);
    } else {
      this.memory.set(k, {
        code,
        expiresAt: Date.now() + OTP_TTL_SEC * 1000,
      });
    }

    return isProd ? {} : { debugOtp: code };
  }

  async verifyPhone(phone: string, code: string): Promise<boolean> {
    const k = this.key(phone);
    let stored: string | null = null;

    if (this.redis) {
      stored = await this.redis.get(k);
    } else {
      const row = this.memory.get(k);
      if (row && row.expiresAt > Date.now()) {
        stored = row.code;
      } else {
        this.memory.delete(k);
      }
    }

    if (!stored || stored !== code.trim()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (this.redis) {
      await this.redis.del(k);
    } else {
      this.memory.delete(k);
    }
    return true;
  }
}
