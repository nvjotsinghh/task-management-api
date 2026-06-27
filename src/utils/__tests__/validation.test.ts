import {
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  createCommentSchema,
} from '../../utils/validation';

describe('Validation Schemas', () => {
  describe('createProjectSchema', () => {
    it('should pass with valid data', () => {
      const { error } = createProjectSchema.validate({ name: 'My Project', description: 'A description' });
      expect(error).toBeUndefined();
    });

    it('should fail if name is missing', () => {
      const { error } = createProjectSchema.validate({ description: 'desc' });
      expect(error).toBeDefined();
    });

    it('should fail if name is too short', () => {
      const { error } = createProjectSchema.validate({ name: 'ab', description: 'desc' });
      expect(error).toBeDefined();
    });
  });

  describe('updateProjectSchema', () => {
    it('should pass with partial data', () => {
      const { error } = updateProjectSchema.validate({ name: 'Updated Name' });
      expect(error).toBeUndefined();
    });

    it('should fail if empty object', () => {
      const { error } = updateProjectSchema.validate({});
      expect(error).toBeDefined();
    });
  });

  describe('createTaskSchema', () => {
    it('should pass with valid data', () => {
      const { error } = createTaskSchema.validate({ title: 'My Task', description: 'Task description' });
      expect(error).toBeUndefined();
    });

    it('should fail if title is missing', () => {
      const { error } = createTaskSchema.validate({ description: 'desc' });
      expect(error).toBeDefined();
    });

    it('should fail with invalid status', () => {
      const { error } = createTaskSchema.validate({ title: 'Task', description: 'desc', status: 'invalid' });
      expect(error).toBeDefined();
    });

    it('should pass with valid status', () => {
      const { error } = createTaskSchema.validate({ title: 'Task', description: 'desc', status: 'in-progress' });
      expect(error).toBeUndefined();
    });
  });

  describe('updateTaskSchema', () => {
    it('should pass with partial data', () => {
      const { error } = updateTaskSchema.validate({ status: 'done' });
      expect(error).toBeUndefined();
    });

    it('should fail if empty object', () => {
      const { error } = updateTaskSchema.validate({});
      expect(error).toBeDefined();
    });
  });

  describe('createCommentSchema', () => {
    it('should pass with valid body', () => {
      const { error } = createCommentSchema.validate({ body: 'This is a comment' });
      expect(error).toBeUndefined();
    });

    it('should fail if body is missing', () => {
      const { error } = createCommentSchema.validate({});
      expect(error).toBeDefined();
    });

    it('should fail if body is empty string', () => {
      const { error } = createCommentSchema.validate({ body: '' });
      expect(error).toBeDefined();
    });
  });
});