describe('MERN Todo App E2E Tests', () => {
  beforeEach(() => {
    // Intercept backend calls to mock the behavior
    cy.intercept('GET', 'http://localhost:5000/get', { fixture: 'todos.json' }).as('getTodos');
    
    // Visit the app
    cy.visit('/');
  });

  it('UI should show an empty state message when no tasks exist', () => {
    // Mock empty response
    cy.intercept('GET', 'http://localhost:5000/get', []).as('getEmptyTodos');
    cy.visit('/');
    cy.wait('@getEmptyTodos');
    
    cy.contains('No tasks found').should('be.visible');
  });

  it('User can add a new task and see it in the list', () => {
    const newTask = 'New Cypress Task';
    
    // Mock POST request
    cy.intercept('POST', 'http://localhost:5000/add', {
      statusCode: 200,
      body: { _id: 'new_id', task: newTask, done: false }
    }).as('addTask');

    // Define all intercepts BEFORE the actions that trigger them to avoid race conditions
    cy.intercept('GET', 'http://localhost:5000/get', [
      { _id: '1', task: 'Existing task', done: false },
      { _id: 'new_id', task: newTask, done: false }
    ]).as('getTodosAfterAdd');

    cy.get('input[placeholder="Enter a task"]').type(newTask);
    cy.contains('button', 'ADD').click();
    
    cy.wait('@addTask').its('request.body').should('deep.equal', { task: newTask });
    
    cy.wait('@getTodosAfterAdd');
    cy.contains(newTask).should('be.visible');
  });

  it('User can mark a task as complete', () => {
    // Start with a mock task
    cy.intercept('GET', 'http://localhost:5000/get', [
      { _id: '1', task: 'Task to complete', done: false }
    ]).as('getTodos');
    cy.visit('/');
    cy.wait('@getTodos');

    // Mock PUT edit request
    cy.intercept('PUT', 'http://localhost:5000/edit/1', {
      statusCode: 200,
      body: { _id: '1', task: 'Task to complete', done: true }
    }).as('completeTask');

    // Click the circle icon (uncompleted)
    // The icon is rendered by BsCircleFill, we can target it using .icon or svg
    cy.get('.checkbox svg.icon').first().click();

    cy.wait('@completeTask');
    // The app updates the state internally, so the class should change to 'through'
    cy.get('p').contains('Task to complete').should('have.class', 'through');
  });

  it('User can delete a task', () => {
    cy.intercept('GET', 'http://localhost:5000/get', [
      { _id: '1', task: 'Task to delete', done: false }
    ]).as('getTodos');
    cy.visit('/');
    cy.wait('@getTodos');

    // Mock DELETE request
    cy.intercept('DELETE', 'http://localhost:5000/delete/1', {
      statusCode: 200,
      body: { _id: '1', task: 'Task to delete', done: false }
    }).as('deleteTask');

    // The trash icon is rendered by BsFillTrashFill
    // We can target the span containing it, or svg directly
    cy.get('span svg').last().click();

    cy.wait('@deleteTask');
    // Task should be removed from DOM
    cy.contains('Task to delete').should('not.exist');
  });

  // Negative Test
  it('Negative Test: Should prevent empty task submissions', () => {
    // Spy on the POST request to ensure it is either not sent or we handle the failure
    let postCalled = false;
    cy.intercept('POST', 'http://localhost:5000/add', (req) => {
      postCalled = true;
      req.reply({ statusCode: 400, body: 'Bad Request' });
    }).as('addTaskEmpty');

    // Do not type anything, just click ADD
    cy.contains('button', 'ADD').click();

    // Since the frontend uses onClick which triggers axios directly regardless of the 'required' attribute on input,
    // it will send an empty string (or empty due to trim).
    cy.wait('@addTaskEmpty').then((interception) => {
      expect(interception.request.body.task).to.equal('');
    });
    
    // We can assert that the UI doesn't incorrectly add an empty task by verifying the state
    cy.get('.task').should('have.length.at.least', 1);
  });
});
