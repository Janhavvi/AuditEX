const HIGH_SAVINGS_THRESHOLD = 500;

const cleanString = (value: unknown) => (typeof value === 'string' ? value.trim() : undefined);

const positiveNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
};

export const parseLeadPayload = (body: Record<string, unknown>) => {
  const name = cleanString(body.name);
  const email = cleanString(body.email)?.toLowerCase();

  if (!name || !email) {
    return { error: 'name and email are required.' as const };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'A valid email is required.' as const };
  }

  const estimatedMonthlySavings = positiveNumber(body.estimatedMonthlySavings) || 0;

  return {
    data: {
      name,
      email,
      company: cleanString(body.company),
      role: cleanString(body.role),
      auditId: cleanString(body.auditId),
      teamSize: positiveNumber(body.teamSize),
      estimatedMonthlySavings,
      highSavings: estimatedMonthlySavings >= HIGH_SAVINGS_THRESHOLD,
    },
  };
};

export const isHoneypotFilled = (body: Record<string, unknown>) => Boolean(cleanString(body.website));
