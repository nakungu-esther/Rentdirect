import { Injectable } from '@nestjs/common';

@Injectable()
export class RentalsService {
  health() {
    return { module: 'rentals', status: 'ok' };
  }
}
