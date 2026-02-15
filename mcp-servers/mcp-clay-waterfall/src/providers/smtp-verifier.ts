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

import * as dns from "dns/promises";
import * as net from "net";
import type {
  EnrichmentProvider,
  EmailVerificationResult,
  EmailResult,
} from "../types.js";
import { log } from "../waterfall.js";

// Common email patterns to try when finding emails
const EMAIL_PATTERNS = [
  "{first}.{last}",
  "{first}{last}",
  "{f}{last}",
  "{first}",
  "{last}.{first}",
  "{first}_{last}",
];

interface SmtpCheckResult {
  accepted: boolean;
  catchAll: boolean;
}

/**
 * SMTP handshake — connect to MX host on port 25, walk through
 * HELO → MAIL FROM → RCPT TO and check the response code.
 */
async function smtpCheck(mx: string, email: string): Promise<SmtpCheckResult> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(10_000);
    let step = 0;
    const domain = email.split("@")[1];

    socket.connect(25, mx, () => {
      // Connection initiated — wait for server greeting in "data" handler
    });

    socket.on("data", (data: Buffer) => {
      const response = data.toString();
      const code = parseInt(response.substring(0, 3), 10);

      switch (step) {
        case 0: // Server greeting (220)
          if (code === 220) {
            socket.write("HELO verify.local\r\n");
            step = 1;
          } else {
            socket.destroy();
            reject(new Error(`Bad greeting: ${code}`));
          }
          break;

        case 1: // HELO response (250)
          if (code === 250) {
            socket.write("MAIL FROM:<verify@verify.local>\r\n");
            step = 2;
          } else {
            socket.destroy();
            reject(new Error(`HELO rejected: ${code}`));
          }
          break;

        case 2: // MAIL FROM response (250)
          if (code === 250) {
            socket.write(`RCPT TO:<${email}>\r\n`);
            step = 3;
          } else {
            socket.destroy();
            reject(new Error(`MAIL FROM rejected: ${code}`));
          }
          break;

        case 3: // RCPT TO response — THE VERDICT
          if (code === 250) {
            // Email accepted — now test for catch-all
            const randomUser = `nonexistent-${Date.now()}@${domain}`;
            socket.write(`RCPT TO:<${randomUser}>\r\n`);
            step = 4;
          } else {
            // 550/551/552/553 = mailbox doesn't exist
            socket.write("QUIT\r\n");
            socket.destroy();
            resolve({ accepted: false, catchAll: false });
          }
          break;

        case 4: // Catch-all test
          socket.write("QUIT\r\n");
          socket.destroy();
          if (code === 250) {
            // Server accepts everything — catch-all domain
            resolve({ accepted: true, catchAll: true });
          } else {
            // Random rejected = real mailbox confirmed
            resolve({ accepted: true, catchAll: false });
          }
          break;
      }
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("SMTP timeout"));
    });

    socket.on("error", (err: Error) => {
      socket.destroy();
      reject(err);
    });
  });
}

export class SmtpVerifierProvider implements EnrichmentProvider {
  name = "smtp-verifier";

  isConfigured(): boolean {
    return true; // Always configured — no API key needed
  }

  /**
   * Verify an email address using DNS MX + SMTP RCPT TO.
   * Returns valid/invalid/catch-all/unknown status with a confidence score.
   */
  async verifyEmail(email: string): Promise<EmailVerificationResult | null> {
    // Sanitize: reject emails with SMTP injection characters or invalid format
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!EMAIL_REGEX.test(email) || /[\r\n>]/.test(email)) {
      return { email, status: "invalid", score: 0 };
    }

    const domain = email.split("@")[1];
    if (!domain) {
      return { email, status: "invalid", score: 0 };
    }

    // Step 1: DNS MX lookup
    let mxRecords: Awaited<ReturnType<typeof dns.resolveMx>>;
    try {
      mxRecords = await dns.resolveMx(domain);
    } catch {
      log("info", `SmtpVerifier: No MX records for ${domain}`);
      return { email, status: "invalid", score: 0 };
    }

    if (!mxRecords.length) {
      return { email, status: "invalid", score: 0 };
    }

    // Sort by priority (lowest number = highest priority)
    mxRecords.sort((a, b) => a.priority - b.priority);
    const mxHost = mxRecords[0].exchange;

    // Step 2: SMTP RCPT TO handshake
    try {
      const result = await smtpCheck(mxHost, email);
      const status = result.accepted
        ? result.catchAll
          ? "catch-all" as const
          : "valid" as const
        : "invalid" as const;
      const score = result.accepted
        ? result.catchAll
          ? 50
          : 90
        : 10;

      log("info", `SmtpVerifier: ${email} → ${status} (score: ${score})`);
      return { email, status, score };
    } catch (err) {
      // SMTP connection failed — MX exists so domain is valid, mailbox unknown
      const message = err instanceof Error ? err.message : String(err);
      log("warn", `SmtpVerifier: SMTP check failed for ${email}: ${message}`);
      return { email, status: "unknown", score: 40 };
    }
  }

  /**
   * Find an email by guessing patterns and verifying with SMTP.
   * Tries common patterns like first.last@domain, firstlast@domain, etc.
   * Returns the first verified email, or null if none work.
   */
  async findEmail(name: string, domain: string): Promise<EmailResult | null> {
    const parts = name.trim().toLowerCase().split(/\s+/);
    if (parts.length < 2) {
      log("warn", `SmtpVerifier: Need first + last name, got: "${name}"`);
      return null;
    }

    const first = parts[0].replace(/[^a-z]/g, "");
    const last = parts[parts.length - 1].replace(/[^a-z]/g, "");

    if (!first || !last) return null;

    const f = first[0];

    // Generate candidate emails from patterns
    const candidates = EMAIL_PATTERNS.map((pattern) =>
      pattern
        .replace("{first}", first)
        .replace("{last}", last)
        .replace("{f}", f) + `@${domain}`
    );

    log("info", `SmtpVerifier: Trying ${candidates.length} patterns for ${name} @ ${domain}`);

    for (const candidate of candidates) {
      const result = await this.verifyEmail(candidate);
      if (result && result.status === "valid") {
        log("info", `SmtpVerifier: Found valid email: ${candidate}`);
        return {
          email: candidate,
          verified: true,
          confidence: result.score,
        };
      }
      // If catch-all, the first pattern is as good as any
      if (result && result.status === "catch-all") {
        log("info", `SmtpVerifier: Catch-all domain, using first pattern: ${candidate}`);
        return {
          email: candidate,
          verified: false, // Can't truly verify on catch-all
          confidence: result.score,
        };
      }
    }

    log("info", `SmtpVerifier: No valid email found for ${name} @ ${domain}`);
    return null;
  }
}
