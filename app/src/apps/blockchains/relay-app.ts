import { LambdaApp } from '../lambda-app';
import { ApiGatewayResponse } from '../../common/apigateway/apigateway-response';
import { BlockchainRepository } from '../../common/repositories/blockchain.repository';
import { ApiGatewayEvent } from '../../../../.aws-sam/build/GetBlockchains/src/common/apigateway/apigateway-event';
import { Redis } from 'ioredis';

/**
 * GetBlockchains queries all the blockchains available in DynamoDB
 */
export class RelayApplication implements LambdaApp {
  repository: BlockchainRepository
  redis: Redis

  constructor(redis : Redis, repository: BlockchainRepository) {
    this.repository = repository
    this.redis = redis
  }

  async run(event: ApiGatewayEvent) : Promise<ApiGatewayResponse> {
    return {statusCode: 200}
  }
} 