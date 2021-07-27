import { LambdaApp } from '../lambda-app'
import { ApiGatewayResponse } from '../../common/apigateway/apigateway-response'
import { Redis } from 'ioredis'
import { ApplicationRepository } from '../../common/repositories/application.repository'
import { ApiGatewayEvent } from '../../common/apigateway/apigateway-event'
import { PocketRelayer } from '../../services/pocket-relayer'
import { CherryPicker } from '../../services/cherry-picker'
import { BlockchainRepository } from '../../common/repositories/blockchain.repository'
import { Configuration, Pocket, HTTPMethod } from '@pokt-network/pocket-js'

export class RelayApplication implements LambdaApp {
  appRepository: ApplicationRepository
  blockchainRepository: BlockchainRepository
  redis: Redis
  pocket: Pocket
  configuration: Configuration
  databaseEncryptionKey: string
  relayRetries: number
  aatPlan: string

  constructor({
    pocket,
    configuration,
    redis,
    appRepository,
    blockchainRepository,
    databaseEncryptionKey,
    relayRetries,
    aatPlan,
  }: {
    pocket: Pocket
    configuration: Configuration
    redis: Redis
    appRepository: ApplicationRepository
    databaseEncryptionKey: string
    relayRetries: number
    blockchainRepository: BlockchainRepository
    aatPlan: string
  }) {
    this.appRepository = appRepository
    this.redis = redis
    this.configuration = configuration
    this.pocket = pocket
    this.databaseEncryptionKey = databaseEncryptionKey
    this.relayRetries = relayRetries
    this.blockchainRepository = blockchainRepository
    this.aatPlan = aatPlan
  }

  async run(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
    let id: string | undefined = event.pathParameters?.id
    const host: string | undefined = event.pathParameters?.host

    if (!id || !host) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'application not found' }),
      }
    }

    let relayPath = id
    // Take the relay path from the end of the endpoint URL
    if (id.match(/[0-9a-zA-Z]{24}~/g)) {
      relayPath = id.slice(24).replace(/~/gi, '/')
      id = id.slice(0, 24)
    }

    try {
      const application = await this.appRepository.getApplication(id)
      const cherryPicker = new CherryPicker({
        redis: this.redis,
        checkDebug: true,
      })

      let secretKey = ''
      // SecretKey passed in via basic http auth
      if (event.headers['authorization']) {
        const base64Credentials = event.headers['authorization'].split(' ')[1]
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii').split(':')

        if (credentials[1]) {
          secretKey = credentials[1]
        }
      }

      if (!application) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'application not found' }),
        }
      }

      const pocketRelayer = new PocketRelayer({
        host: host,
        origin: event.headers['origin'],
        userAgent: event.headers['User-Agent'],
        pocket: this.pocket,
        pocketConfiguration: this.configuration,
        cherryPicker,
        redis: this.redis,
        databaseEncryptionKey: this.databaseEncryptionKey,
        secretKey,
        relayRetries: this.relayRetries,
        blockchainRepository: this.blockchainRepository,
        checkDebug: true,
        aatPlan: this.aatPlan,
        altruists: '{}',
      })

      const result = await pocketRelayer.sendRelay({
        rawData: event.body,
        application,
        relayPath,
        httpMethod: event.requestContext.httpMethod as HTTPMethod,
        requestID: event.requestContext.requestId,
      })

      console.log('sucess', result)
      return result
    } catch (e) {
      console.log(e)
      return { statusCode: 500 }
    }
  }
}
