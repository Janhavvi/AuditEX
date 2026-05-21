import type { AuditReport, Recommendation } from '../types/audit.js';

const pageWidth = 612;
const pageHeight = 792;
const margin = 54;
const lineHeight = 14;

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const escapePdfText = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '-');

const wrapText = (text: string, maxChars: number) => {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
};

interface PdfLine {
  text: string;
  size?: number;
  bold?: boolean;
  color?: [number, number, number];
  spacingAfter?: number;
}

const recommendationText = (recommendation: Recommendation) =>
  `${recommendation.title}: ${recommendation.reasoning} Estimated monthly savings: ${currency(
    recommendation.estimatedMonthlySavings,
  )}. Severity: ${recommendation.severity}.`;

const buildLines = (report: AuditReport): PdfLine[] => [
  { text: 'AuditEX AI Spend Report', size: 22, bold: true, color: [0.05, 0.18, 0.28], spacingAfter: 10 },
  { text: `Report ID: ${report.auditId || 'local-report'}`, size: 9, color: [0.38, 0.45, 0.55], spacingAfter: 18 },
  { text: 'Executive Summary', size: 15, bold: true, color: [0.05, 0.18, 0.28], spacingAfter: 6 },
  {
    text:
      report.summary ||
      `AuditEX reviewed ${report.tools.length} AI tools and found ${currency(
        report.totals.estimatedMonthlySavings,
      )} in defensible monthly savings.`,
    size: 10,
    color: [0.12, 0.16, 0.22],
    spacingAfter: 16,
  },
  { text: 'Savings Snapshot', size: 15, bold: true, color: [0.05, 0.18, 0.28], spacingAfter: 6 },
  { text: `Monthly spend: ${currency(report.totals.totalMonthlySpend)}`, size: 10 },
  { text: `Yearly spend: ${currency(report.totals.totalYearlySpend)}`, size: 10 },
  { text: `Estimated monthly savings: ${currency(report.totals.estimatedMonthlySavings)}`, size: 10 },
  { text: `Estimated yearly savings: ${currency(report.totals.estimatedYearlySavings)}`, size: 10, spacingAfter: 16 },
  { text: 'Tools Reviewed', size: 15, bold: true, color: [0.05, 0.18, 0.28], spacingAfter: 6 },
  ...report.tools.map((tool) => ({
    text: `${tool.toolName} - ${tool.plan} - ${currency(tool.monthlySpend)}/mo - ${tool.seats} seats - ${tool.useCase}`,
    size: 10,
  })),
  { text: 'Recommendations', size: 15, bold: true, color: [0.05, 0.18, 0.28], spacingAfter: 6 },
  ...report.recommendations.map((recommendation) => ({
    text: recommendationText(recommendation),
    size: 10,
    spacingAfter: 8,
  })),
  {
    text: 'Public report note: contact details collected through lead capture are not embedded in this PDF.',
    size: 9,
    color: [0.38, 0.45, 0.55],
    spacingAfter: 0,
  },
];

const paginate = (lines: PdfLine[]) => {
  const pages: string[][] = [[]];
  let y = pageHeight - margin;

  const addPage = () => {
    pages.push([]);
    y = pageHeight - margin;
  };

  for (const line of lines) {
    const size = line.size || 10;
    const wrapped = wrapText(line.text, size >= 15 ? 58 : 88);
    const requiredHeight = wrapped.length * lineHeight + (line.spacingAfter || 4);

    if (y - requiredHeight < margin) addPage();

    const color = line.color || [0.12, 0.16, 0.22];
    pages[pages.length - 1].push(`${color.join(' ')} rg`);
    pages[pages.length - 1].push(`/${line.bold ? 'F2' : 'F1'} ${size} Tf`);

    for (const wrappedLine of wrapped) {
      pages[pages.length - 1].push(`BT ${margin} ${y} Td (${escapePdfText(wrappedLine)}) Tj ET`);
      y -= lineHeight;
    }

    y -= line.spacingAfter || 4;
  }

  return pages;
};

export const buildAuditPdf = (report: AuditReport) => {
  const pages = paginate(buildLines(report));
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

  pages.forEach((commands, index) => {
    const contentId = 5 + index * 2;
    const pageId = contentId + 1;
    pageObjectIds.push(pageId);
    const stream = commands.join('\n');
    objects[contentId] = `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;

  const orderedObjects = objects.map((content, index) => ({ index, content })).filter((item) => item.index > 0 && item.content);
  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (const object of orderedObjects) {
    offsets[object.index] = Buffer.byteLength(pdf, 'utf8');
    pdf += `${object.index} 0 obj\n${object.content}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  const maxObjectId = objects.length - 1;
  pdf += `xref\n0 ${maxObjectId + 1}\n0000000000 65535 f \n`;

  for (let index = 1; index <= maxObjectId; index += 1) {
    pdf += `${String(offsets[index] || 0).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
};
