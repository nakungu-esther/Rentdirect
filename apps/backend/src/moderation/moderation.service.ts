import { Injectable } from '@nestjs/common';

@Injectable()
export class ModerationService {
  health() {
    return { module: 'moderation', status: 'ok' };
  }
}
