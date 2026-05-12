import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { RentalsService } from './rentals.service';

@Public()
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get('health')
  health() {
    return this.rentalsService.health();
  }
}
