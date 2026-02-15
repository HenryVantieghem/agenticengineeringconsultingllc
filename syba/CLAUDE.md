# SYBA Project Rules

## NEVER
- Include unverified email addresses in briefs
- Include partner companies as leads (Chubb, Tokio Marine Highland, Jencap, PwC, Concordia)
- Include partner competitors without [FLAGGED] tag
- Use firstname.lastname@domain.com guessing WITHOUT SmtpVerifier confirmation
- Use dashes (-) or bullet points in email body copy
- Write "I hope this finds you well" or generic openers
- Send outreach without all 4 verification gates passing

## ALWAYS
- Verify emails via SmtpVerifier ($0) before inclusion
- Include LinkedIn URL for every lead
- Check exclusion list before including any lead
- Write in Francis/Brigitte Belgian-professional tone
- Check for due follow-ups in every daily run
- Separate brief: Verified | Unverified | Excluded

## EXCLUSION LIST

### Partners (NEVER target)
- Chubb
- Tokio Marine Highland
- Jencap Group
- PwC Belgium
- Concordia

### Partner Competitors (FLAG but include for discussion)
- AON
- Marsh McLennan
- Willis Towers Watson
- Epic Insurance
- CRC Group

## REGIONAL ALLOCATION
- Belgium: 20 leads (Francis — francis@syba.io)
- USA: 20 leads (Brigitte — brigittev@syba.io)
- Europe ex-Belgium: 10 leads

## EMAIL VERIFICATION WATERFALL ($0)
1. Pattern guess: {first}.{last}@{domain} using company email_pattern
2. SmtpVerifier: DNS MX + SMTP RCPT TO (free, local)
3. Clay Waterfall waterfall_find_email (if API keys configured)
4. If all fail: "unverified" section with LinkedIn URL

## OUTREACH TONE (Francis/Brigitte Voice)
- No dashes, no bullet points in email body
- Conversational Belgian-English: direct but warm
- Open with genuine compliment referencing specific LinkedIn post
- One cybersecurity insight as free value
- SYBA solution in 1-2 sentences max
- Soft CTA: "15-min conversation" (never "sales call" or "demo")
- Sign off: Francis (Belgium/Europe) or Brigitte (USA)

## QUALITY GATES (all 4 must pass)
1. **Verification Gate:** email_verified = true OR lead in "unverified" section with LinkedIn URL
2. **Exclusion Gate:** not in partner list, competitors tagged [FLAGGED]
3. **Content Gate:** 11 safety checks from deep-outreach skill
4. **Pre-Send Gate:** valid CTA links, correct recipient, no placeholder text

## FOLLOW-UP CADENCE
- Day 3: New angle/stat, reference original email
- Day 10: Share relevant case study or news article
- Day 17: Break-up email, offer resource with no strings
