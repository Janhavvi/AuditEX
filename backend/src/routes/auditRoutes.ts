import { Router } from 'express';
import { createAudit, generateSummary, getAudit, getAuditOgImage, getAuditPdf, getAuditSharePreview } from '../controllers/auditController.js';

const router = Router();

router.post('/', createAudit);
router.post('/summary', generateSummary);
router.get('/:id/share', getAuditSharePreview);
router.get('/:id/og.svg', getAuditOgImage);
router.get('/:id/pdf', getAuditPdf);
router.get('/:id', getAudit);

export default router;
