import { v4 as uuid } from 'uuid';

export const generateAuditId = () => `aud_${uuid().replaceAll('-', '').slice(0, 14)}`;
