import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Copy,
  ExternalLink,
  LockKeyhole,
  Mail,
  MessageCircle,
  Printer,
  Share2,
  Users,
} from 'lucide-react';

interface Props {
  copyState: 'idle' | 'copied';
  publicReportUrl: string;
  publicView: boolean;
  pdfUrl: string;
  shareSubject: string;
  shareText: string;
  shareUrl: string;
  onCopy: () => void;
  onNativeShare: () => void;
}

export default function SharePanel({
  copyState,
  publicReportUrl,
  publicView,
  pdfUrl,
  shareSubject,
  shareText,
  shareUrl,
  onCopy,
  onNativeShare,
}: Props) {
  if (!shareUrl) return null;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const links = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <BriefcaseBusiness className="h-4 w-4" />,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Share2 className="h-4 w-4" />,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      label: 'Teams',
      href: `https://teams.microsoft.com/share?href=${encodedUrl}&msgText=${encodedText}`,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      icon: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mb-8 border-b border-white/10 pb-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <LockKeyhole className="h-4 w-4" />
            Shareable result URL
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {publicView ? 'Public audit snapshot' : 'Your private report now has a public link'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#94A3B8]">
            This public version shows tools, totals, savings, and recommendations only. Contact details from lead capture are stored separately.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
          <button type="button" onClick={onNativeShare} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button type="button" onClick={onCopy} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
            {copyState === 'copied' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copyState === 'copied' ? 'Copied' : 'Copy link'}
          </button>
          {!publicView && (
            <Link to={publicReportUrl.replace(window.location.origin, '')} className="app-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
              <ExternalLink className="h-4 w-4" />
              Open public view
            </Link>
          )}
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
              className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
          <a href={pdfUrl} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
            <Printer className="h-4 w-4" />
            PDF
          </a>
        </div>
      </div>

      <p className="mt-4 break-all text-xs leading-5 text-[#94A3B8]">
        Public report: {publicReportUrl}. Shared links use a preview endpoint for social cards without exposing contact details.
      </p>
    </div>
  );
}
