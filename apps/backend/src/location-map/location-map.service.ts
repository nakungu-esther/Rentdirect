import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationMapService {
  health() {
    return { module: 'location-map', status: 'ok' };
  }
}
