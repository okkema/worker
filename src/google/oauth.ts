import { JWT } from "../auth"

type ServiceAccountCredentials = {
  type: "service_account"
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain: string
}

type TokenResponse = {
  access_token: string
  expires_in: number
  token_type: string
}

export function Oauth(credentials: string) {
  const {
    client_email,
    private_key,
    private_key_id,
    token_uri,
  }: ServiceAccountCredentials = JSON.parse(credentials)
  return {
    async token(scope: string) {
      const assertion = await JWT.sign(
        private_key,
        private_key_id,
        token_uri,
        client_email,
        scope,
      )
      const response = await fetch(token_uri, {
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion,
        }),
      })
      const body = await response.json<TokenResponse>()
      return body.access_token
    },
  }
}
