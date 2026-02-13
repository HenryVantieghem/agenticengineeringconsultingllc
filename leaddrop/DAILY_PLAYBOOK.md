# LeadDrop Daily Playbook — Agentic Engineering Consulting

**Owner:** Henry Vantieghem
**Updated:** 2026-02-12

---

## The Daily Rhythm (30-45 min total)

### Morning Block (9:00 AM) — Growth Engine

| Order | Command | Time | What It Does |
|-------|---------|------|-------------|
| 1 | `/drop` | ~15 min | Find 50 businesses, research 5 leads each, send 50 free-value emails |
| 2 | `/follow-up` | ~5 min | Send Day 3/7/14 follow-ups to previous /drop recipients |

### Client Block (10:00 AM) — Revenue Engine

| Order | Command | Time | What It Does |
|-------|---------|------|-------------|
| 3 | `/serve syba` | ~10 min | SYBA: 20 leads + briefs + outreach + dashboard + email |
| 4 | `/serve {client2}` | ~10 min | Next client (when onboarded) |
| 5 | Repeat for each client | ~10 min each | One /serve per paying client |

### Opportunity Block (As Needed) — Conversion

| Trigger | Command | What It Does |
|---------|---------|-------------|
| /drop reply received | `/activate` | Onboard the new client in 10-15 min |
| New client signed | `/contract` | Generate agreement via Google Docs |
| Client question | `/serve {slug}` | Ad-hoc run for demo or catch-up |

---

## Weekly Rhythm

| Day | Focus | Extra Actions |
|-----|-------|---------------|
| **Monday** | Full /drop + all /serve runs | Review pipeline metrics, plan week |
| **Tuesday** | Full /drop + all /serve runs | Follow up on Monday replies |
| **Wednesday** | Full /drop + all /serve runs | Content day: LinkedIn post about LeadDrop results |
| **Thursday** | Full /drop + all /serve runs | Follow up on all open conversations |
| **Friday** | Full /drop + all /serve runs | Weekly review, update rotation tracker |
| **Saturday** | Optional /drop (half batch) | Catch up on any missed follow-ups |
| **Sunday** | Off | — |

---

## Monthly Rhythm

| Week | Focus |
|------|-------|
| **Week 1** | Aggressive /drop (new city or industry in rotation) |
| **Week 2** | Follow-up heavy + close pipeline |
| **Week 3** | Client retention (check dashboards, send value reports) |
| **Week 4** | Review, optimize, adjust rotation matrix |

---

## Key Metrics to Track

### Growth Metrics (from /drop)
- **Emails sent this week:** Target 250 (50/day × 5 days)
- **Reply rate:** Target 2-5%
- **Demo bookings:** Target 3-5/week
- **Close rate:** Target 30% of demos

### Revenue Metrics
- **Active clients:** Count
- **MRR:** Clients × $200/mo
- **Setup fees collected this month:** Clients × $300
- **Churn:** Any cancellations?

### Client Health (from /serve)
- **Leads delivered this week:** 20/day per client × 5 days = 100/client
- **Avg fit score:** Target 7+/10
- **Client engagement:** Are they using the dashboard? Opening briefing emails?

---

## Rotation Tracker

The `/drop` command auto-rotates through this matrix. Track progress in `leaddrop/ROTATION.md`.

### Phase 1: Atlanta (Largest Nearby Market)
1. Atlanta — Dental
2. Atlanta — Law
3. Atlanta — HVAC
4. Atlanta — Medical
5. Atlanta — Real Estate
6. Atlanta — Veterinary
7. Atlanta — Property Mgmt
8. Atlanta — Auto Repair

### Phase 2: Birmingham
9-16. Same industries as above

### Phase 3: Montgomery
17-20. Top 4 industries

### Phase 4: Nashville / Charlotte / Columbus
21-30. Expand as pipeline grows

---

## Pipeline Stages

Every /drop prospect moves through this pipeline:

```
SENT → REPLIED → DEMO BOOKED → DEMO DONE → PROPOSAL SENT → SIGNED → ACTIVATED
  ↓                                                              ↓
FOLLOW-UP (Day 3, 7, 14)                                    /activate runs
  ↓                                                              ↓
NO RESPONSE → Archive (re-drop in 90 days)                   /serve daily
```

Track in Supabase `leaddrop_prospects` table:
- `status`: sent / replied / booked / demo_done / proposal / signed / activated / archived

---

## Emergency Playbook

| Situation | Action |
|-----------|--------|
| Client dashboard down | Check Netlify status, redeploy from `clients/{slug}/` |
| Gmail rate limited | Wait 1 hour, reduce batch size to 25 |
| Supabase down | Check status.supabase.com, use cached data |
| Client churning | Run an extra `/serve` batch, offer a free strategy call |
| Firecrawl/Apify down | Switch to manual web search for that day |

---

## New Client Onboarding Checklist

When a /drop prospect signs up:

- [ ] Collect: website URL + email + business name
- [ ] Run `/contract` → generate agreement in Google Docs
- [ ] Create Stripe payment link → send to client
- [ ] Confirm payment received ($300 setup + first $200/mo)
- [ ] Run `/activate {url}` → builds everything
- [ ] Verify dashboard works: `{slug}-leads.netlify.app`
- [ ] Send welcome email (auto-drafted by /activate)
- [ ] Run first `/serve {slug}` → 20 leads delivered
- [ ] Schedule Day 7 check-in call
- [ ] Add to daily `/serve` rotation

---

## Revenue Targets

| Milestone | Clients | MRR | Monthly Revenue (incl setup) | Timeline |
|-----------|---------|-----|------------------------------|----------|
| Break Even | 5 | $1,000 | $1,000 + setup fees | Week 2-3 |
| First $5K | 25 | $5,000 | $5,000 | Month 1-2 |
| $10K MRR | 50 | $10,000 | $10,000 | Month 2-3 |
| $25K MRR | 125 | $25,000 | $25,000 | Month 4-6 |
| $50K MRR | 250 | $50,000 | $50,000 | Month 6-12 |

At $200/mo, every client is profitable from day 1 (AI + MCP tools cost ~$0 marginal per client). The only cost is your ~15 min/day per client running `/serve`.

---

## Command Quick Reference

| Command | Purpose | Frequency |
|---------|---------|-----------|
| `/drop` | Free value outreach to 50 businesses | Daily |
| `/follow-up` | Follow up on previous /drop emails | Daily |
| `/serve {slug}` | Daily leads for paying client | Daily per client |
| `/activate` | Onboard new client from URL | On new signup |
| `/contract` | Generate client agreement | On new signup |
| `/syba-daily` | SYBA-specific daily run | Daily (legacy) |
| `/revenue-engine` | Deep research on 20 prospects | As needed |

*This playbook is your business operating system. One command at a time, every day.*
