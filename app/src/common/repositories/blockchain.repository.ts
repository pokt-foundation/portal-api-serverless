import { Blockchain } from '../models/blockchain';

export interface BlockchainRepository {
  getBlockchains(table?: string): Promise<Blockchain[]>
}