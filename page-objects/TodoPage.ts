import type { Schema } from 'joi'
import { ApiResponse } from '../ApiResponse.js'
import { makeRequest } from '../common.js'
import { buildUrl } from '../utils.js'

const BASE_URL = process.env.API_URL || 'http://localhost:8000'

interface TodoInput {
  title: string
  description?: string
  completed?: boolean
}

export class TodoPage {
  private urls: { todos: string; todo: (id: number) => string }
  private _response: ApiResponse | null

  constructor() {
    this.urls = {
      todos: buildUrl(BASE_URL, '/todos'),
      todo: (id: number) => buildUrl(BASE_URL, `/todos/${id}`),
    }
    this._response = null
  }

  async getAll(): Promise<this> {
    this._response = await makeRequest(this.urls.todos)
    return this
  }

  async getById(id: number): Promise<this> {
    this._response = await makeRequest(this.urls.todo(id))
    return this
  }

  async create(data: TodoInput): Promise<this> {
    this._response = await makeRequest(this.urls.todos, 'POST', data)
    return this
  }

  async update(id: number, data: Partial<TodoInput>): Promise<this> {
    this._response = await makeRequest(this.urls.todo(id), 'PUT', data)
    return this
  }

  async delete(id: number): Promise<this> {
    this._response = await makeRequest(this.urls.todo(id), 'DELETE')
    return this
  }

  expectStatus(code: number): this {
    this._response!.expectStatus(code)
    return this
  }

  expectSchema(schema: Schema): this {
    this._response!.expectSchema(schema)
    return this
  }

  expectJsonValue(key: string, value: unknown): this {
    this._response!.expectJsonValue(key, value)
    return this
  }

  get json(): Record<string, unknown> {
    return this._response!.json as Record<string, unknown>
  }
}
