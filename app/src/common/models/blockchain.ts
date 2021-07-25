export interface Blockchain {
  ticker: string
  hash: string
  networkID: string
  network: string
  description?: string
  index: string
  blockchain: string
  active: boolean
  syncCheck?: string
}