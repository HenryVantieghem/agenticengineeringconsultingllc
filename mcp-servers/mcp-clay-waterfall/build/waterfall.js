/**
 * Waterfall runner — tries providers in order, returns first non-null result.
 *
 * Includes:
 * - Graceful skip for unconfigured providers
 * - Retry with exponential backoff on rate-limit (429) responses
 * - Structured logging to stderr (so it doesn't pollute MCP stdio)
 */
// ---------------------------------------------------------------------------
// Logging helper (stderr so MCP transport stays clean)
// ---------------------------------------------------------------------------
export function log(level, message, meta) {
    const entry = {
        ts: new Date().toISOString(),
        level,
        message,
        ...meta,
    };
    process.stderr.write(JSON.stringify(entry) + "\n");
}
// ---------------------------------------------------------------------------
// Rate-limit aware fetch wrapper
// ---------------------------------------------------------------------------
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
export async function fetchWithRetry(url, init, retries = MAX_RETRIES) {
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, init);
            if (res.status === 429 && attempt < retries) {
                const delay = BASE_DELAY_MS * Math.pow(2, attempt);
                log("warn", `Rate-limited by ${url}, retrying in ${delay}ms`, { attempt });
                await sleep(delay);
                continue;
            }
            return res;
        }
        catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt < retries) {
                const delay = BASE_DELAY_MS * Math.pow(2, attempt);
                log("warn", `Fetch error for ${url}, retrying in ${delay}ms`, {
                    attempt,
                    error: lastError.message,
                });
                await sleep(delay);
            }
        }
    }
    throw lastError ?? new Error(`fetchWithRetry failed after ${retries + 1} attempts`);
}
// ---------------------------------------------------------------------------
// Waterfall executor
// ---------------------------------------------------------------------------
/**
 * Run `fn` against each provider in order. Return the first non-null result,
 * along with the name of the provider that produced it.
 */
export async function waterfall(providers, fn) {
    for (const provider of providers) {
        if (!provider.isConfigured()) {
            log("info", `Skipping ${provider.name} — not configured`);
            continue;
        }
        try {
            log("info", `Trying ${provider.name}...`);
            const result = await fn(provider);
            if (result !== null && result !== undefined) {
                log("info", `Hit from ${provider.name}`, { provider: provider.name });
                return { result, provider: provider.name };
            }
            log("info", `No result from ${provider.name}`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            log("error", `Error from ${provider.name}: ${message}`, { provider: provider.name });
            // Continue to next provider
        }
    }
    return null;
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=waterfall.js.map