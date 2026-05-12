import { Module } from '@nestjs/common';
import { LocationMapController } from './location-map.controller';
import { LocationMapService } from './location-map.service';

@Module({
  controllers: [LocationMapController],
  providers: [LocationMapService],
  exports: [LocationMapService],
})
export class LocationMapModule {}
