import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { LocationMapService } from './location-map.service';

@Public()
@Controller('location-map')
export class LocationMapController {
  constructor(private readonly locationMapService: LocationMapService) {}

  @Get('health')
  health() {
    return this.locationMapService.health();
  }
}
