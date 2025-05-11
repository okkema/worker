import { KVNamespace } from "@cloudflare/workers-types"
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
  access_token?: string
  expires_in?: number
  token_type?: string
  id_token?: string
  error?: string
  error_description?: string
}

const AccessTokenKey = "okkema/worker/google/oauth/access_token"

export function Oauth(credentials: string, kv?: KVNamespace) {
  const {
    client_email,
    private_key,
    private_key_id,
    token_uri,
  }: ServiceAccountCredentials = JSON.parse(credentials)
  return {
    async token(scope: string) {
      if (kv) {
        const token = await kv.get(AccessTokenKey)
        if (token) return token
      }
      const assertion = await JWT.sign(
        private_key,
        private_key_id,
        token_uri,
        client_email,
        scope,
      )
      const response = await fetch(token_uri, {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion,
        }),
      })
      const body = await response.json<TokenResponse>()
      const { access_token, expires_in, id_token, error, error_description } =
        body
      if (access_token) {
        if (kv) {
          await kv.put(AccessTokenKey, access_token, {
            expirationTtl: expires_in,
          })
        }
        return access_token
      } else if (id_token) return id_token
      else
        throw new Error(
          `${error ?? "No tokens were returned"}: ${
            error_description ?? response.status
          }`,
        )
    },
  }
}
