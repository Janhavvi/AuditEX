# AuditEX AI Summary Prompt

Audit calculations are deterministic and rule-based. AI is used only to write the personalized summary paragraph shown on the results page.

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

Report JSON:
{{toolCount, totalMonthlySpend, estimatedMonthlySavings, estimatedYearlySavings, recommendations}}
```

## Failure Handling

If the Anthropic API key is missing, the API is unavailable, or the model returns an empty response, AuditEX uses a templated fallback summary generated from the same deterministic audit data.

