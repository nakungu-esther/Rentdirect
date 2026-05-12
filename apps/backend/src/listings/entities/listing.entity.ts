import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ListingStatus {
  DRAFT     = 'draft',
  ACTIVE    = 'active',
  RENTED    = 'rented',
  SUSPENDED = 'suspended',
}

export enum PropertyType {
  APARTMENT    = 'apartment',
  HOUSE        = 'house',
  ROOM         = 'room',
  COMMERCIAL   = 'commercial',
  LAND         = 'land',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PropertyType })
  propertyType: PropertyType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  priceUGX: number;

  @Column()
  location: string;   // district

  @Column()
  address: string;    // street / area

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ default: 0 })
  bedrooms: number;

  @Column({ default: 0 })
  bathrooms: number;

  @Column({ default: false })
  isFurnished: boolean;

  @Column('simple-array', { nullable: true })
  amenities: string[];   // ['wifi', 'parking', 'water', 'security']

  @Column('simple-array', { nullable: true })
  photos: string[];      // file paths / S3 URLs

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.DRAFT })
  status: ListingStatus;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'landlord_id' })
  landlord: User;

  @Column({ name: 'landlord_id' })
  landlordId: string;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
