import { Configuration } from '@pokt-network/pocket-js'

const DEFAULT_POCKET_CONFIG = {
  MAX_DISPATCHERS: 50,
  MAX_SESSIONS: 100000,
  CONSENSUS_NODE_COUNT: 0,
  REQUEST_TIMEOUT: 120000, // 3 minutes
  ACCEPT_DISPUTED_RESPONSES: false,
  VALIDATE_RELAY_RESPONSES: undefined,
  REJECT_SELF_SIGNED_CERTIFICATES: undefined,
  USE_LEGACY_TX_CODEC: true,
}

export const getDefaultPocketConfig = ({
  maxDispatchers,
  maxSessions,
  consensusNodeCount,
  requestTimeout,
  acceptDisputedResponses,
  sessionBlockFrequency,
  blockTime,
  validateRelayResponses,
  rejectSelfSignedCertificated,
  useLegacyTXCodec,
}: PocketConfiguration): Configuration => {
  return new Configuration(
    maxDispatchers || DEFAULT_POCKET_CONFIG.MAX_DISPATCHERS,
    maxSessions || DEFAULT_POCKET_CONFIG.MAX_SESSIONS,
    consensusNodeCount || DEFAULT_POCKET_CONFIG.CONSENSUS_NODE_COUNT,
    requestTimeout || DEFAULT_POCKET_CONFIG.REQUEST_TIMEOUT,
    acceptDisputedResponses || DEFAULT_POCKET_CONFIG.ACCEPT_DISPUTED_RESPONSES,
    sessionBlockFrequency,
    blockTime,
    validateRelayResponses || DEFAULT_POCKET_CONFIG.VALIDATE_RELAY_RESPONSES,
    rejectSelfSignedCertificated || DEFAULT_POCKET_CONFIG.REJECT_SELF_SIGNED_CERTIFICATES,
    useLegacyTXCodec || DEFAULT_POCKET_CONFIG.USE_LEGACY_TX_CODEC
  )
}

type PocketConfiguration = {
  maxDispatchers?: number
  maxSessions?: number
  consensusNodeCount?: number
  requestTimeout?: number
  acceptDisputedResponses?: boolean
  sessionBlockFrequency: number
  blockTime: number
  validateRelayResponses?: number
  rejectSelfSignedCertificated?: boolean
  useLegacyTXCodec?: boolean
}
