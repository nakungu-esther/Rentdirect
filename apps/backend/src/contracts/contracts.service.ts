import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { Listing } from '../listings/entities/listing.entity';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contracts: Repository<Contract>,
    @InjectRepository(Listing)
    private readonly listings: Repository<Listing>,
    private readonly blockchain: BlockchainService,
  ) {}

  health() {
    return { module: 'contracts', status: 'ok' };
  }

  async create(landlordId: string, dto: CreateContractDto): Promise<Contract> {
    const listing = await this.listings.findOne({ where: { id: dto.listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.landlordId !== landlordId) {
      throw new ForbiddenException('Not your listing');
    }
    const row = this.contracts.create({
      listingId: dto.listingId,
      tenantId: dto.tenantId,
      landlordId,
      title: dto.title.trim(),
      body: dto.body?.trim(),
      status: ContractStatus.DRAFT,
    });
    const saved = await this.contracts.save(row);
    saved.walrusDocumentCid = this.blockchain.stubWalrusDocumentCid(saved.id);
    saved.suiObjectId = this.blockchain.stubSuiObjectId(saved.id);
    return this.contracts.save(saved);
  }

  async signAsTenant(contractId: string, tenantId: string): Promise<Contract> {
    const c = await this.contracts.findOne({ where: { id: contractId } });
    if (!c) throw new NotFoundException('Contract not found');
    if (c.tenantId !== tenantId) {
      throw new ForbiddenException('Not your contract');
    }
    if (c.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('Contract is not signable');
    }
    c.status = ContractStatus.SIGNED;
    c.signedAt = new Date();
    return this.contracts.save(c);
  }

  async findOneForParticipant(id: string, userId: string): Promise<Contract> {
    const c = await this.contracts.findOne({
      where: { id },
      relations: ['listing', 'tenant', 'landlord'],
    });
    if (!c) throw new NotFoundException('Contract not found');
    if (c.tenantId !== userId && c.landlordId !== userId) {
      throw new ForbiddenException('Not a party to this contract');
    }
    return c;
  }

  async findByTenant(tenantId: string): Promise<Contract[]> {
    return this.contracts.find({
      where: { tenantId },
      relations: ['listing', 'landlord'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByLandlord(landlordId: string): Promise<Contract[]> {
    return this.contracts.find({
      where: { landlordId },
      relations: ['listing', 'tenant'],
      order: { createdAt: 'DESC' },
    });
  }
}
