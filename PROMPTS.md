# AuditEX AI Summary Prompt

Audit calculations are deterministic and rule-based. AI is used only to write the personalized summary paragraph shown on the results page.

Provider order:
1. NVIDIA NIM chat completions, using `NVIDIA_NIM_API_KEY` and `NVIDIA_NIM_MODEL`.
2. Anthropic Messages API, using `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`, as an optional secondary LLM.
3. Deterministic templated fallback if no LLM is configured, a provider fails, a request times out, or a model returns empty text.

## Summary Prompt

```text
Write one polished ~100-word paragraph for an AI spend audit summary.

Rules:
- Use only the numbers and recommendations supplied.
- Do not invent savings.
- Do not rank tools as good or bad.
- If monthly savings are below $100, say the customer is already spending efficiently.
- Mention the strongest recommendation themes.
- Tone: concise, premium, CFO-friendly.
- Output exactly one paragraph. No bullets, headings, JSON, markdown, or preamble.

Report JSON:
{{REPORT_JSON}}
```

`{{REPORT_JSON}}` is replaced at runtime with:

```json
{
  "toolCount": 3,
  "totalMonthlySpend": 1200,
  "estimatedMonthlySavings": 260,
  "estimatedYearlySavings": 3120,
  "recommendations": [
    {
      "action": "Review ChatGPT Team plan fit",
      "savings": 80,
      "reasoning": "The current plan benchmark is lower than entered spend..."
    }
  ]
}
```

## Failure Handling

If the NVIDIA API key is missing, the API is unavailable, or the model returns an empty response, AuditEX tries the optional secondary LLM if configured. If that also fails, AuditEX uses a templated fallback summary generated from the same deterministic audit data.

## Why This Prompt Is Written This Way

- "Use only the numbers and recommendations supplied" prevents the model from inventing benchmark data or extra savings.
- "Do not rank tools as good or bad" keeps the tone focused on spend fit rather than vendor judgment.
- "If monthly savings are below $100" forces honest low-savings messaging instead of manufacturing urgency.
- The JSON payload includes only derived audit facts, not lead details, emails, company names, or hidden form fields.
- The one-paragraph instruction keeps the summary usable in the report hero, PDF export, and public report page.

## What I Tried That Did Not Work

- Letting the model infer recommendations from raw tools was rejected because it made the audit math non-deterministic.
- Asking for a long executive memo made the results page feel slower and less scannable.
- Client-side-only summary generation was rejected because API keys must stay on the backend.
- Relying on one LLM provider was rejected because missing keys, rate limits, or API downtime should not block the report.
