import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PlatformService } from './platform.service';
import { ProductPhase, Surface } from './constants/module-roadmap';

@Public()
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('roadmap')
  getRoadmap() {
    return this.platformService.getRoadmap();
  }

  @Get('phase/:phase')
  getByPhase(@Param('phase') phase: ProductPhase) {
    return this.platformService.getByPhase(phase);
  }

  @Get('surface/:surface')
  getBySurface(@Param('surface') surface: Surface) {
    return this.platformService.getBySurface(surface);
  }
}
