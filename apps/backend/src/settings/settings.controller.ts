import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { SettingsService } from './settings.service';

@Public()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('health')
  health() {
    return this.settingsService.health();
  }
}
