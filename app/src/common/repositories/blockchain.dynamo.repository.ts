import { BlockchainRepository } from './blockchain.repository'
import { DynamoDB } from 'aws-sdk'
import { Blockchain } from '../models/blockchain'

const TABLE_NAME = 'Blockchains'

export class BlockchainDynamoClientRepository implements BlockchainRepository {
  table: string
  docClient: DynamoDB.DocumentClient

  constructor(table?: string) {
    this.docClient = new DynamoDB.DocumentClient()
    this.table = table || TABLE_NAME
  }

  // Retrieves all the available blockchains on the table
  // TODO: Add pagination, error handling
  async getAllBlockchains(): Promise<Blockchain[]> {
    const blockchains: Blockchain[] = []
    let lastEvaluatedKey

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.table,
      ConsistentRead: true,
    }

    do {
      const data = await this.docClient.scan(params).promise()
      data.Items?.forEach((blockchain) => blockchains.push(blockchain as Blockchain))

      lastEvaluatedKey = data.LastEvaluatedKey
      params.ExclusiveStartKey = lastEvaluatedKey
    } while (lastEvaluatedKey !== undefined)

    return blockchains
  }
}
