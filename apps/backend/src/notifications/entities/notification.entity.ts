import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  PAYMENT     = 'payment',
  NEW_LISTING = 'new_listing',
  MESSAGE     = 'message',
  SYSTEM      = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @Column({ nullable: true })
  link: string;  // deep-link into the app

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
