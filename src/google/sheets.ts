/* eslint-disable @typescript-eslint/no-explicit-any */
import { Oauth } from "./oauth"

const scope = "https://www.googleapis.com/auth/spreadsheets.readonly"

type GoogleSheets = {
  get(spreadsheetId: string, range: string): Promise<any[][]>
  parse<T>(spreadsheetId: string, range: string): Promise<T[]>
}

type GetResponse = {
  range: string
  majorDimension: string
  values: any[]
}

export function GoogleSheets(credentials: string): GoogleSheets {
  const oauth = Oauth(credentials)
  async function get(spreadsheetId: string, range: string) {
    const token = await oauth.token(scope)
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const body = await response.json<GetResponse>()
    return body.values
  }
  return {
    get,
    async parse<T>(spreadsheetId, range) {
      const rows = await get(spreadsheetId, range)
      const keys = rows.shift()
      const values = []
      for (const row of rows) {
        const value = {}
        for (let i = 0; i < row.length; i++) {
          const key = keys[i]
          value[key] = row[i]
        }
        values.push(value)
      }
      return values satisfies T[]
    },
  }
}
