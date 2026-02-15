# Adding a New Provider

Each data provider lives in its own file under `src/providers/`.

## Steps

1. **Create the file** — `src/providers/yourprovider.ts`

2. **Implement the `EnrichmentProvider` interface** (from `src/types.ts`):

```typescript
import type { EnrichmentProvider, EmailResult } from "../types.js";
import { fetchWithRetry, log } from "../waterfall.js";

export class YourProvider implements EnrichmentProvider {
  name = "yourprovider";
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.YOUR_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async findEmail(name: string, domain: string): Promise<EmailResult | null> {
    // Call your API, return { email, verified, confidence } or null
  }

  // Implement whichever methods your API supports:
  // findPhone?, enrichPerson?, enrichCompany?, findDecisionMakers?, verifyEmail?
}
```

3. **Register the provider** in `src/providers/index.ts`:

```typescript
import { YourProvider } from "./yourprovider.js";

const yourProvider = new YourProvider();

// Add to the relevant priority arrays:
export const emailProviders = [
  hunter, snov, apollo, prospeo, rocketreach, pdl,
  yourProvider,  // <-- add here
];
```

4. **Add the env var** to your `.env` or server config:
```
YOUR_API_KEY=sk-xxx
```

## Key Rules

- Use `fetchWithRetry()` from `../waterfall.js` for all HTTP calls (handles rate limits).
- Return `null` for "no data" — the waterfall runner continues to the next provider.
- Throw an error only for unexpected failures (server errors, malformed responses).
- Log warnings via `log("warn", ...)` — don't let provider errors crash the server.
- The `isConfigured()` method must return `false` if the required API key is missing.
  The waterfall runner will skip unconfigured providers automatically.

## Current Providers

| Provider       | Env Var(s)                    | Email | Phone | Person | Company | Decision Makers | Verify |
|----------------|-------------------------------|-------|-------|--------|---------|-----------------|--------|
| Hunter.io      | `HUNTER_API_KEY`              | Yes   | No    | Yes    | Yes     | Yes             | Yes    |
| Snov.io        | `SNOV_USER_ID`, `SNOV_API_KEY`| Yes   | No    | Yes    | No      | Yes             | No     |
| Apollo.io      | `APOLLO_API_KEY`              | Yes   | Yes   | Yes    | Yes     | Yes             | No     |
| Prospeo.io     | `PROSPEO_API_KEY`             | Yes   | No    | Yes    | No      | No              | No     |
| RocketReach    | `ROCKETREACH_API_KEY`         | Yes   | Yes   | Yes    | No      | Yes             | No     |
| Lusha          | `LUSHA_API_KEY`               | Yes   | Yes   | Yes    | No      | No              | No     |
| PeopleDataLabs | `PDL_API_KEY`                 | Yes   | Yes   | Yes    | Yes     | Yes             | No     |
