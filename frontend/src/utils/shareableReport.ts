import type { AuditReport } from '../types/audit';
import { referralCodeFromAuditId, withReferralCode } from './referral';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const bytesToBase64Url = (bytes: Uint8Array) => {
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
};

const base64UrlToBytes = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

export const decodeEmbeddedReport = (value: string): AuditReport | null => {
  try {
    return JSON.parse(textDecoder.decode(base64UrlToBytes(value))) as AuditReport;
  } catch {
    return null;
  }
};

export const createEmbeddedReportLink = (report: AuditReport, origin: string) => {
  const auditId = report.auditId || `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const publicReport: AuditReport = {
    ...report,
    auditId,
    createdAt: report.createdAt || new Date().toISOString(),
  };
  const encoded = bytesToBase64Url(textEncoder.encode(JSON.stringify(publicReport)));
  const referralCode = referralCodeFromAuditId(auditId);
  const url = withReferralCode(`${origin}/audit/${auditId}?report=${encoded}`, referralCode);

  return { auditId, report: publicReport, url };
};
