import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, name: 'password_hash', select: false })
  passwordHash?: string;

  @Column({ type: 'varchar', length: 32, default: Role.TENANT })
  role: Role;

  @Column({ default: false, name: 'phone_verified' })
  phoneVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
