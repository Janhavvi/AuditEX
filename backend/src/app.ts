import cors from 'cors';
import express from 'express';
import auditRoutes from './routes/auditRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimit } from './middleware/rateLimit.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'AuditEX API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      audits: '/api/audits',
      auditPdf: '/api/audits/:id/pdf',
      leads: '/api/leads',
    },
  });
});

app.use('/api', rateLimit(90, 60_000));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AuditEX API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/audits', auditRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    message: 'Not found',
    path: _req.path,
  });
});

app.use(errorHandler);

export default app;
