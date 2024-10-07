/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis"

const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

type GoogleSheets = {
  get(spreadsheetId: string, range: string): Promise<any[][]>
  parse<T>(spreadsheetId: string, range: string): Promise<T[]>
}

export function GoogleSheets(credentials: string): GoogleSheets {
  const keys = JSON.parse(credentials)
  const auth = new google.auth.JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes,
  })
  const client = google.sheets({ version: "v4", auth })
  async function get(spreadsheetId: string, range: string) {
    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range,
    })
    return response.data.values
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
