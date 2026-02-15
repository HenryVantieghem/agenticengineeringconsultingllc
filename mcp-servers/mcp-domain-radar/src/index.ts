#!/usr/bin/env node

/**
 * mcp-domain-radar — Domain intelligence MCP server.
 *
 * Detects new businesses via domain registrations, WHOIS changes,
 * and tech stack monitoring. First-mover advantage: find businesses
 * 30-90 days BEFORE they appear on Google Maps.
 *
 * Tools:
 *   find_new_registrations  — Search newly registered domains by keyword
 *   whois_lookup            — Full WHOIS lookup for a domain
 *   monitor_domains         — Track WHOIS changes for a list of domains
 *   detect_industry         — Guess business industry from domain signals
 *   search_new_businesses   — High-level: find + enrich + filter new businesses
 *   domain_tech_check       — Detect technologies on a domain's website
 *   track_expirations       — Check WHOIS expiration dates for domains
 *
 * Env:
 *   WHOISXML_API_KEY   — Required. From https://whoisxmlapi.com
 *   WHOISXML_BASE_URL  — Optional. Defaults to https://www.whoisxmlapi.com
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { WhoisXMLClient } from "./whoisxml.js";
import { IndustryDetector, getIndustryKeywords } from "./industry-detector.js";
import { TechDetector } from "./tech-detector.js";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const WHOISXML_API_KEY = process.env.WHOISXML_API_KEY;
const WHOISXML_BASE_URL = process.env.WHOISXML_BASE_URL;

if (!WHOISXML_API_KEY) {
  console.error(
    "ERROR: WHOISXML_API_KEY environment variable is required.\n" +
      "Get a free key at https://whoisxmlapi.com (500 credits/month)."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const whois = new WhoisXMLClient(WHOISXML_API_KEY, WHOISXML_BASE_URL);
const industryDetector = new IndustryDetector();
const techDetector = new TechDetector();

// Simple in-memory store for monitor_domains (tracks last-seen WHOIS state)
const domainStateCache = new Map<string, Record<string, unknown>>();

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "mcp-domain-radar",
  version: "1.0.0",
});

// =========================================================================
// Tool 1: find_new_registrations
// =========================================================================

server.tool(
  "find_new_registrations",
  "Search for newly registered domains matching keywords. Uses WhoisXML Newly Registered Domains API. Default: last 7 days, .com/.net/.org TLDs.",
  {
    keywords: z
      .array(z.string())
      .describe("Keywords to search for in domain names (e.g. ['dental', 'dentist', 'orthodontist'])"),
    tlds: z
      .array(z.string())
      .optional()
      .describe("TLD filters (default: ['com', 'net', 'org']). Example: ['com', 'dental', 'health']"),
    since_date: z
      .string()
      .optional()
      .describe("Search since this date (YYYY-MM-DD). Default: 7 days ago."),
    limit: z
      .number()
      .optional()
      .describe("Max results to return (default: 100)"),
  },
  async ({ keywords, tlds, since_date, limit }) => {
    try {
      const results = await whois.findNewRegistrations(keywords, {
        tlds,
        sinceDate: since_date,
        limit,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                count: results.length,
                keywords,
                domains: results,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error searching new registrations: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// =========================================================================
// Tool 2: whois_lookup
// =========================================================================

server.tool(
  "whois_lookup",
  "Full WHOIS lookup for a domain. Returns registrant info, creation/expiration dates, name servers, and registrar.",
  {
    domain: z.string().describe("Domain to look up (e.g. 'example.com')"),
  },
  async ({ domain }) => {
    try {
      const result = await whois.whoisLookup(domain);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error looking up WHOIS for ${domain}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// =========================================================================
// Tool 3: monitor_domains
// =========================================================================

server.tool(
  "monitor_domains",
  "Monitor a list of domains for WHOIS changes since last check. Tracks registrant, name server, and registrar changes.",
  {
    domains: z
      .array(z.string())
      .describe("Domains to monitor for changes"),
  },
  async ({ domains }) => {
    const results: Array<{
      domain: string;
      changes: Array<{ field: string; old_value: string | null; new_value: string | null }>;
      error?: string;
    }> = [];

    for (const domain of domains) {
      try {
        const current = await whois.whoisLookup(domain);
        const currentFlat: Record<string, unknown> = {
          registrant_name: current.registrant_name,
          registrant_org: current.registrant_org,
          registrant_email: current.registrant_email,
          registrar: current.registrar,
          name_servers: current.name_servers.join(", "),
          updated_date: current.updated_date,
        };

        const previous = domainStateCache.get(domain);
        const changes: Array<{
          field: string;
          old_value: string | null;
          new_value: string | null;
        }> = [];

        if (previous) {
          for (const [field, newVal] of Object.entries(currentFlat)) {
            const oldVal = previous[field];
            if (String(oldVal ?? "") !== String(newVal ?? "")) {
              changes.push({
                field,
                old_value: oldVal != null ? String(oldVal) : null,
                new_value: newVal != null ? String(newVal) : null,
              });
            }
          }
        }

        // Store current state for next comparison
        domainStateCache.set(domain, currentFlat);

        results.push({
          domain,
          changes,
          ...(previous
            ? {}
            : { error: undefined }),
        });

        if (!previous) {
          results[results.length - 1]!.changes = [];
          // Tag it so the caller knows this was a first check
          (results[results.length - 1] as Record<string, unknown>).first_check = true;
        }
      } catch (error) {
        results.push({
          domain,
          changes: [],
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              monitored: domains.length,
              results,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// =========================================================================
// Tool 4: detect_industry
// =========================================================================

server.tool(
  "detect_industry",
  "Detect the likely business industry for a domain using domain name keywords, TLD analysis, and homepage content scraping.",
  {
    domain: z.string().describe("Domain to analyze (e.g. 'smithdental.com')"),
  },
  async ({ domain }) => {
    try {
      const result = await industryDetector.detect(domain);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error detecting industry for ${domain}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// =========================================================================
// Tool 5: search_new_businesses (the money maker)
// =========================================================================

server.tool(
  "search_new_businesses",
  "HIGH-LEVEL: Find new businesses by industry. Combines new domain registration search + industry detection + WHOIS enrichment. The main tool for lead generation — finds businesses 30-90 days before they appear on Google Maps.",
  {
    industry: z
      .string()
      .describe(
        "Industry to search for (e.g. 'dental', 'hvac', 'law', 'plumbing', 'real_estate', 'restaurant')"
      ),
    region: z
      .string()
      .optional()
      .describe(
        "Filter by registrant region/country (e.g. 'US', 'United States', 'Alabama'). Checked against WHOIS registrant country/state."
      ),
    days_back: z
      .number()
      .optional()
      .describe("How many days back to search (default: 7, max: 30)"),
    limit: z
      .number()
      .optional()
      .describe("Max results to return (default: 20)"),
  },
  async ({ industry, region, days_back, limit }) => {
    try {
      const maxResults = limit ?? 20;
      const days = Math.min(days_back ?? 7, 30);

      // Step 1: Get industry keywords
      const keywords = getIndustryKeywords(industry).slice(0, 5); // API limits keywords

      // Step 2: Find new registrations
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - days);
      const sinceDateStr = sinceDate.toISOString().split("T")[0]!;

      const newDomains = await whois.findNewRegistrations(keywords, {
        sinceDate: sinceDateStr,
        limit: maxResults * 3, // Fetch extra since we'll filter
      });

      if (newDomains.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  industry,
                  keywords_used: keywords,
                  since_date: sinceDateStr,
                  count: 0,
                  businesses: [],
                  message: "No new domain registrations found for these keywords in the time period.",
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Step 3: Enrich each with WHOIS + industry detection
      const enriched: Array<{
        domain: string;
        registration_date: string;
        registrant_name: string | null;
        registrant_email: string | null;
        registrant_org: string | null;
        likely_industry: string | null;
        registrant_location: string | null;
      }> = [];

      for (const entry of newDomains) {
        if (enriched.length >= maxResults) break;

        try {
          // WHOIS lookup for registrant info
          const whoisData = await whois.whoisLookup(entry.domain);

          // Region filter
          if (region) {
            const regionLower = region.toLowerCase();
            const country = (whoisData.registrant_country ?? "").toLowerCase();
            const state = (whoisData.registrant_state ?? "").toLowerCase();
            const city = (whoisData.registrant_city ?? "").toLowerCase();

            if (
              !country.includes(regionLower) &&
              !state.includes(regionLower) &&
              !city.includes(regionLower) &&
              !regionLower.includes(country) &&
              !regionLower.includes(state)
            ) {
              continue; // Skip -- does not match region
            }
          }

          // Industry detection (quick: domain-only, skip homepage scrape for speed)
          const industryResult = await industryDetector.detect(entry.domain);

          const location = [
            whoisData.registrant_city,
            whoisData.registrant_state,
            whoisData.registrant_country,
          ]
            .filter(Boolean)
            .join(", ") || null;

          enriched.push({
            domain: entry.domain,
            registration_date: whoisData.creation_date ?? entry.registration_date,
            registrant_name: whoisData.registrant_name,
            registrant_email: whoisData.registrant_email,
            registrant_org: whoisData.registrant_org,
            likely_industry: industryResult.likely_industry,
            registrant_location: location,
          });
        } catch {
          // Partial failure: skip this domain, continue with others
          continue;
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                industry,
                keywords_used: keywords,
                since_date: sinceDateStr,
                region: region ?? "all",
                count: enriched.length,
                businesses: enriched,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error searching new businesses: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// =========================================================================
// Tool 6: domain_tech_check
// =========================================================================

server.tool(
  "domain_tech_check",
  "Detect technologies used by a domain's website. Checks for CMS, ecommerce, analytics, frameworks, and hosting via HTML pattern analysis.",
  {
    domain: z.string().describe("Domain to check (e.g. 'example.com')"),
  },
  async ({ domain }) => {
    try {
      const result = await techDetector.detect(domain);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error checking tech stack for ${domain}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// =========================================================================
// Tool 7: track_expirations
// =========================================================================

server.tool(
  "track_expirations",
  "Check WHOIS expiration dates for a list of domains. Useful for finding expiring competitor domains or acquisition opportunities.",
  {
    domains: z
      .array(z.string())
      .describe("Domains to check expiration dates for"),
  },
  async ({ domains }) => {
    const results: Array<{
      domain: string;
      expiration_date: string | null;
      days_until_expiry: number | null;
      auto_renew: boolean | null;
      error?: string;
    }> = [];

    for (const domain of domains) {
      try {
        const whoisData = await whois.whoisLookup(domain);

        let daysUntilExpiry: number | null = null;
        if (whoisData.expiration_date) {
          const expDate = new Date(whoisData.expiration_date);
          const now = new Date();
          daysUntilExpiry = Math.ceil(
            (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        // Auto-renew detection: check registrar status or name servers
        // This is heuristic -- most registrars don't expose this in WHOIS
        let autoRenew: boolean | null = null;
        if (whoisData.name_servers.length > 0) {
          // If name servers are set and domain is not expired, likely auto-renew
          autoRenew = daysUntilExpiry !== null && daysUntilExpiry > 0 ? true : null;
        }

        results.push({
          domain,
          expiration_date: whoisData.expiration_date,
          days_until_expiry: daysUntilExpiry,
          auto_renew: autoRenew,
        });
      } catch (error) {
        results.push({
          domain,
          expiration_date: null,
          days_until_expiry: null,
          auto_renew: null,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              checked: domains.length,
              results,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mcp-domain-radar server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
