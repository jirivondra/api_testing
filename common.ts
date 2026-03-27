import pactum from 'pactum'
import { ApiResponse } from './ApiResponse.js'

const { spec } = pactum

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

function getCommonHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
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
