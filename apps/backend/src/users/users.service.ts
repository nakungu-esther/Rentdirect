import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Role } from '../common/enums/roles.enum';

export type CreateUserInput = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: Role;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  health() {
    return { module: 'users', status: 'ok' };
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phone: phone.trim() } });
  }

  /** Includes password hash for login validation */
  async findByEmailWithCredentials(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email: email.trim() })
      .addSelect('u.passwordHash')
      .getOne();
  }

  /** Includes password hash for login validation */
  async findByPhoneWithCredentials(phone: string): Promise<User | null> {
    const normalized = phone.trim();
    return this.repo
      .createQueryBuilder('u')
      .where('u.phone = :phone', { phone: normalized })
      .addSelect('u.passwordHash')
      .getOne();
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const email = input.email.toLowerCase().trim();
    const phone = input.phone.trim();

    const emailTaken = await this.repo.findOne({ where: { email } });
    if (emailTaken) {
      throw new ConflictException('Email already registered');
    }
    const phoneTaken = await this.repo.findOne({ where: { phone } });
    if (phoneTaken) {
      throw new ConflictException('Phone already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.repo.create({
      email,
      fullName: input.fullName.trim(),
      phone,
      passwordHash,
      role: input.role,
    });
    return this.repo.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async setPhoneVerified(userId: string, verified: boolean): Promise<void> {
    await this.repo.update({ id: userId }, { phoneVerified: verified });
  }

  toPublicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      phoneVerified: user.phoneVerified,
      isVerified: user.isVerified,
      isActive: user.isActive,
    };
  }
}
