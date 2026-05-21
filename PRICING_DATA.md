# AuditEX Pricing Data

Last reviewed: May 21, 2026

AuditEX uses public list prices only as benchmarks. API and enterprise plans are usage-based or custom, so the user-entered current monthly spend remains the source of truth for calculations.

| Tool | Plans supported | Benchmark used | Official source |
| --- | --- | --- | --- |
| Cursor | Hobby, Pro, Business, Enterprise | Hobby $0; Pro $20/mo; Business maps to Cursor Teams at $40/user/mo; Enterprise custom | https://cursor.com/pricing |
| GitHub Copilot | Individual, Business, Enterprise | Individual benchmark $10/mo; Business $19/user/mo; Enterprise $39/user/mo | https://github.com/features/copilot/plans |
| Claude | Free, Pro, Max, Team, Enterprise, API direct | Free $0; Pro $20/mo; Max benchmark $100/mo; Team benchmark $30/user/mo; Enterprise custom; API direct usage-based | https://claude.com/pricing and https://platform.claude.com/docs/en/about-claude/pricing |
| ChatGPT | Plus, Team, Enterprise, API direct | Plus $20/mo; Team/Business benchmark $30/user/mo; Enterprise custom; API direct usage-based | https://chatgpt.com/pricing/ and https://openai.com/api/pricing/ |
| Anthropic API direct | API direct | Usage-based; user-entered spend used as source of truth | https://claude.com/pricing#api and https://platform.claude.com/docs/en/about-claude/pricing |
| NVIDIA NIM | API direct | Usage-based endpoints or self-hosted NIM / NVIDIA AI Enterprise cost; user-entered spend used as source of truth | https://docs.api.nvidia.com/nim/docs/overview and https://docs.api.nvidia.com/nim/docs/run-anywhere |
| OpenAI API direct | API direct | Usage-based; user-entered spend used as source of truth | https://openai.com/api/pricing/ |
| Gemini | Pro, Ultra, API | Pro $19.99/mo; Ultra starts at $99.99/mo; API usage-based | https://gemini.google/us/subscriptions/?hl=en and https://ai.google.dev/gemini-api/docs/pricing |
| Windsurf | Free, Pro, Team, Enterprise | Free $0; Pro benchmark $15/mo; Team benchmark $30/user/mo; Enterprise custom | https://windsurf.com/pricing and https://docs.windsurf.com/windsurf/accounts/usage |
| v0 | Free, Pro, Team, Enterprise | Free $0 with included credits; Pro benchmark $20/mo; Team $30/user/mo; Enterprise custom | https://v0.app/pricing and https://vercel.com/docs/v0 |

## Defensibility Rules

- Seat savings are calculated from unused seats multiplied by public seat price, or by effective entered spend per seat when public seat price is custom/usage-based.
- Plan downgrade savings are calculated only when a cheaper public plan exists and the team size/use case makes the current plan plausibly overpowered.
- API routing savings use conservative assumptions and are shown only for high-volume API spend.
- Credits/committed-use/private-offer opportunities are flagged with $0 estimated savings until eligibility is confirmed.
- Enterprise and API direct plans do not invent list pricing; they use the user's entered current monthly spend.
