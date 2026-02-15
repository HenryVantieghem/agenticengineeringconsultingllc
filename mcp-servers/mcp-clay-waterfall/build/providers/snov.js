/**
 * Snov.io provider
 *
 * Auth: OAuth client_credentials flow — uses SNOV_USER_ID + SNOV_API_KEY
 * to obtain a short-lived access token, which is then used for all calls.
 *
 * Endpoints used:
 * - Token:              POST /v1/oauth/access_token
 * - Email Finder:       POST /v1/get-emails-from-names
 * - Domain Search:      POST /v2/get-emails-from-domain
 * - Email Verifier:     POST /v1/get-emails-verification-status
 *
 * Docs: https://snov.io/knowledgebase/category/api/
 */
import { fetchWithRetry, log } from "../waterfall.js";
const BASE = "https://api.snov.io";
export class SnovProvider {
    name = "snov.io";
    userId;
    apiKey;
    accessToken = null;
    tokenExpiry = 0;
    constructor() {
        this.userId = process.env.SNOV_USER_ID;
        this.apiKey = process.env.SNOV_API_KEY;
    }
    isConfigured() {
        return !!this.userId && !!this.apiKey;
    }
    // -----------------------------------------------------------------------
    // Auth
    // -----------------------------------------------------------------------
    async getToken() {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }
        const res = await fetchWithRetry(`${BASE}/v1/oauth/access_token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "client_credentials",
                client_id: this.userId,
                client_secret: this.apiKey,
            }),
        });
        if (!res.ok) {
            throw new Error(`Snov token request failed: HTTP ${res.status}`);
        }
        const json = (await res.json());
        if (!json.access_token)
            throw new Error("Snov token response missing access_token");
        this.accessToken = json.access_token;
        // Expire 60s early to be safe
        this.tokenExpiry = Date.now() + ((json.expires_in ?? 3600) - 60) * 1000;
        return this.accessToken;
    }
    async post(path, body) {
        const token = await this.getToken();
        const res = await fetchWithRetry(`${BASE}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            log("warn", `Snov ${path} HTTP ${res.status}`);
            return null;
        }
        return res.json();
    }
    // -----------------------------------------------------------------------
    // findEmail
    // -----------------------------------------------------------------------
    async findEmail(name, domain) {
        const [firstName, ...rest] = name.trim().split(/\s+/);
        const lastName = rest.join(" ");
        const json = (await this.post("/v1/get-emails-from-names", {
            firstName,
            lastName,
            domain,
        }));
        if (!json?.data?.emails?.length)
            return null;
        const best = json.data.emails[0];
        if (!best.email)
            return null;
        return {
            email: best.email,
            verified: best.emailStatus === "valid",
            confidence: best.emailStatus === "valid" ? 90 : 60,
        };
    }
    // -----------------------------------------------------------------------
    // findPhone (Snov doesn't have a dedicated phone endpoint — returns null)
    // -----------------------------------------------------------------------
    async findPhone(_name, _company) {
        return null;
    }
    // -----------------------------------------------------------------------
    // enrichPerson
    // -----------------------------------------------------------------------
    async enrichPerson(identifier) {
        if (!identifier.email)
            return null;
        const json = (await this.post("/v1/get-profile-by-email", {
            email: identifier.email,
        }));
        if (!json?.data)
            return null;
        const d = json.data;
        const currentJob = d.currentJob?.[0];
        const linkedin = d.social?.find((s) => s.type === "linkedin");
        return {
            name: d.name ?? ([d.firstName, d.lastName].filter(Boolean).join(" ") || null),
            email: identifier.email,
            phone: null,
            title: currentJob?.position ?? null,
            linkedin_url: linkedin?.link ?? null,
            company: currentJob?.companyName ?? identifier.company ?? null,
            location: [d.locality, d.country].filter(Boolean).join(", ") || null,
        };
    }
    // -----------------------------------------------------------------------
    // findDecisionMakers (via domain email search)
    // -----------------------------------------------------------------------
    async findDecisionMakers(_company, domain, titles) {
        const json = (await this.post("/v2/get-emails-from-domain", {
            domain,
            type: "all",
            limit: 20,
        }));
        if (!json?.data?.length)
            return [];
        const titleLower = titles.map((t) => t.toLowerCase());
        return json.data
            .filter((e) => {
            if (!e.position)
                return false;
            const pos = e.position.toLowerCase();
            return titleLower.some((t) => pos.includes(t));
        })
            .map((e) => ({
            name: [e.firstName, e.lastName].filter(Boolean).join(" "),
            title: e.position ?? "",
            email: e.email ?? null,
            linkedin_url: null,
            confidence: 70,
        }));
    }
}
//# sourceMappingURL=snov.js.map