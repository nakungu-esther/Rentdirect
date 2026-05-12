import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  SIGNED = 'signed',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Listing, { eager: false })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;
  @Column({ name: 'listing_id' })
  listingId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: User;
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;
  @Column({ name: 'landlord_id' })
  landlordId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @Column({ nullable: true, name: 'walrus_document_cid' })
  walrusDocumentCid: string;

  @Column({ nullable: true, name: 'sui_object_id' })
  suiObjectId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'signed_at', type: 'timestamp' })
  signedAt: Date;
}
