import {ApiGatewayResponse} from "../../common/apigateway/apigateway-response";
import {LambdaApp} from "../../apps/lambda-app";
import {ApplicationDynamoClientRepository} from "../../common/repositories/application.dynamo.repository";
import Redis from "ioredis";
import {RelayApplication} from "../../apps/applications/relay-app";
import {ApiGatewayEvent} from "../../common/apigateway/apigateway-event";
import {getDefaultPocketConfig} from "../../config/pocket-client";
import AatPlans from "../../config/aat-plans.json";
import {
  Pocket,
  HttpRpcProvider,
  Configuration,
  Account,
} from "@pokt-network/pocket-js";
import {BlockchainDynamoClientRepository} from "../../common/repositories/blockchain.dynamo.repository";

// Global variables are automatically cached by lambda memory, use with caution
// https://medium.com/tensult/aws-lambda-function-issues-with-global-variables-eb5785d4b876
const redisEndpoint = process.env["ELASTICACHE_HOST"] || "";
const redisPort = process.env["ELASTICACHE_PORT"] || "";
const pocketSessionBlockFrequency =
  process.env["POCKET_SESSION_BLOCK_FREQUENCY"] || "";
const clientPrivateKey = process.env["GATEWAY_CLIENT_PRIVATE_KEY"] || "";
const clientPassphrase = process.env["GATEWAY_CLIENT_PASSPHRASE"] || "";
const pocketBlockTime = process.env["POCKET_BLOCK_TIME"] || "";
const dispatchURL = process.env["DISPATCH_URL"] || "";
const databaseEncryptionKey = process.env["DATABASE_ENCRYPTION_KEY"] || "";
const relayRetries = process.env["POCKET_RELAY_RETRIES"] || "";
const aatPlan = process.env["AAT_PLAN"] || AatPlans.PREMIUM;

let redis;
let configuration: Configuration;
let pocket;
let rpcProvider;
const dispatchers = ((): URL[] => {
  const result: URL[] = [];
  if (dispatchURL.indexOf(",")) {
    const dispatcherArray = dispatchURL.split(",");

    dispatcherArray.forEach(function (dispatcher) {
      result.push(new URL(dispatcher));
    });
  } else {
    result.push(new URL(dispatchURL));
  }
  return result;
})();

const checkRequiredEnvs = () => {
  if (!redisEndpoint) {
    throw new Error("ELASTICACHE_HOST required in ENV");
  }
  if (!redisPort) {
    throw new Error("ELASTICACHE_PORT required in ENV");
  }
  if (!pocketSessionBlockFrequency) {
    throw new Error("POCKET_SESSION_BLOCK_FREQUENCY required in ENV");
  }
  if (!pocketBlockTime || pocketBlockTime === "") {
    throw new Error("POCKET_BLOCK_TIME required in ENV");
  }
  if (!dispatchURL) {
    throw new Error("DISPATCH_URL required in ENV");
  }

  if (!databaseEncryptionKey) {
    throw new Error("DATABASE_ENCRYPTION_KEY required in ENV");
  }

  if (!clientPrivateKey) {
    throw new Error("GATEWAY_CLIENT_PRIVATE_KEY required in ENV");
  }

  if (!clientPassphrase) {
    throw new Error("GATEWAY_CLIENT_PASSPHRASE required in ENV");
  }
};

exports.handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  try {
    checkRequiredEnvs();

    const appRepository = new ApplicationDynamoClientRepository(
      process.env["APPS_TABLE_NAME"]
    );
    const blockchainRepository = new BlockchainDynamoClientRepository(
      process.env["BLOCKCHAINS_TABLE_NAME"]
    );
    redis = new Redis(parseInt(redisPort), redisEndpoint);

    // TODO: Abstract pocket class creation
    configuration = getDefaultPocketConfig({
      sessionBlockFrequency: parseInt(pocketSessionBlockFrequency),
      blockTime: parseInt(pocketBlockTime),
    });

    rpcProvider = new HttpRpcProvider(dispatchers[0]);
    pocket = new Pocket(dispatchers, rpcProvider, configuration);

    // Unlock primary client account for relay signing
    try {
      const importAccount = await pocket.keybase.importAccount(
        Buffer.from(clientPrivateKey, "hex"),
        clientPassphrase
      );

      if (importAccount instanceof Account) {
        await pocket.keybase.unlockAccount(
          importAccount.addressHex,
          clientPassphrase,
          0
        );
      }
    } catch (e) {
      throw new Error(`Unable to import or unlock base client account: ${e}`);
    }

    const app: LambdaApp = new RelayApplication({
      pocket,
      redis,
      appRepository,
      blockchainRepository,
      databaseEncryptionKey,
      relayRetries: parseInt(relayRetries),
      configuration,
      aatPlan,
    });

    return await app.run(event);
  } catch (e) {
    console.log(e.message);
    return {statusCode: 500};
  }
};
