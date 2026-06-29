import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Middleware factory that validates request bodies against a Joi schema.
 * Returns a 400 response with detailed error messages if validation fails.
 * Uses abortEarly: false to collect all validation errors at once.
 * @param schema - Joi schema to validate the request body against
 * @returns Express middleware function that performs the validation
 */
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Validate with abortEarly false to surface all errors at once
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        error: 'Validation failed',
        // Map Joi error details to human-readable messages
        details: error.details.map(d => d.message),
      });
      return;
    }

    next();
  };
};