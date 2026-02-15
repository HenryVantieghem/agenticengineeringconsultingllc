# Trading Intelligence Setup Guide

## Quick Start
Run `/trade scan` — works immediately with free APIs (no keys needed).

## Free API Keys (Unlock More Data)

### 1. Finnhub (Congressional Trades + Insider Trading)
- Sign up: https://finnhub.io/register
- Free tier: 60 API calls/minute
- Add to `.env`: `FINNHUB_API_KEY=your_key`

### 2. Alpha Vantage (Stock Technical Analysis)
- Sign up: https://www.alphavantage.co/support/#api-key
- Free tier: 25 API calls/day
- Add to `.env`: `ALPHA_VANTAGE_API_KEY=your_key`

### 3. Alpaca (Paper Trading — Execute Trades)
- Sign up: https://app.alpaca.markets/signup
- Free paper trading account (fake $100K to trade with)
- Add to `.env`:
  ```
  APCA_API_KEY_ID=your_key
  APCA_API_SECRET_KEY=your_secret
  ```

## Premium APIs (Optional — More Alpha)

### 4. Nansen (Smart Money Tracking)
- https://www.nansen.ai/ — 500M+ labeled wallets
- Pricing: Premium tier required for API

### 5. Glassnode (On-Chain Metrics)
- https://glassnode.com/ — Institutional-grade BTC/ETH analytics
- Pricing: Advanced plan for API access

### 6. Arkham Intelligence (Wallet De-anonymization)
- https://www.arkham.com/ — Entity attribution
- API available with account

## Available Commands

| Command | What It Does |
|---------|-------------|
| `/trade` or `/trade scan` | Full market scan (crypto + stocks + sentiment) |
| `/trade deep BTC` | Deep analysis on any asset |
| `/trade congress` | Congressional + insider trading tracker |
| `/trade whale` | Whale movements + smart money flows |
| `/trade signals` | Technical analysis dashboard |
| `/trade execute BTC long 5%` | Paper trade execution |
| `/trade portfolio` | View open positions + P&L |
| `/trade briefing` | Full daily intelligence briefing |
| `/trade arbitrage` | Cross-exchange price discrepancies |
| `/trade fear` | Fear & Greed + sentiment dashboard |

## Highest-Leverage Workflows

1. **Daily Briefing** — Run `/trade briefing` every morning
2. **Congress Follows** — Run `/trade congress` weekly, copy high-conviction trades
3. **Smart Money Convergence** — When congress + whale + insider align = highest alpha
4. **Fear Contrarian** — Buy extreme fear, sell extreme greed
5. **Whale Front-Run** — Large stablecoin exchange inflows = buying incoming
