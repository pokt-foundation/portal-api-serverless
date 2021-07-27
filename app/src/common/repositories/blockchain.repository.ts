import { Blockchain } from '../models/blockchain'

export interface BlockchainRepository {
  getAllBlockchains(): Promise<Blockchain[]>
}
