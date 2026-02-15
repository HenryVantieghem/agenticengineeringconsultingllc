/**
 * Industry detection from domain names and homepage content.
 *
 * Uses three signals:
 * 1. Domain name keyword matching against known industry terms
 * 2. TLD analysis (.dental, .law, .consulting, etc.)
 * 3. Homepage meta description / title scraping
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IndustryDetectionResult {
  domain: string;
  likely_industry: string | null;
  confidence: number; // 0-100
  signals: string[];
}

// ---------------------------------------------------------------------------
// Industry keyword maps
// ---------------------------------------------------------------------------

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  dental: [
    "dental", "dentist", "orthodont", "endodont", "periodon", "prosthodont",
    "oral", "tooth", "teeth", "smile", "braces", "implant",
  ],
  law: [
    "law", "legal", "attorney", "lawyer", "firm", "counsel", "litigation",
    "injury", "defense", "advocate", "esquire", "barrist",
  ],
  hvac: [
    "hvac", "heating", "cooling", "airconditioning", "furnace", "duct",
    "climate", "ventilat", "thermostat", "ac-repair",
  ],
  plumbing: [
    "plumb", "plumber", "drain", "sewer", "pipe", "faucet", "waterheater",
  ],
  real_estate: [
    "realty", "realtor", "realestate", "property", "homes", "housing",
    "mortgage", "broker", "listing", "mls",
  ],
  medical: [
    "medical", "health", "clinic", "doctor", "physician", "hospital",
    "surgery", "surgical", "wellness", "medspa", "dermatol", "cardio",
    "pediatr", "oncol", "ortho", "neurol", "urgent-care",
  ],
  veterinary: [
    "vet", "veterinar", "animal", "pet", "paws", "pawprint",
  ],
  auto_repair: [
    "auto", "automotive", "mechanic", "carrepair", "autorepair", "tire",
    "brakes", "collision", "bodyshop", "oilchange", "transmission",
  ],
  property_management: [
    "property-management", "propertymanagement", "landlord", "tenant",
    "leasing", "apartment", "rental",
  ],
  restaurant: [
    "restaurant", "cafe", "bistro", "grill", "diner", "eatery", "pizza",
    "sushi", "taco", "burger", "kitchen", "catering",
  ],
  construction: [
    "construction", "builder", "contractor", "roofing", "remodel",
    "renovation", "framing", "concrete", "excavat",
  ],
  insurance: [
    "insurance", "insure", "coverage", "underwrite", "actuari", "claims",
  ],
  accounting: [
    "accounting", "accountant", "cpa", "bookkeep", "tax", "audit", "payroll",
  ],
  marketing: [
    "marketing", "agency", "digital", "seo", "ads", "creative", "brand",
    "media", "social-media",
  ],
  fitness: [
    "fitness", "gym", "crossfit", "yoga", "pilates", "personal-training",
    "workout",
  ],
  salon: [
    "salon", "barbershop", "barber", "hair", "beauty", "spa", "nails",
    "estheti", "cosmet",
  ],
};

const TLD_INDUSTRY: Record<string, string> = {
  dental: "dental",
  law: "law",
  legal: "law",
  attorney: "law",
  lawyer: "law",
  consulting: "consulting",
  clinic: "medical",
  health: "medical",
  vet: "veterinary",
  salon: "salon",
  fitness: "fitness",
  restaurant: "restaurant",
  cafe: "restaurant",
  insurance: "insurance",
  realty: "real_estate",
  property: "property_management",
  repair: "auto_repair",
  plumbing: "plumbing",
  construction: "construction",
  accountant: "accounting",
  tax: "accounting",
};

// ---------------------------------------------------------------------------
// Detector class
// ---------------------------------------------------------------------------

export class IndustryDetector {
  /**
   * Detect the likely industry for a domain using all available signals.
   */
  async detect(domain: string): Promise<IndustryDetectionResult> {
    const signals: string[] = [];
    const scores: Record<string, number> = {};

    // Signal 1: Domain name keyword matching
    this.matchDomainKeywords(domain, scores, signals);

    // Signal 2: TLD analysis
    this.matchTLD(domain, scores, signals);

    // Signal 3: Homepage scrape (best-effort)
    try {
      await this.scrapeHomepage(domain, scores, signals);
    } catch {
      signals.push("homepage_scrape: failed (domain may not be live yet)");
    }

    // Pick the top-scoring industry
    let bestIndustry: string | null = null;
    let bestScore = 0;
    for (const [industry, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestIndustry = industry;
        bestScore = score;
      }
    }

    // Confidence: normalize score to 0-100 range
    // Domain keyword match = 30pts, TLD = 40pts, homepage = 30pts
    const confidence = Math.min(100, bestScore);

    return {
      domain,
      likely_industry: bestIndustry,
      confidence,
      signals,
    };
  }

  // -------------------------------------------------------------------------
  // Signal 1: Domain keyword matching
  // -------------------------------------------------------------------------

  private matchDomainKeywords(
    domain: string,
    scores: Record<string, number>,
    signals: string[]
  ): void {
    // Strip TLD for matching
    const domainName = domain.split(".")[0]?.toLowerCase() ?? "";

    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
      for (const kw of keywords) {
        if (domainName.includes(kw)) {
          scores[industry] = (scores[industry] ?? 0) + 30;
          signals.push(`domain_keyword: "${kw}" matches ${industry}`);
          return; // One match per signal type is enough
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Signal 2: TLD analysis
  // -------------------------------------------------------------------------

  private matchTLD(
    domain: string,
    scores: Record<string, number>,
    signals: string[]
  ): void {
    const parts = domain.split(".");
    const tld = parts[parts.length - 1]?.toLowerCase() ?? "";

    const industry = TLD_INDUSTRY[tld];
    if (industry) {
      scores[industry] = (scores[industry] ?? 0) + 40;
      signals.push(`tld: .${tld} -> ${industry}`);
    }
  }

  // -------------------------------------------------------------------------
  // Signal 3: Homepage scrape
  // -------------------------------------------------------------------------

  private async scrapeHomepage(
    domain: string,
    scores: Record<string, number>,
    signals: string[]
  ): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`https://${domain}`, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DomainRadar/1.0)",
        },
      });

      if (!res.ok) return;

      const html = await res.text();
      const lowerHtml = html.toLowerCase();

      // Extract title
      const titleMatch = lowerHtml.match(/<title[^>]*>(.*?)<\/title>/);
      const title = titleMatch?.[1] ?? "";

      // Extract meta description
      const descMatch = lowerHtml.match(
        /<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/
      );
      const description = descMatch?.[1] ?? "";

      const combined = `${title} ${description}`.toLowerCase();

      if (combined.length < 5) {
        signals.push("homepage_scrape: no meaningful content found");
        return;
      }

      for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
        for (const kw of keywords) {
          if (combined.includes(kw)) {
            scores[industry] = (scores[industry] ?? 0) + 30;
            signals.push(
              `homepage_content: "${kw}" found in title/description -> ${industry}`
            );
            return; // One match is enough for this signal
          }
        }
      }

      signals.push("homepage_scrape: no industry keywords found in title/description");
    } finally {
      clearTimeout(timeout);
    }
  }
}

// ---------------------------------------------------------------------------
// Industry keywords export (for search_new_businesses tool)
// ---------------------------------------------------------------------------

/**
 * Returns domain search keywords for a given industry name.
 * Falls back to the industry name itself if not found.
 */
export function getIndustryKeywords(industry: string): string[] {
  const normalized = industry.toLowerCase().replace(/[\s-]+/g, "_");

  // Check direct match
  if (INDUSTRY_KEYWORDS[normalized]) {
    return INDUSTRY_KEYWORDS[normalized]!;
  }

  // Check partial match
  for (const [key, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return keywords;
    }
  }

  // Fallback: use the industry name itself
  return [industry.toLowerCase().replace(/\s+/g, "")];
}
