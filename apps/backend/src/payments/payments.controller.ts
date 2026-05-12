import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.TENANT, Role.AGENT)
  @Post('initiate')
  @ApiOperation({ summary: 'Initiate MoMo / Airtel payment (tenant)' })
  initiate(@CurrentUser() user: any, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.TENANT, Role.AGENT)
  @Get('my')
  @ApiOperation({ summary: 'My payment history (tenant)' })
  myPayments(@CurrentUser() user: any) {
    return this.paymentsService.findByTenant(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.TENANT, Role.AGENT)
  @Post(':id/stub-complete')
  @ApiOperation({
    summary: 'Stub-complete payment (tenant, dev/MVP)',
    description:
      'Marks a pending payment as completed and attaches stub Sui digest + Walrus CID.',
  })
  stubComplete(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.paymentsService.stubCompleteForTenant(id, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single payment' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  // Webhook — called by MTN / Airtel (no auth)
  @Public()
  @Post('webhook/momo')
  @ApiOperation({ summary: 'MTN MoMo webhook (called by provider)' })
  momoWebhook(@Body() body: { referenceId: string; status: string }) {
    const status = body.status === 'SUCCESSFUL' ? 'success' : 'failed';
    return this.paymentsService.handleWebhook(body.referenceId, status as any);
  }
}
