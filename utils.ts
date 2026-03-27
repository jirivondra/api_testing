export function buildUrl(baseUrl: string, path: string): string {
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    throw new Error(`Invalid BASE_URL: ${baseUrl}`)
  }
  return `${baseUrl}${path}`
}
