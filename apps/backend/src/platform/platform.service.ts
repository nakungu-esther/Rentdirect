import { Injectable } from '@nestjs/common';
import {
  PLATFORM_MODULE_ROADMAP,
  ProductPhase,
  Surface,
  type PlatformModuleDefinition,
} from './constants/module-roadmap';

@Injectable()
export class PlatformService {
  getRoadmap(): PlatformModuleDefinition[] {
    return PLATFORM_MODULE_ROADMAP;
  }

  getByPhase(phase: ProductPhase): PlatformModuleDefinition[] {
    return PLATFORM_MODULE_ROADMAP.filter((module) => module.phase === phase);
  }

  getBySurface(surface: Surface): PlatformModuleDefinition[] {
    return PLATFORM_MODULE_ROADMAP.filter((module) =>
      module.surfaces.includes(surface),
    );
  }
}
