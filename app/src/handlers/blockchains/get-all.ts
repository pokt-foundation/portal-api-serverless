
import { ApiGatewayResponse } from '../../common/apigateway/apigateway-response';
import { BlockchainDynamoClientRepository } from '../../common/repositories/blockchain.dynamodb.repository';
import { LambdaApp } from '../../apps/lambda-app';
import { GetBlockchains } from '../../apps/blockchains/get-blockchains';

export const handler = async () : Promise<ApiGatewayResponse> => {
  const repository = new BlockchainDynamoClientRepository(process.env['TABLE_NAME'])

  const app: LambdaApp = new GetBlockchains(repository)

  return await app.run()
}