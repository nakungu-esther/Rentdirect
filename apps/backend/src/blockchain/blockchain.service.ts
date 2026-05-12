import { Injectable } from '@nestjs/common';

/** MVP stubs for Sui + Walrus; replace with real SDK calls later. */
@Injectable()
export class BlockchainService {
  health() {
    return { module: 'blockchain', status: 'ok' };
  }

  stubSuiPaymentDigest(paymentId: string): string {
    return `sui_stub_${paymentId.slice(0, 8)}_${Date.now()}`;
  }

  stubWalrusReceiptCid(paymentId: string): string {
    return `walrus_stub_${paymentId.slice(0, 8)}_${Date.now()}`;
  }

  stubWalrusDocumentCid(contractId: string): string {
    return `walrus_doc_${contractId.slice(0, 8)}_${Date.now()}`;
  }

  stubSuiObjectId(contractId: string): string {
    return `sui_obj_stub_${contractId.slice(0, 8)}`;
  }
}
