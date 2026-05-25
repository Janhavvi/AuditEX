# Tests

## How To Run

From the frontend app:

```bash
cd frontend
npm run test
```

For the full local verification pass used before final cleanup:

```bash
cd frontend
npm run lint
npm run test
npm run build

cd ../backend
npm run build
```

## Automated Tests Written

### `frontend/src/utils/auditEngine.test.ts`

This file covers the deterministic audit engine, which is the highest-risk part of the product because it calculates customer-facing savings. The tests call `runAudit` directly with typed `AuditTool` fixtures and assert totals, recommendations, savings amounts, and no-savings behavior.

1. `flags unused seats using vendor seat pricing`
   - Covers unused-seat detection for ChatGPT Team.
   - Verifies the engine calculates four unused seats at the public $30/seat/month benchmark, producing $120/month in savings.
   - Also checks total monthly spend remains $300.

2. `flags spend above public plan benchmarks`
   - Covers spend that is materially above public list pricing.
   - Uses GitHub Copilot Business with five seats and $300 entered spend.
   - Verifies the benchmark-gap recommendation exists and calculates $205/month in savings against the expected public benchmark.

3. `recommends API workload routing only for high-volume API spend`
   - Covers conservative API workload-routing logic.
   - Uses OpenAI API direct at $1,000/month.
   - Verifies the recommendation includes OpenAI API direct and applies the 12% high-volume routing estimate.

4. `models category consolidation from the smallest overlapping spend`
   - Covers duplicate assistant tooling.
   - Uses ChatGPT, Claude, and Gemini together.
   - Verifies consolidation savings are modeled from the smallest duplicate line item, not a broad percentage cut.

5. `caps total estimated savings at 72 percent of monthly spend`
   - Covers the global savings cap.
   - Uses overlapping coding-tool spend across Cursor, GitHub Copilot, and Windsurf.
   - Verifies total savings never exceed 72% of monthly spend and annual savings remain exactly monthly savings times 12.

6. `does not manufacture recommendations for tools with no monthly spend`
   - Covers the honest low/no-spend path.
   - Uses Cursor Hobby at $0/month.
   - Verifies the engine returns zero recommendations and zero estimated savings.

## CI Coverage

The GitHub Actions workflow is defined at:

```text
.github/workflows/ci.yml
```

It runs on pushes and pull requests to `main` and performs:

- root dependency install
- frontend dependency install
- backend dependency install
- frontend lint
- frontend audit-engine tests
- frontend production build
- backend TypeScript build

## Latest Local Verification

The following commands were run successfully after the final refactor:

- `npm run lint` in `frontend`
- `npm run test` in `frontend` — 1 test file, 6 tests passed
- `npm run build` in `frontend`
- `npm run build` in `backend`

The frontend build still reports Vite's existing large chunk warning because charts, Three.js, animation, and the main app are bundled together. It does not fail the build, but route-level code splitting is the next production optimization.
