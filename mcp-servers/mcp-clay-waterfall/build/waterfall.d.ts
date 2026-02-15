/**
 * Waterfall runner — tries providers in order, returns first non-null result.
 *
 * Includes:
 * - Graceful skip for unconfigured providers
 * - Retry with exponential backoff on rate-limit (429) responses
 * - Structured logging to stderr (so it doesn't pollute MCP stdio)
 */
import type { EnrichmentProvider, WaterfallHit } from "./types.js";
export declare function log(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>): void;
export declare function fetchWithRetry(url: string, init?: RequestInit, retries?: number): Promise<Response>;
/**
 * Run `fn` against each provider in order. Return the first non-null result,
 * along with the name of the provider that produced it.
 */
export declare function waterfall<T>(providers: EnrichmentProvider[], fn: (provider: EnrichmentProvider) => Promise<T | null>): Promise<WaterfallHit<T> | null>;
export declare function sleep(ms: number): Promise<void>;
//# sourceMappingURL=waterfall.d.ts.map