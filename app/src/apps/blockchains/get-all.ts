import { LambdaApp } from '../lambda-app';
import { ApiGatewayResponse } from '../../common/apigateway/apigateway-response';
import { BlockchainRepository } from '../../common/repositories/blockchain.repository';

/**
 * GetBlockchains queries all the blockchains available in DynamoDB
 */
export class GetBlockchains implements LambdaApp {
  repository: BlockchainRepository

  constructor(repository: BlockchainRepository) {
    this.repository = repository
  }

  async run() : Promise<ApiGatewayResponse> {
    try {
      const blockchains = await this.repository.getAllBlockchains()

      return {statusCode: 200, body: JSON.stringify(blockchains)}
    } catch(err) {
      console.log(err.message)
      return {statusCode: 500}
    }
  }
} 