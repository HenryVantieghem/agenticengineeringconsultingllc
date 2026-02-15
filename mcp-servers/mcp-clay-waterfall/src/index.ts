#!/usr/bin/env node
/**
 * mcp-clay-waterfall — Waterfall Enrichment MCP Server
 *
 * Replicates Clay.com's waterfall enrichment model: cascades across
 * multiple data providers (Hunter, Snov, Apollo, Prospeo, RocketReach,
 * Lusha, PeopleDataLabs) to find verified contact data.
 *
 * Transport: stdio (standard MCP pattern)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { waterfall, log, sleep } from "./waterfall.js";
import {
  emailProviders,
  phoneProviders,
  personProviders,
  companyProviders,
  decisionMakerProviders,
  verificationProviders,
  allProviders,
} from "./providers/index.js";
import type {
  EmailResult,
  PhoneResult,
  PersonResult,
  CompanyResult,
  DecisionMakerResult,
  EmailVerificationResult,
} from "./types.js";

// ---------------------------------------------------------------------------
// Server init
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "mcp-clay-waterfall",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool 1: waterfall_find_email
// ---------------------------------------------------------------------------

server.tool(
  "waterfall_find_email",
  "Find a person's email address by cascading through multiple data providers (Hunter, Snov, Apollo, Prospeo, RocketReach, PDL). Returns the first verified email found.",
  {
    name: z.string().describe("Full name of the person (e.g. 'John Smith')"),
    domain: z.string().describe("Company domain (e.g. 'acme.com')"),
    company: z.string().optional().describe("Company name (optional, improves accuracy)"),
  },
  async ({ name, domain }) => {
    log("info", "waterfall_find_email", { name, domain });

    const hit = await waterfall<EmailResult>(emailProviders, (provider) =>
      provider.findEmail!(name, domain),
    );

    if (!hit) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: false,
                message: `No email found for ${name} at ${domain} across ${emailProviders.length} providers`,
                providers_tried: emailProviders
                  .filter((p) => p.isConfigured())
                  .map((p) => p.name),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: true,
              email: hit.result.email,
              verified: hit.result.verified,
              confidence: hit.result.confidence,
              provider: hit.provider,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 2: waterfall_find_phone
// ---------------------------------------------------------------------------

server.tool(
  "waterfall_find_phone",
  "Find a person's phone number by cascading through Lusha, Apollo, RocketReach, Snov, and PDL. Prefers mobile numbers.",
  {
    name: z.string().describe("Full name of the person"),
    company: z.string().describe("Company name"),
    domain: z.string().optional().describe("Company domain (optional)"),
  },
  async ({ name, company }) => {
    log("info", "waterfall_find_phone", { name, company });

    const hit = await waterfall<PhoneResult>(phoneProviders, (provider) =>
      provider.findPhone ? provider.findPhone(name, company) : Promise.resolve(null),
    );

    if (!hit) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: false,
                message: `No phone found for ${name} at ${company}`,
                providers_tried: phoneProviders
                  .filter((p) => p.isConfigured())
                  .map((p) => p.name),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: true,
              phone: hit.result.phone,
              type: hit.result.type,
              provider: hit.provider,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 3: enrich_company
// ---------------------------------------------------------------------------

server.tool(
  "enrich_company",
  "Enrich a company by domain — calls multiple providers in PARALLEL for comprehensive data (name, industry, employee count, revenue, tech stack, email pattern, social links).",
  {
    domain: z.string().describe("Company domain (e.g. 'acme.com')"),
  },
  async ({ domain }) => {
    log("info", "enrich_company", { domain });

    // Run all configured company providers in parallel, merge results
    const configured = companyProviders.filter(
      (p) => p.isConfigured() && p.enrichCompany,
    );

    const results = await Promise.allSettled(
      configured.map(async (provider) => {
        try {
          const result = await provider.enrichCompany!(domain);
          return result ? { result, provider: provider.name } : null;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log("error", `enrich_company error from ${provider.name}: ${msg}`);
          return null;
        }
      }),
    );

    // Merge results: first non-null value wins for each field
    const merged: CompanyResult = {
      name: null,
      domain,
      industry: null,
      employee_count: null,
      revenue_range: null,
      tech_stack: [],
      email_pattern: null,
      social_links: {},
    };

    const sources: string[] = [];

    for (const settled of results) {
      if (settled.status !== "fulfilled" || !settled.value) continue;
      const { result, provider } = settled.value;
      sources.push(provider);

      if (!merged.name && result.name) merged.name = result.name;
      if (!merged.industry && result.industry) merged.industry = result.industry;
      if (!merged.employee_count && result.employee_count)
        merged.employee_count = result.employee_count;
      if (!merged.revenue_range && result.revenue_range)
        merged.revenue_range = result.revenue_range;
      if (!merged.email_pattern && result.email_pattern)
        merged.email_pattern = result.email_pattern;

      // Merge tech stack (dedupe)
      if (result.tech_stack.length) {
        const existing = new Set(merged.tech_stack);
        for (const t of result.tech_stack) {
          if (!existing.has(t)) {
            merged.tech_stack.push(t);
            existing.add(t);
          }
        }
      }

      // Merge social links
      for (const [key, val] of Object.entries(result.social_links)) {
        if (!merged.social_links[key]) merged.social_links[key] = val;
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: sources.length > 0,
              ...merged,
              sources,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 4: enrich_person
// ---------------------------------------------------------------------------

server.tool(
  "enrich_person",
  "Enrich a person by email or name+company — cascades through Apollo, PDL, RocketReach, Prospeo, Snov, Hunter to find full profile (name, email, phone, title, LinkedIn, company, location).",
  {
    email: z.string().optional().describe("Email address to look up"),
    name: z.string().optional().describe("Full name (required if no email)"),
    company: z.string().optional().describe("Company name (improves accuracy)"),
  },
  async ({ email, name, company }) => {
    if (!email && !name) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: false,
              message: "Either 'email' or 'name' is required",
            }),
          },
        ],
      };
    }

    log("info", "enrich_person", { email, name, company });

    const identifier = { email, name, company };
    const hit = await waterfall<PersonResult>(personProviders, (provider) =>
      provider.enrichPerson
        ? provider.enrichPerson(identifier)
        : Promise.resolve(null),
    );

    if (!hit) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: false,
                message: `No enrichment data found for ${name ?? email}`,
                providers_tried: personProviders
                  .filter((p) => p.isConfigured())
                  .map((p) => p.name),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: true,
              ...hit.result,
              provider: hit.provider,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 5: find_decision_makers
// ---------------------------------------------------------------------------

server.tool(
  "find_decision_makers",
  "Find decision-makers at a company by title — searches Apollo, Hunter, RocketReach, PDL, and Snov for people matching the given titles.",
  {
    company: z.string().describe("Company name"),
    domain: z.string().describe("Company domain"),
    titles: z.array(z.string()).describe("Job titles to search for (e.g. ['CEO', 'CTO', 'VP Marketing'])"),
  },
  async ({ company, domain, titles }) => {
    log("info", "find_decision_makers", { company, domain, titles });

    // Try providers in order, return first non-empty result
    const hit = await waterfall<DecisionMakerResult[]>(
      decisionMakerProviders,
      async (provider) => {
        if (!provider.findDecisionMakers) return null;
        const results = await provider.findDecisionMakers(company, domain, titles);
        return results.length > 0 ? results : null;
      },
    );

    if (!hit) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: false,
                message: `No decision-makers found at ${company} (${domain}) for titles: ${titles.join(", ")}`,
                providers_tried: decisionMakerProviders
                  .filter((p) => p.isConfigured())
                  .map((p) => p.name),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: true,
              count: hit.result.length,
              decision_makers: hit.result,
              provider: hit.provider,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 6: verify_email
// ---------------------------------------------------------------------------

server.tool(
  "verify_email",
  "Verify an email address using Hunter.io's verification endpoint. Returns validity status and deliverability score.",
  {
    email: z.string().describe("Email address to verify"),
  },
  async ({ email }) => {
    log("info", "verify_email", { email });

    const hit = await waterfall<EmailVerificationResult>(
      verificationProviders,
      (provider) =>
        provider.verifyEmail
          ? provider.verifyEmail(email)
          : Promise.resolve(null),
    );

    if (!hit) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: false,
              message: `Could not verify ${email} — no verification providers configured`,
            }),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: true,
              email: hit.result.email,
              status: hit.result.status,
              score: hit.result.score,
              provider: hit.provider,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 7: bulk_enrich
// ---------------------------------------------------------------------------

server.tool(
  "bulk_enrich",
  "Bulk enrich a list of contacts — runs waterfall email finder + person enrichment for each contact. Rate-limited at 500ms between lookups to avoid API throttling.",
  {
    contacts: z
      .array(
        z.object({
          name: z.string().describe("Full name"),
          company: z.string().describe("Company name"),
          domain: z.string().optional().describe("Company domain"),
        }),
      )
      .describe("Array of contacts to enrich"),
  },
  async ({ contacts }) => {
    log("info", "bulk_enrich", { count: contacts.length });

    const results: Array<{
      input: { name: string; company: string; domain?: string };
      email: string | null;
      email_provider: string | null;
      person: PersonResult | null;
      person_provider: string | null;
    }> = [];

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const domain = contact.domain ?? contact.company.toLowerCase().replace(/\s+/g, "") + ".com";

      // Rate limit: 500ms between calls
      if (i > 0) {
        await sleep(500);
      }

      // Step 1: Find email
      let emailResult: string | null = null;
      let emailProvider: string | null = null;

      const emailHit = await waterfall<EmailResult>(emailProviders, (provider) =>
        provider.findEmail!(contact.name, domain),
      );

      if (emailHit) {
        emailResult = emailHit.result.email;
        emailProvider = emailHit.provider;
      }

      // Step 2: Enrich person
      let personResult: PersonResult | null = null;
      let personProvider: string | null = null;

      const identifier = {
        email: emailResult ?? undefined,
        name: contact.name,
        company: contact.company,
      };

      const personHit = await waterfall<PersonResult>(personProviders, (provider) =>
        provider.enrichPerson
          ? provider.enrichPerson(identifier)
          : Promise.resolve(null),
      );

      if (personHit) {
        personResult = personHit.result;
        personProvider = personHit.provider;
      }

      results.push({
        input: contact,
        email: emailResult,
        email_provider: emailProvider,
        person: personResult,
        person_provider: personProvider,
      });

      log("info", `bulk_enrich progress: ${i + 1}/${contacts.length}`, {
        name: contact.name,
        email_found: !!emailResult,
      });
    }

    const found = results.filter((r) => r.email !== null).length;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: true,
              total: contacts.length,
              emails_found: found,
              hit_rate: `${Math.round((found / contacts.length) * 100)}%`,
              results,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Log configured providers on startup
  const configured = allProviders.filter((p) => p.isConfigured());
  const unconfigured = allProviders.filter((p) => !p.isConfigured());

  log("info", "mcp-clay-waterfall starting", {
    configured: configured.map((p) => p.name),
    unconfigured: unconfigured.map((p) => p.name),
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log("info", "mcp-clay-waterfall connected via stdio");
}

main().catch((err) => {
  log("error", "Fatal error", { error: String(err) });
  process.exit(1);
});
