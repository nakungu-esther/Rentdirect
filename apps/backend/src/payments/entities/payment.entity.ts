import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';

export enum PaymentStatus {
  PENDING   = 'pending',
  COMPLETED = 'completed',
  FAILED    = 'failed',
  REFUNDED  = 'refunded',
}

export enum PaymentProvider {
  MTN_MOMO  = 'mtn_momo',
  AIRTEL    = 'airtel',
  VISA      = 'visa',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: User;
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Listing, { eager: false })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;
  @Column({ name: 'listing_id' })
  listingId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amountUGX: number;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider: PaymentProvider;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true, name: 'provider_ref' })
  providerRef: string;     // MTN / Airtel transaction ID

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;     // MoMo number used

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true, name: 'paid_at' })
  paidAt: Date;

  @Column({ nullable: true, name: 'sui_tx_digest' })
  suiTxDigest: string;

  @Column({ nullable: true, name: 'walrus_receipt_cid' })
  walrusReceiptCid: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
