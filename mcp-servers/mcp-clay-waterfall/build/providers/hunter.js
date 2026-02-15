/**
 * Hunter.io provider
 *
 * Endpoints used:
 * - Email Finder:       GET /v2/email-finder
 * - Email Verifier:     GET /v2/email-verifier
 * - Domain Search:      GET /v2/domain-search
 * - Email Count:        GET /v2/email-count  (no auth needed)
 *
 * Docs: https://hunter.io/api-documentation/v2
 */
import { fetchWithRetry, log } from "../waterfall.js";
const BASE = "https://api.hunter.io/v2";
export class HunterProvider {
    name = "hunter.io";
    apiKey;
    constructor() {
        this.apiKey = process.env.HUNTER_API_KEY;
    }
    isConfigured() {
        return !!this.apiKey;
    }
    // -----------------------------------------------------------------------
    // findEmail
    // -----------------------------------------------------------------------
    async findEmail(name, domain) {
        const [firstName, ...rest] = name.trim().split(/\s+/);
        const lastName = rest.join(" ");
        const params = new URLSearchParams({
            domain,
            first_name: firstName,
            last_name: lastName,
            api_key: this.apiKey,
        });
        const res = await fetchWithRetry(`${BASE}/email-finder?${params}`);
        if (!res.ok) {
            log("warn", `Hunter email-finder HTTP ${res.status}`, { domain, name });
            return null;
        }
        const json = (await res.json());
        const email = json.data?.email;
        if (!email)
            return null;
        const score = json.data?.score ?? 0;
        const status = json.data?.verification?.status;
        return {
            email,
            verified: status === "valid",
            confidence: score,
        };
    }
    // -----------------------------------------------------------------------
    // enrichPerson (via domain-search, match by name)
    // -----------------------------------------------------------------------
    async enrichPerson(identifier) {
        // Hunter doesn't have a direct person enrichment endpoint.
        // If we have an email we can verify it, but for full enrichment
        // we do a domain search and match.
        if (!identifier.email && !identifier.name)
            return null;
        if (identifier.email) {
            // Verify the email and return minimal data
            const verification = await this.verifyEmail(identifier.email);
            if (!verification || verification.status === "invalid")
                return null;
            return {
                name: identifier.name ?? null,
                email: identifier.email,
                phone: null,
                title: null,
                linkedin_url: null,
                company: identifier.company ?? null,
                location: null,
            };
        }
        return null;
    }
    // -----------------------------------------------------------------------
    // enrichCompany (domain-search + email-count)
    // -----------------------------------------------------------------------
    async enrichCompany(domain) {
        // email-count is free (no API key needed but we send it anyway)
        const countParams = new URLSearchParams({
            domain,
            api_key: this.apiKey,
        });
        const countRes = await fetchWithRetry(`${BASE}/email-count?${countParams}`);
        let emailCount = null;
        let emailPattern = null;
        if (countRes.ok) {
            const countJson = (await countRes.json());
            emailCount = countJson.data?.total ?? null;
            emailPattern = countJson.data?.pattern ?? null;
        }
        // domain-search for org name
        const searchParams = new URLSearchParams({
            domain,
            api_key: this.apiKey,
            limit: "1",
        });
        const searchRes = await fetchWithRetry(`${BASE}/domain-search?${searchParams}`);
        let companyName = null;
        let industry = null;
        if (searchRes.ok) {
            const searchJson = (await searchRes.json());
            companyName = searchJson.data?.organization ?? null;
            industry = searchJson.data?.category?.name ?? null;
        }
        return {
            name: companyName,
            domain,
            industry,
            employee_count: null,
            revenue_range: null,
            tech_stack: [],
            email_pattern: emailPattern,
            social_links: {},
        };
    }
    // -----------------------------------------------------------------------
    // findDecisionMakers (via domain-search filtered by seniority)
    // -----------------------------------------------------------------------
    async findDecisionMakers(_company, domain, titles) {
        const params = new URLSearchParams({
            domain,
            api_key: this.apiKey,
            limit: "20",
            seniority: "senior,executive",
        });
        const res = await fetchWithRetry(`${BASE}/domain-search?${params}`);
        if (!res.ok)
            return [];
        const json = (await res.json());
        const emails = json.data?.emails ?? [];
        const titleLower = titles.map((t) => t.toLowerCase());
        return emails
            .filter((e) => {
            if (!e.position)
                return false;
            const pos = e.position.toLowerCase();
            return titleLower.some((t) => pos.includes(t));
        })
            .map((e) => ({
            name: [e.first_name, e.last_name].filter(Boolean).join(" "),
            title: e.position ?? "",
            email: e.value ?? null,
            linkedin_url: e.linkedin ?? null,
            confidence: e.confidence ?? 0,
        }));
    }
    // -----------------------------------------------------------------------
    // verifyEmail
    // -----------------------------------------------------------------------
    async verifyEmail(email) {
        const params = new URLSearchParams({
            email,
            api_key: this.apiKey,
        });
        const res = await fetchWithRetry(`${BASE}/email-verifier?${params}`);
        if (!res.ok) {
            log("warn", `Hunter email-verifier HTTP ${res.status}`, { email });
            return null;
        }
        const json = (await res.json());
        const status = json.data?.status;
        const score = json.data?.score ?? 0;
        let normalizedStatus;
        switch (status) {
            case "valid":
                normalizedStatus = "valid";
                break;
            case "invalid":
                normalizedStatus = "invalid";
                break;
            case "accept_all":
                normalizedStatus = "catch-all";
                break;
            default:
                normalizedStatus = "unknown";
        }
        return {
            email: json.data?.email ?? email,
            status: normalizedStatus,
            score,
        };
    }
}
//# sourceMappingURL=hunter.js.map