import 'dotenv/config'
import pactum from 'pactum'
import { ApiResponse } from './ApiResponse.js'

const { spec } = pactum

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const API_USERNAME = process.env.API_USERNAME
const API_PASSWORD = process.env.API_PASSWORD

if (!API_USERNAME || !API_PASSWORD) {
  throw new Error('API_USERNAME and API_PASSWORD must be set in .env')
}

function getCommonHeaders(): Record<string, string> {
  const encoded = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64')
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${encoded}`,
  }
}

export async function makeRequest(
  apiUri: string,
  method: HttpMethod = 'GET',
  body: unknown = {}
): Promise<ApiResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methodHandlers: Record<HttpMethod, (s: any) => any> = {
    GET: (s) => s.get(apiUri),
    POST: (s) => s.post(apiUri).withJson(body),
    PUT: (s) => s.put(apiUri).withJson(body),
    DELETE: (s) => s.delete(apiUri),
  }

  const s = spec().withHeaders(getCommonHeaders())
  const response = await (methodHandlers[method] ?? methodHandlers.GET)(s).toss()

  return new ApiResponse({ status: response.statusCode, json: response.body })
}
