import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { Contract } from './entities/contract.entity';
import { Listing } from '../listings/entities/listing.entity';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, Listing]),
    BlockchainModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
