import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async create(userId: string, title: string, body: string, type: NotificationType, link?: string) {
    const n = this.repo.create({ userId, title, body, type, link });
    return this.repo.save(n);
  }

  async findAll(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    await this.repo.update({ id, userId }, { isRead: true });
  }

  async markAllRead(userId: string) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
  }

  async unreadCount(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, isRead: false } });
  }
}
