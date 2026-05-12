import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';

@ApiTags('Contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Public()
  @Get('health')
  health() {
    return this.contractsService.health();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TENANT, Role.AGENT)
  @Get('mine/tenant')
  @ApiOperation({ summary: 'Contracts where I am the tenant' })
  mineAsTenant(@CurrentUser() user: { sub: string }) {
    return this.contractsService.findByTenant(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Get('mine/landlord')
  @ApiOperation({ summary: 'Contracts I created as landlord' })
  mineAsLandlord(@CurrentUser() user: { sub: string }) {
    return this.contractsService.findByLandlord(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  @Post()
  @ApiOperation({ summary: 'Create rental contract draft (landlord)' })
  create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateContractDto,
  ) {
    return this.contractsService.create(user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TENANT)
  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign contract as tenant (MVP stub)' })
  sign(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.contractsService.signAsTenant(id, user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get contract (tenant or landlord on record)' })
  findOne(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.contractsService.findOneForParticipant(id, user.sub);
  }
}
