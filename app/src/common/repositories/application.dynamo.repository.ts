import { ApplicationRepository } from './application.repository'
import { DynamoDB } from 'aws-sdk'
import { Application } from '../models/application'

const TABLE_NAME = 'Applications'

export class ApplicationDynamoClientRepository implements ApplicationRepository {
  table: string
  docClient: DynamoDB.DocumentClient

  constructor(table: string | undefined) {
    this.docClient = new DynamoDB.DocumentClient()
    this.table = table || TABLE_NAME
  }

  async getApplication(id: string): Promise<Application> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.table,
      Key: {
        id: id,
      },
    }

    const result: DynamoDB.DocumentClient.GetItemOutput = await this.docClient.get(params).promise()
    return result.Item as Application
  }
}
