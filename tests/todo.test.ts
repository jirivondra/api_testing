import { TodoPage } from '../page-objects/TodoPage.js'
import { todoSchema, todoListSchema } from '../schemas/schemas.js'

const todoPage = new TodoPage()

const statusCodes = {
  ok: 200,
  created: 201,
  noContent: 204,
  notFound: 404,
}

const testData = {
  withDescription: { title: 'Testovací úkol', description: 'Popis', completed: false },
  withoutDescription: { title: 'Úkol bez popisu' },
  forGetTest: { title: 'Pro GET test' },
  forUpdateTest: { title: 'Pro UPDATE test', completed: false },
  forDeleteTest: { title: 'Pro DELETE test' },
  updated: { title: 'Aktualizovaný úkol', completed: true },
  nonExistentUpdate: { title: 'X' },
  nonExistentId: 999999,
}

describe('TODO API – GET /todos', () => {
  it('returns list of todos with status 200', async () => {
    ;(await todoPage.getAll()).expectStatus(200).expectSchema(todoListSchema)
  })
})

describe('TODO API – POST /todos', () => {
  it('creates a new TODO with status 201', async () => {
    ;(await todoPage.create(testData.withDescription))
      .expectStatus(statusCodes.created)
      .expectSchema(todoSchema)
      .expectJsonValue('title', testData.withDescription.title)
      .expectJsonValue('completed', testData.withDescription.completed)
  })

  it('creates a TODO without description', async () => {
    ;(await todoPage.create(testData.withoutDescription))
      .expectStatus(statusCodes.created)
      .expectSchema(todoSchema)
      .expectJsonValue('title', testData.withoutDescription.title)
      .expectJsonValue('description', null)
  })
})

describe('TODO API – GET /todos/:id', () => {
  let createdId: number

  beforeAll(async () => {
    await todoPage.create(testData.forGetTest)
    createdId = todoPage.json.id as number
  })

  it('returns a specific TODO with status 200', async () => {
    ;(await todoPage.getById(createdId))
      .expectStatus(statusCodes.ok)
      .expectSchema(todoSchema)
      .expectJsonValue('id', createdId)
  })

  it('returns 404 for a non-existent TODO', async () => {
    ;(await todoPage.getById(testData.nonExistentId)).expectStatus(statusCodes.notFound)
  })
})

describe('TODO API – PUT /todos/:id', () => {
  let createdId: number

  beforeAll(async () => {
    await todoPage.create(testData.forUpdateTest)
    createdId = todoPage.json.id as number
  })

  it('updates a TODO and returns status 200', async () => {
    ;(await todoPage.update(createdId, testData.updated))
      .expectStatus(statusCodes.ok)
      .expectSchema(todoSchema)
      .expectJsonValue('completed', testData.updated.completed)
      .expectJsonValue('title', testData.updated.title)
  })

  it('returns 404 when updating a non-existent TODO', async () => {
    ;(await todoPage.update(testData.nonExistentId, testData.nonExistentUpdate)).expectStatus(
      statusCodes.notFound
    )
  })
})

describe('TODO API – DELETE /todos/:id', () => {
  let createdId: number

  beforeAll(async () => {
    await todoPage.create(testData.forDeleteTest)
    createdId = todoPage.json.id as number
  })

  it('deletes a TODO and returns status 204', async () => {
    ;(await todoPage.delete(createdId)).expectStatus(statusCodes.noContent)
  })

  it('returns 404 after deletion', async () => {
    ;(await todoPage.getById(createdId)).expectStatus(statusCodes.notFound)
  })
})

describe('TODO API – full lifecycle', () => {
  let todoId: number

  it('POST → creates a new TODO', async () => {
    ;(await todoPage.create(testData.withDescription))
      .expectStatus(statusCodes.created)
      .expectJsonValue('title', testData.withDescription.title)
      .expectJsonValue('completed', testData.withDescription.completed)
    todoId = todoPage.json.id as number
  })

  it('GET → newly created TODO is available', async () => {
    ;(await todoPage.getById(todoId))
      .expectStatus(statusCodes.ok)
      .expectJsonValue('id', todoId)
      .expectJsonValue('title', testData.withDescription.title)
  })

  it('PUT → updates the TODO', async () => {
    ;(await todoPage.update(todoId, testData.updated))
      .expectStatus(statusCodes.ok)
      .expectJsonValue('title', testData.updated.title)
      .expectJsonValue('completed', testData.updated.completed)
  })

  it('GET → reflects the updated values', async () => {
    ;(await todoPage.getById(todoId))
      .expectStatus(statusCodes.ok)
      .expectJsonValue('title', testData.updated.title)
      .expectJsonValue('completed', testData.updated.completed)
  })

  it('DELETE → removes the TODO', async () => {
    ;(await todoPage.delete(todoId)).expectStatus(statusCodes.noContent)
  })

  it('GET → deleted TODO returns 404', async () => {
    ;(await todoPage.getById(todoId)).expectStatus(statusCodes.notFound)
  })
})
