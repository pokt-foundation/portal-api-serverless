import { ApiGatewayResponse } from '../../common/apigateway/apigateway-response'
import { BlockchainDynamoClientRepository } from '../../common/repositories/blockchain.dynamo.repository'
import { LambdaApp } from '../../apps/lambda-app'
import { GetBlockchains } from '../../apps/blockchains/get-all'

exports.handler = async (): Promise<ApiGatewayResponse> => {
  const table = process.env['TABLE_NAME']
  if (!table) {
    console.log('Missing TABLE_NAME environment variable')
    return { statusCode: 500 }
  }

  const repository = new BlockchainDynamoClientRepository(table)

  const app: LambdaApp = new GetBlockchains(repository)

  return await app.run()
}
