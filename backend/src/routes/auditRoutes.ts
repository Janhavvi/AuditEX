import { Router } from 'express';
import { createAudit, generateSummary, getAudit, getAuditPdf } from '../controllers/auditController.js';

const router = Router();

router.post('/', createAudit);
router.post('/summary', generateSummary);
router.get('/:id/pdf', getAuditPdf);
router.get('/:id', getAudit);

export default router;
