import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { SupportService } from './support.service';

@Public()
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('health')
  health() {
    return this.supportService.health();
  }
}
