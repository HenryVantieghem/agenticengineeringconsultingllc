/**
 * Industry detection from domain names and homepage content.
 *
 * Uses three signals:
 * 1. Domain name keyword matching against known industry terms
 * 2. TLD analysis (.dental, .law, .consulting, etc.)
 * 3. Homepage meta description / title scraping
 */
export interface IndustryDetectionResult {
    domain: string;
    likely_industry: string | null;
    confidence: number;
    signals: string[];
}
export declare class IndustryDetector {
    /**
     * Detect the likely industry for a domain using all available signals.
     */
    detect(domain: string): Promise<IndustryDetectionResult>;
    private matchDomainKeywords;
    private matchTLD;
    private scrapeHomepage;
}
/**
 * Returns domain search keywords for a given industry name.
 * Falls back to the industry name itself if not found.
 */
export declare function getIndustryKeywords(industry: string): string[];
//# sourceMappingURL=industry-detector.d.ts.map