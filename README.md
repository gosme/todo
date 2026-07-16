# QA Assignment Testing Guide

This file contains the instructions for the Jest unit/integration tests and Cypress End-to-End (E2E) tests added for the QA Assignment.

## Prerequisites

- Node.js (v14 or higher)

## Folder Structure

- `tests/`: Contains Jest unit tests (`utils.test.js`), integration tests (`api.test.js`), and the utility functions requested by the assignment (`utils.js`).
- `cypress/`: Contains the Cypress configuration, E2E test scenarios (`cypress/e2e/todo.cy.js`), and fixtures.
- `.github/workflows/test.yml`: GitHub Actions CI pipeline to run tests automatically.

## Setup Instructions

1. **Install Root Dependencies (for Testing)**:
   This will install Jest, Supertest, and Cypress at the root level.
   ```bash
   npm install
   ```

2. **Install Application Dependencies**:
   ```bash
   cd TODO/todo_backend
   npm install
   cd ../todo_frontend
   npm install
   cd ../..
   ```

## Running the Tests

### 1. Jest Unit & Integration Tests (Backend)

The backend tests are designed using mocked Mongoose models so that you do not need a running MongoDB instance to verify the API routes and utility functions.

To run the Jest tests and generate a coverage report:
```bash
npm run test
```

### 2. Cypress E2E Tests (Frontend)

The Cypress tests intercept API calls to the backend, meaning they test the UI functionality in isolation by mocking the server responses. You do not need to have the backend running to execute the Cypress test suite successfully.

To run Cypress in headless mode:
```bash
npm run cypress:run
```

To open the Cypress UI for interactive testing:
```bash
npm run cypress:open
```
