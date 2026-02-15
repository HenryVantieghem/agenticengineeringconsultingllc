/**
 * Apollo.io provider
 *
 * Endpoints used:
 * - People Search:  POST /v1/mixed_people/search
 * - People Enrich:  POST /v1/people/match
 * - Org Enrich:     GET  /v1/organizations/enrich
 *
 * Docs: https://apolloio.github.io/apollo-api-docs/
 */
import { fetchWithRetry, log } from "../waterfall.js";
const BASE = "https://api.apollo.io";
export class ApolloProvider {
    name = "apollo.io";
    apiKey;
    constructor() {
        this.apiKey = process.env.APOLLO_API_KEY;
    }
    isConfigured() {
        return !!this.apiKey;
    }
    headers() {
        return {
            "Content-Type": "application/json",
            "X-Api-Key": this.apiKey,
        };
    }
    // -----------------------------------------------------------------------
    // findEmail (people/match)
    // -----------------------------------------------------------------------
    async findEmail(name, domain) {
        const [firstName, ...rest] = name.trim().split(/\s+/);
        const lastName = rest.join(" ");
        const res = await fetchWithRetry(`${BASE}/v1/people/match`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                organization_name: domain,
                domain,
            }),
        });
        if (!res.ok) {
            log("warn", `Apollo people/match HTTP ${res.status}`);
            return null;
        }
        const json = (await res.json());
        const email = json.person?.email;
        if (!email)
            return null;
        const status = json.person?.email_status;
        return {
            email,
            verified: status === "verified",
            confidence: status === "verified" ? 95 : status === "guessed" ? 60 : 40,
        };
    }
    // -----------------------------------------------------------------------
    // findPhone (people/match)
    // -----------------------------------------------------------------------
    async findPhone(name, company) {
        const [firstName, ...rest] = name.trim().split(/\s+/);
        const lastName = rest.join(" ");
        const res = await fetchWithRetry(`${BASE}/v1/people/match`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                organization_name: company,
            }),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        const phones = json.person?.phone_numbers;
        if (!phones?.length)
            return null;
        // Prefer mobile, then direct, then any
        const mobile = phones.find((p) => p.type === "mobile");
        const direct = phones.find((p) => p.type === "direct" || p.type === "work_direct");
        const best = mobile ?? direct ?? phones[0];
        if (!best.sanitized_number)
            return null;
        let phoneType = "office";
        if (best.type === "mobile")
            phoneType = "mobile";
        else if (best.type === "direct" || best.type === "work_direct")
            phoneType = "direct";
        return {
            phone: best.sanitized_number,
            type: phoneType,
        };
    }
    // -----------------------------------------------------------------------
    // enrichPerson
    // -----------------------------------------------------------------------
    async enrichPerson(identifier) {
        const body = {};
        if (identifier.email) {
            body.email = identifier.email;
        }
        else if (identifier.name && identifier.company) {
            const [firstName, ...rest] = identifier.name.trim().split(/\s+/);
            body.first_name = firstName;
            body.last_name = rest.join(" ");
            body.organization_name = identifier.company;
        }
        else {
            return null;
        }
        const res = await fetchWithRetry(`${BASE}/v1/people/match`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify(body),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        const p = json.person;
        if (!p)
            return null;
        return {
            name: [p.first_name, p.last_name].filter(Boolean).join(" ") || null,
            email: p.email ?? null,
            phone: p.phone_numbers?.[0]?.sanitized_number ?? null,
            title: p.title ?? null,
            linkedin_url: p.linkedin_url ?? null,
            company: p.organization?.name ?? identifier.company ?? null,
            location: [p.city, p.state, p.country].filter(Boolean).join(", ") || null,
        };
    }
    // -----------------------------------------------------------------------
    // enrichCompany
    // -----------------------------------------------------------------------
    async enrichCompany(domain) {
        const params = new URLSearchParams({ domain });
        const res = await fetchWithRetry(`${BASE}/v1/organizations/enrich?${params}`, {
            headers: this.headers(),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        const o = json.organization;
        if (!o)
            return null;
        const socialLinks = {};
        if (o.linkedin_url)
            socialLinks.linkedin = o.linkedin_url;
        if (o.twitter_url)
            socialLinks.twitter = o.twitter_url;
        if (o.facebook_url)
            socialLinks.facebook = o.facebook_url;
        return {
            name: o.name ?? null,
            domain,
            industry: o.industry ?? null,
            employee_count: o.estimated_num_employees ?? null,
            revenue_range: o.annual_revenue_printed ?? null,
            tech_stack: o.keywords ?? [],
            email_pattern: null,
            social_links: socialLinks,
        };
    }
    // -----------------------------------------------------------------------
    // findDecisionMakers (mixed_people/search)
    // -----------------------------------------------------------------------
    async findDecisionMakers(company, domain, titles) {
        const res = await fetchWithRetry(`${BASE}/v1/mixed_people/search`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                q_organization_domains: domain,
                person_titles: titles,
                page: 1,
                per_page: 20,
            }),
        });
        if (!res.ok)
            return [];
        const json = (await res.json());
        if (!json.people?.length)
            return [];
        return json.people.map((p) => ({
            name: [p.first_name, p.last_name].filter(Boolean).join(" "),
            title: p.title ?? "",
            email: p.email ?? null,
            linkedin_url: p.linkedin_url ?? null,
            confidence: p.email_status === "verified" ? 95 : p.email ? 70 : 30,
        }));
    }
}
//# sourceMappingURL=apollo.js.map