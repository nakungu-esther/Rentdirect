import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { UsersService } from './users.service';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('health')
  health() {
    return this.usersService.health();
  }
}
