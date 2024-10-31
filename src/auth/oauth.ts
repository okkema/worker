import { Problem } from "../core"

export type OAuthEnvironment = {
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
  OAUTH_TENANT: string
}

export type OAuthResponse = {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}

export function OAuthService(env: OAuthEnvironment) {
  return {
    async token(audience: string, scope: string) {
      const response = await fetch(`https://${env.OAUTH_TENANT}/oauth/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${env.OAUTH_CLIENT_ID}:${env.OAUTH_CLIENT_SECRET}`,
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          audience,
          grant_type: "client_credentials",
          scope,
        }),
      })
      if (!response.ok) {
        const detail = await response.text()
        throw new Problem({
          title: "Oauth Token Error",
          status: response.status,
          detail,
        })
      }
      return response.json<OAuthResponse>()
    },
  }
}
