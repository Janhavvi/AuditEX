export const referralCodeFromAuditId = (auditId?: string) =>
  auditId ? `AIX-${auditId.replace(/^aud_/, '').slice(-6).toUpperCase()}` : '';

export const withReferralCode = (url: string, referralCode: string) => {
  if (!url || !referralCode) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}ref=${encodeURIComponent(referralCode)}`;
};
