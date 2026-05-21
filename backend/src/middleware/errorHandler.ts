import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({
    message: status === 500 ? 'Internal server error.' : error.message,
  });
};
