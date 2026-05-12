import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private repo: Repository<Payment>,
    private readonly blockchain: BlockchainService,
  ) {}

  async initiate(tenantId: string, dto: InitiatePaymentDto): Promise<Payment> {
    const payment = this.repo.create({
      tenantId,
      listingId: dto.listingId,
      amountUGX: dto.amountUGX,
      provider: dto.provider,
      phoneNumber: dto.phoneNumber,
      status: PaymentStatus.PENDING,
    });
    const saved = await this.repo.save(payment);

    // TODO: call MTN MoMo / Airtel API here
    // const momoResponse = await this.momoService.requestToPay(saved);
    // await this.repo.update(saved.id, { providerRef: momoResponse.referenceId });

    return saved;
  }

  // Called by payment provider webhook
  async handleWebhook(providerRef: string, status: 'success' | 'failed'): Promise<void> {
    const payment = await this.repo.findOne({ where: { providerRef } });
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = status === 'success' ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
    if (status === 'success') payment.paidAt = new Date();
    await this.repo.save(payment);
  }

  async findByTenant(tenantId: string): Promise<Payment[]> {
    return this.repo.find({
      where: { tenantId },
      relations: ['listing'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByListing(listingId: string): Promise<Payment[]> {
    return this.repo.find({
      where: { listingId },
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const p = await this.repo.findOne({ where: { id }, relations: ['listing', 'tenant'] });
    if (!p) throw new NotFoundException('Payment not found');
    return p;
  }

  /** Dev/MVP: mark a pending payment completed and attach stub chain metadata. */
  async stubCompleteForTenant(id: string, tenantId: string): Promise<Payment> {
    const payment = await this.repo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.tenantId !== tenantId) {
      throw new ForbiddenException('Not your payment');
    }
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not pending');
    }
    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    payment.suiTxDigest = this.blockchain.stubSuiPaymentDigest(payment.id);
    payment.walrusReceiptCid = this.blockchain.stubWalrusReceiptCid(payment.id);
    return this.repo.save(payment);
  }
}
