import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { FilterListingDto } from './dto/filter-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private repo: Repository<Listing>,
  ) {}

  async create(landlordId: string, dto: CreateListingDto): Promise<Listing> {
    const listing = this.repo.create({ ...dto, landlordId, status: ListingStatus.ACTIVE });
    return this.repo.save(listing);
  }

  async findAll(filters: FilterListingDto) {
    const qb = this.repo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.landlord', 'landlord')
      .select([
        'l', 'landlord.id', 'landlord.fullName', 'landlord.phone',
      ])
      .where('l.status = :status', { status: ListingStatus.ACTIVE });

    if (filters.location)     qb.andWhere('LOWER(l.location) LIKE :loc',  { loc: `%${filters.location.toLowerCase()}%` });
    if (filters.propertyType) qb.andWhere('l.propertyType = :pt',         { pt: filters.propertyType });
    if (filters.bedrooms)     qb.andWhere('l.bedrooms = :bed',            { bed: filters.bedrooms });
    if (filters.minPrice)     qb.andWhere('l.priceUGX >= :min',           { min: filters.minPrice });
    if (filters.maxPrice)     qb.andWhere('l.priceUGX <= :max',           { max: filters.maxPrice });

    const page  = filters.page  || 1;
    const limit = filters.limit || 20;
    qb.skip((page - 1) * limit).take(limit).orderBy('l.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.repo.findOne({
      where: { id },
      relations: ['landlord'],
    });
    if (!listing) throw new NotFoundException('Listing not found');
    // increment view count
    await this.repo.increment({ id }, 'viewCount', 1);
    return listing;
  }

  async findByLandlord(landlordId: string): Promise<Listing[]> {
    return this.repo.find({
      where: { landlordId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, userId: string, dto: UpdateListingDto): Promise<Listing> {
    const listing = await this.findOne(id);
    if (listing.landlordId !== userId) throw new ForbiddenException('Not your listing');
    Object.assign(listing, dto);
    return this.repo.save(listing);
  }

  async remove(id: string, userId: string): Promise<void> {
    const listing = await this.findOne(id);
    if (listing.landlordId !== userId) throw new ForbiddenException('Not your listing');
    await this.repo.remove(listing);
  }
}
