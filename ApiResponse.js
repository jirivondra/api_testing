export class ApiResponse {
  /**
   * @param {Object} params
   * @param {number} params.status - HTTP status code
   * @param {Object} params.json - response body
   */
  constructor({ status, json }) {
    this.status = status
    this.json = json
  }

  /**
   * Asserts that the response status matches the expected code.
   * @param {number} code - expected HTTP status code
   * @returns {ApiResponse}
   */
  expectStatus(code) {
    expect(this.status).toBe(code)
    return this
  }

  /**
   * Asserts that a field in the response JSON matches the expected value.
   * @param {string} key - field name
   * @param {*} value - expected value
   * @returns {ApiResponse}
   */
  expectJsonValue(key, value) {
    expect(this.json[key]).toBe(value)
    return this
  }

  /**
   * Asserts that the response JSON matches the given Joi schema.
   * @param {import('joi').Schema} schema - Joi schema to validate against
   * @returns {ApiResponse}
   */
  expectSchema(schema) {
    const { error } = schema.validate(this.json)
    expect(error).toBeUndefined()
    return this
  }
}
