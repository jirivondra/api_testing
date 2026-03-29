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
    │   └── TodoPage.ts   # Page Object – HTTP methods + fluent assertions
    ├── ApiResponse.ts    # Fluent wrapper for HTTP responses
    ├── common.ts         # makeRequest – shared HTTP calls via Pactum
    ├── schemas.ts        # Joi schemas for response validation
    ├── utils.ts          # buildUrl helper
    └── todo.test.ts      # Integration tests
```

## Setup

### 1. Install dependencies

```bash
# Node.js dependencies
npm install

# Python dependencies
pip install -r api/requirements.txt
```

### 2. Configure environment

Copy the environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
API_USERNAME=your-username
API_PASSWORD=your-password
```

The `.env` file is gitignored and never committed to the repository. Both the API and the test suite read credentials from this file at runtime.

### 3. Install Task

This project uses [Task](https://taskfile.dev) as a task runner. Install it via:

```bash
# macOS
brew install go-task

# Windows
winget install Task.Task

# Linux
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin
```

## Running the project

### Start the API

```bash
task run-api
```

The API runs on `http://localhost:8000`. Swagger docs are available at `http://localhost:8000/docs`.

### Run tests

```bash
task run-test          # run all tests
task test-watch        # run in watch mode
task test-result       # run with verbose output
```

### Custom API URL

```bash
API_URL=http://localhost:9000 task run-test
```

## Taskfile commands

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `task run-api`      | Start the FastAPI backend           |
| `task run-test`     | Run all tests                       |
| `task test-watch`   | Run tests in watch mode             |
| `task test-result`  | Run tests with verbose output       |
| `task lint`         | Check code with ESLint              |
| `task lint-fix`     | Auto-fix lint issues                |
| `task format-check` | Check code formatting with Prettier |
| `task check`        | Run all checks (ESLint + Prettier)  |
| `task fix`          | Auto-fix formatting and lint issues |

## Authentication

The API uses HTTP Basic Auth. Every request must include an `Authorization` header:

```
Authorization: Basic <base64(username:password)>
```

Credentials are configured via `.env`. The test suite sends them automatically with every request.

## API endpoints

All endpoints require authentication.

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

```ts
;(await todoPage.create({ title: 'New todo' }))
  .expectStatus(statusCodes.created)
  .expectJsonValue('title', 'New todo')
```

### Test data

All test data is defined in a `testData` object at the top of the test file — no magic strings inside the tests themselves.

### Schemas

Joi schemas in `schemas.ts` define the expected structure and types of API responses.
