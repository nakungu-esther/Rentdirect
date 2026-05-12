import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { BlockchainService } from './blockchain.service';

@Public()
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('health')
  health() {
    return this.blockchainService.health();
  }
}
