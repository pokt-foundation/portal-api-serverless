import { LambdaApp } from '../lambda-app'
import { ApiGatewayResponse, newJSONResponse } from '../../common/apigateway/apigateway-response'
import { BlockchainRepository } from '../../common/repositories/blockchain.repository'
import HttpStatusCode from '../../common/utils/http-status-code'

/**
 * GetBlockchains queries all the blockchains available in DynamoDB
 */
export class GetBlockchains implements LambdaApp {
  repository: BlockchainRepository

  constructor(repository: BlockchainRepository) {
    this.repository = repository
  }

  async run(): Promise<ApiGatewayResponse> {
    try {
      const blockchains = await this.repository.getAllBlockchains()

      return newJSONResponse(HttpStatusCode.OK, blockchains)
    } catch (err) {
      console.log(err.message)
      return { statusCode: 500 }
    }
  }
}
