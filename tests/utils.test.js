const { validateEmail, calculateTaskCompletionPercentage } = require('./utils');

describe('Utility Functions Unit Tests', () => {
  describe('validateEmail', () => {
    it('should return true for a valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for an invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });
  });

  describe('calculateTaskCompletionPercentage', () => {
    it('should return 0 when there are no tasks', () => {
      expect(calculateTaskCompletionPercentage([])).toBe(0);
      expect(calculateTaskCompletionPercentage(null)).toBe(0);
    });

    it('should calculate the correct percentage', () => {
      const tasks = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: false },
        { task: 'Task 3', done: true },
        { task: 'Task 4', done: false },
      ];
      expect(calculateTaskCompletionPercentage(tasks)).toBe(50);
    });

    it('should return 100 when all tasks are done', () => {
      const tasks = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: true },
      ];
      expect(calculateTaskCompletionPercentage(tasks)).toBe(100);
    });
  });
});
