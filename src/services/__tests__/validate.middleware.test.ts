import { validate } from '../../middlewares/validate.middleware';
import { createProjectSchema } from '../../utils/validation';
import { Request, Response, NextFunction } from 'express';

const mockReq = (body: object) => ({ body } as Request);
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = () => jest.fn() as NextFunction;

describe('Validate Middleware', () => {
  it('should call next() if validation passes', () => {
    const req = mockReq({ name: 'My Project', description: 'A description' });
    const res = mockRes();
    const next = mockNext();
    validate(createProjectSchema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    const req = mockReq({ name: 'ab' });
    const res = mockRes();
    const next = mockNext();
    validate(createProjectSchema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Validation failed' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return details array on validation failure', () => {
    const req = mockReq({});
    const res = mockRes();
    const next = mockNext();
    validate(createProjectSchema)(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ details: expect.any(Array) }));
  });
});