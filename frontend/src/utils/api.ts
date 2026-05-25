import axios from 'axios';
import type { AuditReport, LeadPayload } from '../types/audit';

const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
const currentHostname = typeof window === 'undefined' ? 'localhost' : window.location.hostname;
const defaultApiBaseUrl = localHosts.has(currentHostname) ? 'http://localhost:5000/api' : '/api';
const apiBaseUrl = import.meta.env.VITE_API_URL || defaultApiBaseUrl;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
});

export const saveAudit = async (report: AuditReport) => {
  const { data } = await api.post<AuditReport>('/audits', report);
  return data;
};

export const fetchAudit = async (id: string) => {
  const { data } = await api.get<AuditReport>(`/audits/${id}`);
  return data;
};

export const saveLead = async (lead: LeadPayload) => {
  const { data } = await api.post('/leads', lead);
  return data;
};

export const generateSummary = async (report: AuditReport) => {
  const { data } = await api.post<{ summary: string }>('/audits/summary', report);
  return data.summary;
};

export const getAuditPdfUrl = (id: string) => `${apiBaseUrl}/audits/${encodeURIComponent(id)}/pdf`;
export const getAuditShareUrl = (id: string) => `${apiBaseUrl}/audits/${encodeURIComponent(id)}/share`;

export default api;
