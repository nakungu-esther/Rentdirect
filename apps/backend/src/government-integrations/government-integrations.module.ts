import { Module } from '@nestjs/common';
import { GovernmentIntegrationsController } from './government-integrations.controller';
import { GovernmentIntegrationsService } from './government-integrations.service';

@Module({
  controllers: [GovernmentIntegrationsController],
  providers: [GovernmentIntegrationsService],
  exports: [GovernmentIntegrationsService],
})
export class GovernmentIntegrationsModule {}
