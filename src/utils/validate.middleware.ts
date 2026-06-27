import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Middleware factory to validate request body against a Joi schema
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message),
      });
      return;
    }
    next();
  };
};