/**
 * SmtpVerifier — $0 email verification via DNS MX + SMTP handshake.
 *
 * No API key needed. Uses only Node.js built-in modules (dns, net).
 *
 * Flow:
 * 1. DNS MX lookup — does the domain accept email at all?
 * 2. SMTP RCPT TO — connect to mail server, ask if mailbox exists
 * 3. Catch-all detection — test a random address to detect accept-all servers
 */
import type { EnrichmentProvider, EmailVerificationResult, EmailResult } from "../types.js";
export declare class SmtpVerifierProvider implements EnrichmentProvider {
    name: string;
    isConfigured(): boolean;
    /**
     * Verify an email address using DNS MX + SMTP RCPT TO.
     * Returns valid/invalid/catch-all/unknown status with a confidence score.
     */
    verifyEmail(email: string): Promise<EmailVerificationResult | null>;
    /**
     * Find an email by guessing patterns and verifying with SMTP.
     * Tries common patterns like first.last@domain, firstlast@domain, etc.
     * Returns the first verified email, or null if none work.
     */
    findEmail(name: string, domain: string): Promise<EmailResult | null>;
}
//# sourceMappingURL=smtp-verifier.d.ts.map