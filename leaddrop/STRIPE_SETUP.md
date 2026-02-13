# Stripe Setup Guide — LeadDrop by Agentic Engineering

## Quick Setup (15 minutes)

### Step 1: Create Products in Stripe Dashboard

Go to **stripe.com/dashboard** → **Product catalog** → **+ Add product**

**Product 1: LeadDrop Setup Fee**
- Name: "LeadDrop Setup Fee"
- Description: "One-time setup — AI analysis of your business, custom dashboard deployment, ICP development"
- Price: $300.00
- Type: **One-time**

**Product 2: LeadDrop Monthly**
- Name: "LeadDrop Monthly — AI Lead Intelligence"
- Description: "20 daily researched leads, prospect intelligence briefs, ready-to-send outreach, live dashboard"
- Price: $200.00
- Type: **Recurring** (monthly)

### Step 2: Create Payment Link

Go to **Payment Links** → **+ New**

1. Click **Add another product**
2. Add **LeadDrop Setup Fee** ($300 one-time) as line item 1
3. Add **LeadDrop Monthly** ($200/mo recurring) as line item 2
4. Under Options:
   - Enable **Collect phone numbers**
   - Enable **Collect billing address**
   - Set confirmation page to redirect to: `https://agenticengineering.netlify.app/welcome` (or keep default Stripe confirmation)
5. Click **Create link**

**Save this link!** This is your main payment URL. Format: `https://buy.stripe.com/XXXXXXX`

### Step 3: Update Landing Page

Replace the Calendly CTA in the pricing section with the Stripe Payment Link:

```html
<a href="https://buy.stripe.com/YOUR_LINK_HERE" class="pricing-cta">
  Get Started — $300 setup + $200/mo
</a>
```

Keep the Calendly links on other CTAs (demo booking still goes through Calendly).

### Step 4: Update /contract Command

Add your Stripe Payment Link to the contract template. The `/contract` command has a `{stripe_payment_link}` placeholder — replace it with your real link.

---

## What Happens After Payment

1. **Stripe creates a Subscription** → visible in Dashboard → Billing → Subscriptions
2. **First invoice** includes both $300 setup + $200 monthly = $500 total
3. **Subsequent invoices** are $200/mo automatically
4. **You get email notification** for each payment
5. **Customer gets receipt** automatically from Stripe

---

## Optional: Stripe Pricing Table Embed

If you want a fancier embedded pricing table on the landing page:

```html
<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table
  pricing-table-id="prctbl_XXXXXXXXXXXX"
  publishable-key="pk_live_XXXXXXXXXXXX">
</stripe-pricing-table>
```

Create this in Stripe Dashboard → Product catalog → Pricing tables → + Create.

**Note:** The pricing table doesn't show setup fees inline — they appear on the checkout page. For a simple single-tier offer, the direct Payment Link approach is better.

---

## Environment Variables

Add to `.env`:
```
STRIPE_PAYMENT_LINK=https://buy.stripe.com/YOUR_LINK
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXX
```

These are referenced by the landing page and the /contract command.

---

## Revenue Tracking

Stripe Dashboard → **Revenue** shows:
- MRR (Monthly Recurring Revenue)
- Subscriber count
- Churn rate
- Average revenue per user

No custom dashboard needed — Stripe handles all of this.
