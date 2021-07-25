import { LambdaApp } from '../lambda-app';
import { ApiGatewayEvent } from '../../common/apigateway/apigateway-event';
import { ApiGatewayResponse } from '../../common/apigateway/apigateway-response';
import { TodoRepository } from '../../common/repositories/todo-repository';

/**
 * GetBlockchains queries all the blockchains available in DynamoDB
 */
export class GetBlockchains implements LambdaApp {
  table: string
  repository: TodoRepository

  constructor(table: string, repository: TodoRepository) {
    this.table = table
    this.repository = repository
  }

  async run(event: ApiGatewayEvent) : Promise<ApiGatewayResponse> {
    try {
      
    } catch(err) {
      console.log(err.message)
      return {statusCode: 500}
    }
    return {
      statusCode: 200
    }
  }
} 