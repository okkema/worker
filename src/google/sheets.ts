/* eslint-disable @typescript-eslint/no-explicit-any */
import { KVNamespace } from "@cloudflare/workers-types"
import { Oauth } from "./oauth"

const scope = "https://www.googleapis.com/auth/spreadsheets.readonly"

export type GoogleSheetsRow = {
  $range: string
  $order: string
}

type GoogleSheets = {
  get(spreadsheetId: string, range: string): Promise<any[][]>
  parse<T extends GoogleSheetsRow>(
    spreadsheetId: string,
    range: string,
  ): Promise<T[]>
  update<T extends GoogleSheetsRow>(
    spreadsheetId: string,
    range: string,
    ...values: T[]
  ): Promise<boolean>
}

type GetResponse = {
  range: string
  majorDimension: string
  values: any[]
}

type UpdateResponse = {
  spreadsheetId: string
  totalUpdatedRows: number
  totalUpdatedColumns: number
  totalUpdatedCells: number
  totalUpdatedSheets: number
  responses: any[]
}

function getRange(range: string, index: number) {
  const parts = range.split(":")
  const row = parts[0].match(/\d+/)
  const startRow = row != null ? +row[0] : 0
  const startCol = parts[0].replace(/^\d+/g, "")
  return `${startCol}${startRow + index}`
}

export function GoogleSheets(
  credentials: string,
  kv?: KVNamespace,
): GoogleSheets {
  const oauth = Oauth(credentials, kv)
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
    async parse<T extends GoogleSheetsRow>(spreadsheetId, range) {
      const rows = await get(spreadsheetId, range)
      const keys = rows.shift()
      const values = []
      for (let i = 0; i < rows.length; i++) {
        const value = { $range: getRange(range, i) }
        const order = []
        for (let j = 0; j < rows[i].length; j++) {
          const key = keys[j]
          value[key] = rows[i][j]
          order.push(key)
        }
        value["$order"] = order.join("|")
        values.push(value)
      }
      return values satisfies T[]
    },
    async update(spreadsheetId, range, ...values) {
      const token = await oauth.token(scope)
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            data: values.map(function (value) {
              const order = value.$order.split("|")
              const result = []
              for (const key of order) {
                result.push(value[key])
              }
              return {
                range: value.$range,
                majorDimension: "ROWS",
                values: result,
              }
            }),
          }),
        },
      )
      const body = await response.json<UpdateResponse>()
      return body.totalUpdatedRows == values.length
    },
  }
}
