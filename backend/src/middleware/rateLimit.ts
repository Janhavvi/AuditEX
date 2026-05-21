import type { Request, Response, NextFunction } from 'express';

const hits = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (limit = 60, windowMs = 60_000) => (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }

  current.count += 1;
  if (current.count > limit) {
    res.status(429).json({ message: 'Too many requests. Please try again shortly.' });
    return;
  }

  next();
};
