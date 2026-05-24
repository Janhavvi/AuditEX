# Tests

## Automated Tests

### `frontend/src/utils/auditEngine.test.ts`

Run with:

```bash
cd frontend
npm run test
```

Coverage:

1. Unused seats: verifies `runAudit` detects extra ChatGPT Team seats and calculates savings from vendor seat pricing.
2. Plan benchmark gap: verifies spend above GitHub Copilot Business public benchmark creates a recommendation with the expected savings.
3. API routing: verifies high-volume OpenAI API spend triggers conservative workload-routing savings.
4. Category consolidation: verifies overlapping assistant tools model savings from the smallest duplicate spend, not a blanket percentage.
5. Savings cap: verifies total estimated savings are capped at 72 percent of monthly spend and annual savings match monthly savings times 12.
6. No-spend path: verifies free or zero-spend tools do not generate manufactured recommendations or savings.

## CI

GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

The workflow runs on pushes and pull requests to `main`:

- frontend install
- backend install
- frontend lint
- frontend audit-engine tests
- frontend build
- backend build

## Manual Verification

Manual checks performed locally during development:

- `npm run build` in `frontend`
- `npm run lint` in `frontend`
- `npm run test` in `frontend`
- `npm run build` in `backend`
- Local API checks for summary fallback, lead capture, public share preview, Open Graph SVG, and PDF export
