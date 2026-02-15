/**
 * RocketReach provider
 *
 * Endpoints used:
 * - Lookup Profile: POST /v2/api/lookupProfile
 * - Search:         POST /v2/api/search
 *
 * Docs: https://rocketreach.co/api/docs/
 */
import { fetchWithRetry, log } from "../waterfall.js";
const BASE = "https://api.rocketreach.co";
export class RocketReachProvider {
    name = "rocketreach";
    apiKey;
    constructor() {
        this.apiKey = process.env.ROCKETREACH_API_KEY;
    }
    isConfigured() {
        return !!this.apiKey;
    }
    headers() {
        return {
            "Content-Type": "application/json",
            "Api-Key": this.apiKey,
        };
    }
    // -----------------------------------------------------------------------
    // findEmail (lookupProfile)
    // -----------------------------------------------------------------------
    async findEmail(name, domain) {
        const res = await fetchWithRetry(`${BASE}/v2/api/lookupProfile`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                name,
                current_employer: domain,
            }),
        });
        if (!res.ok) {
            log("warn", `RocketReach lookupProfile HTTP ${res.status}`);
            return null;
        }
        const json = (await res.json());
        if (!json.emails?.length)
            return null;
        // Find first valid email
        const valid = json.emails.find((e) => e.smtp_valid === "valid");
        const best = valid ?? json.emails[0];
        if (!best.email)
            return null;
        return {
            email: best.email,
            verified: best.smtp_valid === "valid",
            confidence: best.smtp_valid === "valid" ? 90 : 50,
        };
    }
    // -----------------------------------------------------------------------
    // findPhone (lookupProfile)
    // -----------------------------------------------------------------------
    async findPhone(name, company) {
        const res = await fetchWithRetry(`${BASE}/v2/api/lookupProfile`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                name,
                current_employer: company,
            }),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        if (!json.phones?.length)
            return null;
        const mobile = json.phones.find((p) => p.type === "mobile");
        const direct = json.phones.find((p) => p.type === "direct");
        const best = mobile ?? direct ?? json.phones[0];
        if (!best.number)
            return null;
        let phoneType = "office";
        if (best.type === "mobile")
            phoneType = "mobile";
        else if (best.type === "direct")
            phoneType = "direct";
        return {
            phone: best.number,
            type: phoneType,
        };
    }
    // -----------------------------------------------------------------------
    // enrichPerson (lookupProfile)
    // -----------------------------------------------------------------------
    async enrichPerson(identifier) {
        const body = {};
        if (identifier.email) {
            body.email = identifier.email;
        }
        else if (identifier.name) {
            body.name = identifier.name;
            if (identifier.company)
                body.current_employer = identifier.company;
        }
        else {
            return null;
        }
        const res = await fetchWithRetry(`${BASE}/v2/api/lookupProfile`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify(body),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        if (!json.name)
            return null;
        const validEmail = json.emails?.find((e) => e.smtp_valid === "valid");
        return {
            name: json.name,
            email: validEmail?.email ?? json.emails?.[0]?.email ?? identifier.email ?? null,
            phone: json.phones?.[0]?.number ?? null,
            title: json.current_title ?? null,
            linkedin_url: json.linkedin_url ?? null,
            company: json.current_employer ?? identifier.company ?? null,
            location: [json.city, json.region, json.country].filter(Boolean).join(", ") || null,
        };
    }
    // -----------------------------------------------------------------------
    // findDecisionMakers (search)
    // -----------------------------------------------------------------------
    async findDecisionMakers(company, _domain, titles) {
        const res = await fetchWithRetry(`${BASE}/v2/api/search`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                query: {
                    current_employer: [company],
                    current_title: titles,
                },
                page_size: 20,
            }),
        });
        if (!res.ok)
            return [];
        const json = (await res.json());
        if (!json.profiles?.length)
            return [];
        return json.profiles.map((p) => {
            const validEmail = p.emails?.find((e) => e.smtp_valid === "valid");
            return {
                name: p.name ?? "",
                title: p.current_title ?? "",
                email: validEmail?.email ?? p.emails?.[0]?.email ?? null,
                linkedin_url: p.linkedin_url ?? null,
                confidence: validEmail ? 90 : p.emails?.length ? 60 : 30,
            };
        });
    }
}
//# sourceMappingURL=rocketreach.js.map