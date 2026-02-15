/**
 * Simple technology detection via HTML analysis.
 *
 * Fetches a domain's homepage and checks for known script/meta/link
 * patterns to identify CMS, frameworks, analytics, and ecommerce platforms.
 *
 * This is a lightweight Wappalyzer-style approach -- no external API needed.
 */
export interface TechDetectionResult {
    domain: string;
    technologies: string[];
    cms: string | null;
    ecommerce: string | null;
    analytics: string[];
}
export declare class TechDetector {
    /**
     * Fetch homepage and detect technologies from HTML content.
     */
    detect(domain: string): Promise<TechDetectionResult>;
}
//# sourceMappingURL=tech-detector.d.ts.map