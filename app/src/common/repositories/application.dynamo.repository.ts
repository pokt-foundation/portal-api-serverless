
import { ApplicationRepository } from './application.repository';
import { DynamoDB } from 'aws-sdk';
import { Application } from '../models/application';

export class ApplicationDynamoClientRepository implements ApplicationRepository {
  table: string
  docClient: DynamoDB.DocumentClient;

  constructor(table: string) {
    this.docClient = new DynamoDB.DocumentClient()
    this.table = table
  }

  async getApplication(id: string): Promise<Application> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.table,
      Key: {
          "id": id
      }
    }
  
    const result: DynamoDB.DocumentClient.GetItemOutput = await this.docClient.get(params).promise();
    return result.Item as Application;
  } 
}