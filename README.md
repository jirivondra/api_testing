# TODO API – Integration Tests

A showcase of integration testing for a custom REST API. The project includes a FastAPI backend and a test suite built on Jest, Pactum and Joi.

## Stack

| Layer             | Technology      |
| ----------------- | --------------- |
| API               | Python, FastAPI |
| Test runner       | Jest            |
| HTTP requests     | Pactum          |
| Schema validation | Joi             |

## Project structure

```
├── api/
│   ├── main.py           # FastAPI TODO API
│   └── requirements.txt
└── tests/
    ├── pages/
    │   └── TodoPage.js   # Page Object – HTTP methods + fluent assertions
    ├── ApiResponse.js    # Fluent wrapper for HTTP responses
    ├── common.js         # makeRequest – shared HTTP calls via Pactum
    ├── schemas.js        # Joi schemas for response validation
    ├── utils.js          # buildUrl helper
    └── todo.test.js      # Integration tests
```

## Setup

### 1. Install dependencies

```bash
# Node.js dependencies
npm install

# Python dependencies
pip install -r api/requirements.txt
```

### 2. Start the API

```bash
python3 api/main.py
```

The API runs on `http://localhost:8000`. Swagger docs are available at `http://localhost:8000/docs`.

### 3. Run tests

```bash
npm test
```

For verbose output:

```bash
npm run test:verbose
```

### Custom API URL

```bash
API_URL=http://localhost:9000 npm test
```

## API endpoints

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/todos`     | List all todos    |
| POST   | `/todos`     | Create a new todo |
| GET    | `/todos/:id` | Get a todo by ID  |
| PUT    | `/todos/:id` | Update a todo     |
| DELETE | `/todos/:id` | Delete a todo     |

## Test architecture

### Page Object Pattern

`TodoPage` encapsulates all HTTP calls. Each method returns `this`, enabling fluent chaining of assertions:

```js
;(await todoPage.create({ title: 'New todo' }))
  .expectStatus(statusCodes.created)
  .expectJsonValue('title', 'New todo')
```

### Test data

All test data is defined in a `testData` object at the top of the test file — no magic strings inside the tests themselves.

### Schemas

Joi schemas in `schemas.js` define the expected structure and types of API responses.
