
import { BlockchainRepository } from './blockchain.repository';
import { DynamoDB } from 'aws-sdk';
import { getString } from '../env/index';
import { Blockchain } from '../models/blockchain';

const BLOCKCHAIN_TABLE_NAME = 'blockchains'

export class BlockchainDynamoClientRepository implements BlockchainRepository {
  table: string
  docClient: DynamoDB.DocumentClient;

  constructor(table?: string) {
    this.docClient = new DynamoDB.DocumentClient()
    this.table = getString(table, BLOCKCHAIN_TABLE_NAME)
  }

  // Retrieves all the available blockchains on the table
  // TODO: Add pagination, error handling
  async getBlockchains(): Promise<Blockchain[]> {
    const blockchains : Blockchain[] = []
    let lastEvaluatedKey;

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.table,
      ConsistentRead: true,
    }

    do {
      const data = await this.docClient.scan(params).promise()
      data.Items?.forEach((blockchain) => blockchains.push(blockchain as Blockchain))
      
      lastEvaluatedKey = data.LastEvaluatedKey
      params.ExclusiveStartKey = lastEvaluatedKey;
    } while(lastEvaluatedKey !== undefined)

    return blockchains
  } 
}