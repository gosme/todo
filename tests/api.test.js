const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose before requiring the app so it doesn't connect to the real DB
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(true),
  };
});

// Mock the Todo model
jest.mock('../../mern-todo-app/TODO/todo_backend/models/Todo', () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
});

const TodoModel = require('../../mern-todo-app/TODO/todo_backend/models/Todo');
let app;

describe('Integration Tests for Backend APIs', () => {
  beforeAll(() => {
    // We require the app after mocking mongoose to avoid listen and connect side-effects
    // Note: Since the app unconditionally calls app.listen(5000), we could potentially have EADDRINUSE
    // In a real scenario without altering server.js, we just let it bind or mock express's listen.
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const express = require('express');
    const expressSpy = jest.spyOn(express.application, 'listen').mockImplementation(() => {});
    app = require('../../mern-todo-app/TODO/todo_backend/server');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /add (creates a task)', () => {
    it('should create a task', async () => {
      const mockTask = { _id: '1', task: 'Test task', done: false };
      TodoModel.create.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/add')
        .send({ task: 'Test task' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockTask);
      expect(TodoModel.create).toHaveBeenCalledWith({ task: 'Test task' });
    });
  });

  describe('GET /get (returns all tasks)', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { _id: '1', task: 'Test task 1', done: false },
        { _id: '2', task: 'Test task 2', done: true },
      ];
      TodoModel.find.mockResolvedValue(mockTasks);

      const response = await request(app).get('/get');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(TodoModel.find).toHaveBeenCalled();
    });
  });

  describe('PUT /edit/:id (updates task status)', () => {
    it('should mark a task as complete', async () => {
      const mockTask = { _id: '1', task: 'Test task', done: true };
      TodoModel.findByIdAndUpdate.mockResolvedValue(mockTask);

      const response = await request(app).put('/edit/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockTask);
      expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { done: true }, { new: true });
    });
  });
  
  describe('PUT /update/:id (updates task content)', () => {
    it('should update task text', async () => {
      const mockTask = { _id: '1', task: 'Updated task', done: false };
      TodoModel.findByIdAndUpdate.mockResolvedValue(mockTask);

      const response = await request(app)
        .put('/update/1')
        .send({ task: 'Updated task' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockTask);
      expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { task: 'Updated task' });
    });
  });

  describe('DELETE /delete/:id (deletes a task)', () => {
    it('should delete a task', async () => {
      const mockResult = { _id: '1', task: 'Test task', done: false };
      TodoModel.findByIdAndDelete.mockResolvedValue(mockResult);

      const response = await request(app).delete('/delete/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: '1' });
    });
  });
});
