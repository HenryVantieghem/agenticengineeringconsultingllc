/**
 * People Data Labs (PDL) provider — bonus enrichment source
 *
 * Endpoints used:
 * - Person Enrichment: GET /v5/person/enrich
 * - Company Enrichment: GET /v5/company/enrich
 *
 * Docs: https://docs.peopledatalabs.com/
 */
import { fetchWithRetry, log } from "../waterfall.js";
const BASE = "https://api.peopledatalabs.com/v5";
export class PDLProvider {
    name = "peopledatalabs";
    apiKey;
    constructor() {
        this.apiKey = process.env.PDL_API_KEY;
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
    // findEmail (person/enrich by name + company)
    // -----------------------------------------------------------------------
    async findEmail(name, domain) {
        const params = new URLSearchParams({
            name,
            company: domain,
            pretty: "false",
        });
        const res = await fetchWithRetry(`${BASE}/person/enrich?${params}`, {
            headers: this.headers(),
        });
        if (!res.ok) {
            log("warn", `PDL person/enrich HTTP ${res.status}`);
            return null;
        }
        const json = (await res.json());
        if (json.status !== 200 || !json.data)
            return null;
        const email = json.data.work_email ?? json.data.emails?.[0]?.address;
        if (!email)
            return null;
        return {
            email,
            verified: true,
            confidence: 85,
        };
    }
    // -----------------------------------------------------------------------
    // findPhone
    // -----------------------------------------------------------------------
    async findPhone(name, company) {
        const params = new URLSearchParams({
            name,
            company,
            pretty: "false",
        });
        const res = await fetchWithRetry(`${BASE}/person/enrich?${params}`, {
            headers: this.headers(),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        if (json.status !== 200 || !json.data)
            return null;
        const phone = json.data.mobile_phone ?? json.data.phone_numbers?.[0];
        if (!phone)
            return null;
        return {
            phone,
            type: json.data.mobile_phone ? "mobile" : "direct",
        };
    }
    // -----------------------------------------------------------------------
    // enrichPerson
    // -----------------------------------------------------------------------
    async enrichPerson(identifier) {
        const params = new URLSearchParams({ pretty: "false" });
        if (identifier.email) {
            params.set("email", identifier.email);
        }
        else if (identifier.name) {
            params.set("name", identifier.name);
            if (identifier.company)
                params.set("company", identifier.company);
        }
        else {
            return null;
        }
        const res = await fetchWithRetry(`${BASE}/person/enrich?${params}`, {
            headers: this.headers(),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        if (json.status !== 200 || !json.data)
            return null;
        const d = json.data;
        return {
            name: d.full_name ?? identifier.name ?? null,
            email: d.work_email ?? d.personal_emails?.[0] ?? identifier.email ?? null,
            phone: d.mobile_phone ?? null,
            title: d.job_title ?? null,
            linkedin_url: d.linkedin_url ?? null,
            company: d.job_company_name ?? identifier.company ?? null,
            location: d.location_name ?? null,
        };
    }
    // -----------------------------------------------------------------------
    // enrichCompany
    // -----------------------------------------------------------------------
    async enrichCompany(domain) {
        const params = new URLSearchParams({
            website: domain,
            pretty: "false",
        });
        const res = await fetchWithRetry(`${BASE}/company/enrich?${params}`, {
            headers: this.headers(),
        });
        if (!res.ok)
            return null;
        const json = (await res.json());
        if (json.status !== 200 || !json.data)
            return null;
        const d = json.data;
        const socialLinks = {};
        if (d.linkedin_url)
            socialLinks.linkedin = d.linkedin_url;
        if (d.twitter_url)
            socialLinks.twitter = d.twitter_url;
        if (d.facebook_url)
            socialLinks.facebook = d.facebook_url;
        return {
            name: d.name ?? null,
            domain,
            industry: d.industry ?? null,
            employee_count: d.employee_count ?? null,
            revenue_range: d.estimated_annual_revenue ?? null,
            tech_stack: d.tags ?? [],
            email_pattern: null,
            social_links: socialLinks,
        };
    }
    // -----------------------------------------------------------------------
    // findDecisionMakers (PDL person/search)
    // -----------------------------------------------------------------------
    async findDecisionMakers(company, domain, titles) {
        // PDL uses SQL-like queries for person search
        const titleFilter = titles.map((t) => `job_title='${t}'`).join(" OR ");
        const query = `SELECT * FROM person WHERE job_company_website='${domain}' AND (${titleFilter})`;
        const res = await fetchWithRetry(`${BASE}/person/search`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
                sql: query,
                size: 20,
            }),
        });
        if (!res.ok)
            return [];
        const json = (await res.json());
        if (json.status !== 200 || !json.data?.length)
            return [];
        return json.data.map((p) => ({
            name: p.full_name ?? "",
            title: p.job_title ?? "",
            email: p.work_email ?? null,
            linkedin_url: p.linkedin_url ?? null,
            confidence: p.work_email ? 85 : 50,
        }));
    }
}
//# sourceMappingURL=pdl.js.map