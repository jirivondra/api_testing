import { makeRequest } from '../common.js'
import { buildUrl } from '../utils.js'

const BASE_URL = process.env.API_URL || 'http://localhost:8000'

export class TodoPage {
  constructor() {
    this.urls = {
      todos: buildUrl(BASE_URL, '/todos'),
      todo: (id) => buildUrl(BASE_URL, `/todos/${id}`),
    }
    this._response = null
  }

  /**
   * Fetches all TODOs.
   * @returns {Promise<TodoPage>}
   */
  async getAll() {
    this._response = await makeRequest(this.urls.todos)
    return this
  }

  /**
   * Fetches a single TODO by ID.
   * @param {number} id
   * @returns {Promise<TodoPage>}
   */
  async getById(id) {
    this._response = await makeRequest(this.urls.todo(id))
    return this
  }

  /**
   * Creates a new TODO.
   * @param {Object} data
   * @param {string} data.title
   * @param {string} [data.description]
   * @param {boolean} [data.completed]
   * @returns {Promise<TodoPage>}
   */
  async create(data) {
    this._response = await makeRequest(this.urls.todos, 'POST', data)
    return this
  }

  /**
   * Updates an existing TODO.
   * @param {number} id
   * @param {Object} data
   * @param {string} [data.title]
   * @param {string} [data.description]
   * @param {boolean} [data.completed]
   * @returns {Promise<TodoPage>}
   */
  async update(id, data) {
    this._response = await makeRequest(this.urls.todo(id), 'PUT', data)
    return this
  }

  /**
   * Deletes a TODO by ID.
   * @param {number} id
   * @returns {Promise<TodoPage>}
   */
  async delete(id) {
    this._response = await makeRequest(this.urls.todo(id), 'DELETE')
    return this
  }

  /**
   * Asserts that the last response status matches the expected code.
   * @param {number} code - expected HTTP status code
   * @returns {TodoPage}
   */
  expectStatus(code) {
    this._response.expectStatus(code)
    return this
  }

  /**
   * Asserts that a field in the last response JSON matches the expected value.
   * @param {string} key - field name
   * @param {*} value - expected value
   * @returns {TodoPage}
   */
  expectJsonValue(key, value) {
    this._response.expectJsonValue(key, value)
    return this
  }

  /**
   * Returns the JSON body of the last response.
   * @returns {Object}
   */
  get json() {
    return this._response.json
  }
}
