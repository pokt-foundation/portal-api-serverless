export interface Application {
  id: string
  name?: string
  owner?: string
  url?: string
  freeTier: string
  publicPocketAccount?: object
  freeTierApplicacationAccount?: object
  gatewayAAT: {
    version: string
    applicationPublicKey: string
    applicationSignature: string
    clientPublicKey: string
  }
  freeTierAAT: {
    applicationSignature: string
    applicationPublicKey: string
    clientPublicKey: string
  }
  aat?: object
  gatewaySettings: {
    secretKey: string
    secretKeyRequired: boolean
    whitelistOrigins: string[]
    whitelistUserAgents: string[]
  }
}
