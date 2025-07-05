// utils/utils.ts
import { Response } from 'express';

export const serverError = (res: Response, error: unknown): void => {
  console.error(error);
  res.status(500).json({
    status: 'error',
    message: 'Server error',
    errorMessage: error instanceof Error ? error.message : 'Unknown error',
  });
};
