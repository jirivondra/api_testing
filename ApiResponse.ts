import type { Schema } from 'joi'

export class ApiResponse {
  status: number
  json: unknown

  constructor({ status, json }: { status: number; json: unknown }) {
    this.status = status
    this.json = json
  }

  expectStatus(code: number): this {
    expect(this.status).toBe(code)
    return this
  }

  expectJsonValue(key: string, value: unknown): this {
    expect((this.json as Record<string, unknown>)[key]).toBe(value)
    return this
  }

  expectSchema(schema: Schema): this {
    const { error } = schema.validate(this.json)
    expect(error).toBeUndefined()
    return this
  }
}
