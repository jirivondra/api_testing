import frisby from 'frisby'
import { ApiResponse } from './ApiResponse.js'

function getCommonHeaders() {
  return {
    'Content-Type': 'application/json',
  }
}

export function makeRequest(apiUri, method = 'GET', body = {}) {
  let frisbyRequest = frisby.setup({ request: { headers: getCommonHeaders() } })

  const methodHandlers = {
    GET: (req) => req.get(apiUri),
    POST: (req) => req.post(apiUri, body),
    PUT: (req) => req.put(apiUri, body),
    DELETE: (req) => req.delete(apiUri),
  }

  frisbyRequest = (methodHandlers[method] ?? methodHandlers.GET)(frisbyRequest)

  return frisbyRequest.then((response) => new ApiResponse({ status: response.status, json: response.json }))
}
