# Task Management API

A RESTful backend API for managing projects, tasks, and comments. Built with Node.js, TypeScript, Express, and Firebase as part of the COMP-3018 Back-End Development capstone project.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime and type safety |
| Express | HTTP server and routing |
| Firebase Firestore | NoSQL database |
| Firebase Authentication | User auth and token verification |
| Joi | Request body validation |
| express-rate-limit | API rate limiting (new component) |
| Swagger / OpenAPI | API documentation |
| Jest + ts-jest | Unit testing |
| ESLint | Code linting |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

src/

├── config/          # Firebase and Swagger configuration

├── controllers/     # HTTP request handlers

├── middlewares/     # Auth verification and validation

├── models/          # TypeScript interfaces and DTOs

├── repositories/    # Firestore data access layer

├── routes/          # Express route definitions

├── services/        # Core business logic

├── utils/           # Joi validation schemas

└── mocks/       # Firebase mocks for testing

---

## Architecture

The application follows a strict 4-layer architecture:

Request → Routes → Controllers → Services → Repositories → Firestore

- **Routes** — Define endpoints and apply middleware
- **Controllers** — Handle HTTP requests and responses
- **Services** — Contain business logic and validation rules
- **Repositories** — Handle all Firestore database operations

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/nvjotsinghh/task-management-api.git
cd task-management-api

# Install dependencies
npm install
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project and enable **Firestore** and **Email/Password Authentication**
3. Go to Project Settings → Service Accounts → Generate new private key
4. Save the downloaded file as `serviceAccountKey.json` in the project root
5. Copy your **Web API Key** from Project Settings → General

### Environment Variables

Create a `.env` file in the root:

PORT=3000

FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

FIREBASE_API_KEY=your_firebase_web_api_key

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

Server runs at `http://localhost:3000`

---

## API Documentation

Swagger UI is available at:
http://localhost:3000/api-docs

---

## API Endpoints

### Auth (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get Bearer token |

### Projects (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/projects | Get all projects for logged in user |
| POST | /api/projects | Create a new project |
| GET | /api/projects/:id | Get a project by ID |
| PUT | /api/projects/:id | Update a project (owner only) |
| DELETE | /api/projects/:id | Delete a project (owner only) |

### Tasks (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/projects/:id/tasks | Get all tasks (supports filtering) |
| POST | /api/projects/:id/tasks | Create a task |
| GET | /api/tasks/:id | Get a task by ID |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

### Comments (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks/:id/comments | Get all comments on a task |
| POST | /api/tasks/:id/comments | Add a comment |
| DELETE | /api/comments/:id | Delete a comment (author only) |

---

## Task Filtering & Sorting

The `GET /api/projects/:id/tasks` endpoint supports query parameters:

| Parameter | Type | Description | Example |
|---|---|---|---|
| status | string | Filter by status | `?status=todo` |
| assigneeId | string | Filter by assignee | `?assigneeId=uid123` |
| sortBy | string | Sort field | `?sortBy=dueDate` |
| order | string | Sort direction | `?order=asc` |

**Example:**

GET /api/projects/abc123/tasks?status=in-progress&sortBy=dueDate&order=asc

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
Authorization: Bearer <firebase-id-token>

Get a token by calling `/api/auth/login` or `/api/auth/register`.

### Roles

| Role | Permissions |
|---|---|
| admin | Full access to all resources |
| member | Access to own resources only |

---

## Rate Limiting

| Scope | Limit |
|---|---|
| All endpoints | 100 requests per 15 minutes |
| Auth endpoints | 10 requests per 15 minutes |

Exceeding the limit returns `429 Too Many Requests`.

---

## Running Tests

```bash
# Run all tests with coverage
npm test

# Run linter
npm run lint
```

Current coverage: **67.79%** (threshold: 65%)

Test suites: 10 | Tests: 80 | All passing ✅

---

## Git Workflow

This project follows the Atlassian Git workflow:

- `main` — production-ready code (submitted at each milestone)
- `development` — stable work in progress
- `feature/*` — one branch per GitHub issue

### Commit Convention

feat: add task filtering by status

fix: resolve TypeScript param type errors

test: add controller unit tests

docs: update README with filtering docs

chore: update dependencies

---

## New Component — express-rate-limit

**express-rate-limit** was chosen as the new backend component. It adds API rate limiting to protect against abuse and brute-force attacks.

- Global limit: 100 requests / 15 min per IP
- Auth limit: 10 requests / 15 min per IP
- Returns `429 Too Many Requests` with a clear error message when exceeded

See `new-component-plan.md` for full research and implementation details.

---

## GitHub Actions CI

Tests and linting run automatically on every push to `main` or pull request via GitHub Actions.

---

## Project Milestones

| Milestone | Status |
|---|---|
| Pre-Milestone — Planning & Proposal | ✅ Complete |
| Milestone 1 — Initial Setup & CRUD | ✅ Complete |
| Milestone 2 — Sprint Demo | ✅ Complete |
| Milestone 3 — Final Completion | ✅ Complete |