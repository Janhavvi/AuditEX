# Abuse Protection

AuditEX implements two lightweight protections for the MVP:

1. In-memory IP rate limiting on `/api`.
   - Limit: 90 requests per minute per IP.
   - Reason: blocks accidental refresh loops and low-effort spam without adding user friction.

2. Honeypot field on lead capture.
   - Field: `website`.
   - Real users never see it. If bots fill it, the API returns `204` and does not store the lead.
   - Reason: protects the post-value lead form while keeping the no-login experience.

For production, replace the in-memory limiter with Redis, Upstash, Cloudflare, or an edge gateway limiter so limits are shared across instances.

