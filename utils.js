export function buildUrl(baseUrl, path) {
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    throw new Error(`Invalid BASE_URL: ${baseUrl}`)
  }
  return `${baseUrl}${path}`
}
