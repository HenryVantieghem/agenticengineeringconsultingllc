/**
 * Simple technology detection via HTML analysis.
 *
 * Fetches a domain's homepage and checks for known script/meta/link
 * patterns to identify CMS, frameworks, analytics, and ecommerce platforms.
 *
 * This is a lightweight Wappalyzer-style approach -- no external API needed.
 */
const TECH_PATTERNS = [
    // CMS
    {
        name: "WordPress",
        category: "cms",
        patterns: [/wp-content/i, /wp-includes/i, /wordpress/i, /wp-json/i],
    },
    {
        name: "Wix",
        category: "cms",
        patterns: [/wix\.com/i, /wixsite\.com/i, /x-wix/i, /wix-code/i],
    },
    {
        name: "Squarespace",
        category: "cms",
        patterns: [/squarespace/i, /sqsp\.net/i, /static\.squarespace/i],
    },
    {
        name: "Webflow",
        category: "cms",
        patterns: [/webflow/i, /assets\.website-files\.com/i],
    },
    {
        name: "Shopify",
        category: "cms",
        patterns: [/shopify/i, /cdn\.shopify/i, /myshopify\.com/i],
    },
    {
        name: "Drupal",
        category: "cms",
        patterns: [/drupal/i, /sites\/all\/themes/i, /sites\/default\/files/i],
    },
    {
        name: "Joomla",
        category: "cms",
        patterns: [/joomla/i, /\/media\/system\/js/i, /com_content/i],
    },
    {
        name: "Ghost",
        category: "cms",
        patterns: [/ghost\.org/i, /ghost-api/i, /\/ghost\/api/i],
    },
    {
        name: "HubSpot CMS",
        category: "cms",
        patterns: [/hubspot/i, /hs-scripts/i, /hbspt/i],
    },
    {
        name: "GoDaddy Website Builder",
        category: "cms",
        patterns: [/godaddy/i, /secureserver\.net/i],
    },
    // Ecommerce
    {
        name: "Shopify",
        category: "ecommerce",
        patterns: [/cdn\.shopify/i, /myshopify\.com/i],
    },
    {
        name: "WooCommerce",
        category: "ecommerce",
        patterns: [/woocommerce/i, /wc-ajax/i],
    },
    {
        name: "BigCommerce",
        category: "ecommerce",
        patterns: [/bigcommerce/i, /cdn\.bigcommerce/i],
    },
    {
        name: "Magento",
        category: "ecommerce",
        patterns: [/magento/i, /mage\/cookies/i],
    },
    {
        name: "Stripe",
        category: "ecommerce",
        patterns: [/js\.stripe\.com/i, /stripe\.js/i],
    },
    // Analytics
    {
        name: "Google Analytics",
        category: "analytics",
        patterns: [
            /google-analytics\.com/i,
            /googletagmanager\.com/i,
            /gtag\(/i,
            /ga\.js/i,
            /analytics\.js/i,
        ],
    },
    {
        name: "Google Tag Manager",
        category: "analytics",
        patterns: [/googletagmanager\.com\/gtm/i, /GTM-/i],
    },
    {
        name: "Facebook Pixel",
        category: "analytics",
        patterns: [/connect\.facebook\.net/i, /fbq\(/i, /facebook-pixel/i],
    },
    {
        name: "Hotjar",
        category: "analytics",
        patterns: [/hotjar/i, /static\.hotjar/i],
    },
    {
        name: "Microsoft Clarity",
        category: "analytics",
        patterns: [/clarity\.ms/i],
    },
    {
        name: "Mixpanel",
        category: "analytics",
        patterns: [/mixpanel/i, /cdn\.mxpnl/i],
    },
    {
        name: "Segment",
        category: "analytics",
        patterns: [/cdn\.segment/i, /analytics\.min\.js/i],
    },
    {
        name: "Plausible",
        category: "analytics",
        patterns: [/plausible\.io/i],
    },
    // Frameworks
    {
        name: "React",
        category: "framework",
        patterns: [/__NEXT_DATA__/i, /react/i, /_next\//i, /reactDOM/i],
    },
    {
        name: "Next.js",
        category: "framework",
        patterns: [/__NEXT_DATA__/i, /_next\/static/i, /nextjs/i],
    },
    {
        name: "Vue.js",
        category: "framework",
        patterns: [/vue\.js/i, /vuejs/i, /__vue__/i, /nuxt/i],
    },
    {
        name: "Angular",
        category: "framework",
        patterns: [/ng-version/i, /angular/i],
    },
    {
        name: "jQuery",
        category: "framework",
        patterns: [/jquery/i],
    },
    {
        name: "Bootstrap",
        category: "framework",
        patterns: [/bootstrap/i],
    },
    {
        name: "Tailwind CSS",
        category: "framework",
        patterns: [/tailwindcss/i, /tailwind/i],
    },
    // Hosting / CDN
    {
        name: "Cloudflare",
        category: "hosting",
        patterns: [/cloudflare/i, /cf-ray/i],
    },
    {
        name: "Vercel",
        category: "hosting",
        patterns: [/vercel/i, /\.vercel\.app/i],
    },
    {
        name: "Netlify",
        category: "hosting",
        patterns: [/netlify/i, /\.netlify\.app/i],
    },
    // Other / Marketing
    {
        name: "Calendly",
        category: "other",
        patterns: [/calendly/i],
    },
    {
        name: "Intercom",
        category: "other",
        patterns: [/intercom/i, /widget\.intercom\.io/i],
    },
    {
        name: "Drift",
        category: "other",
        patterns: [/drift/i, /js\.driftt\.com/i],
    },
    {
        name: "Mailchimp",
        category: "other",
        patterns: [/mailchimp/i, /chimpstatic/i],
    },
    {
        name: "Typeform",
        category: "other",
        patterns: [/typeform/i],
    },
    {
        name: "reCAPTCHA",
        category: "other",
        patterns: [/recaptcha/i, /google\.com\/recaptcha/i],
    },
];
// ---------------------------------------------------------------------------
// Detector
// ---------------------------------------------------------------------------
export class TechDetector {
    /**
     * Fetch homepage and detect technologies from HTML content.
     */
    async detect(domain) {
        const result = {
            domain,
            technologies: [],
            cms: null,
            ecommerce: null,
            analytics: [],
        };
        let html;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`https://${domain}`, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
            });
            clearTimeout(timeout);
            if (!res.ok) {
                return result;
            }
            html = await res.text();
        }
        catch {
            // Domain not live or timeout -- return empty result
            return result;
        }
        // Check each pattern against the HTML
        const seen = new Set();
        for (const tech of TECH_PATTERNS) {
            for (const pattern of tech.patterns) {
                if (pattern.test(html)) {
                    // Add to technologies list (deduped)
                    if (!seen.has(tech.name)) {
                        seen.add(tech.name);
                        result.technologies.push(tech.name);
                    }
                    // Categorize
                    switch (tech.category) {
                        case "cms":
                            if (!result.cms)
                                result.cms = tech.name;
                            break;
                        case "ecommerce":
                            if (!result.ecommerce)
                                result.ecommerce = tech.name;
                            break;
                        case "analytics":
                            if (!result.analytics.includes(tech.name)) {
                                result.analytics.push(tech.name);
                            }
                            break;
                    }
                    break; // One pattern match is enough per tech
                }
            }
        }
        return result;
    }
}
//# sourceMappingURL=tech-detector.js.map