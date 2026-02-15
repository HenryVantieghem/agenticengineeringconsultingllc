# Claude Code AI Trading Intelligence — Full Setup Guide

> Created: 2026-02-13
> Owner: Henry Vantieghem
> Status: Setting up

---

## Quick Start Checklist

- [ ] Solana wallet (Phantom or CLI)
- [ ] $10-20 SOL for gas
- [ ] Alpaca paper trading account (free $100K)
- [ ] Finnhub API key (free, 60 calls/min)
- [ ] Alpha Vantage API key (free, 25 calls/day)
- [ ] Add keys to `.env`
- [ ] Install Pump.fun MCP
- [ ] Test `/trade scan`
- [ ] Test `/trade congress`
- [ ] First paper trade via Alpaca

---

## Step 1: Get API Keys (All Free)

### 1a. Finnhub — Congressional Trades + Insider Trading
- **Sign up:** https://finnhub.io/register
- **What you get:** 60 API calls/minute, congressional trading data, insider transactions, stock quotes
- **How:** Click "Get free API key" → enter email → confirm → copy key
- **Add to `.env`:** `FINNHUB_API_KEY=your_key_here`

### 1b. Alpha Vantage — Stock Technical Analysis
- **Sign up:** https://www.alphavantage.co/support/#api-key
- **What you get:** 25 API calls/day, RSI, MACD, Bollinger Bands, stock quotes
- **How:** Fill in form → instant key displayed on screen → copy it
- **Add to `.env`:** `ALPHA_VANTAGE_API_KEY=your_key_here`

### 1c. Alpaca — Paper Trading (Free $100K to Trade)
- **Sign up:** https://app.alpaca.markets/signup
- **What you get:** Paper trading account with $100K fake money, real market data
- **How:**
  1. Go to https://app.alpaca.markets/signup
  2. Create account (email + password)
  3. Select "Paper Trading" (NOT live)
  4. Go to API Keys section (left sidebar)
  5. Click "Generate New Key"
  6. Copy both the Key ID and Secret Key
- **Add to `.env`:**
  ```
  APCA_API_KEY_ID=your_key_id_here
  APCA_API_SECRET_KEY=your_secret_key_here
  ```
- **Important:** Use `paper-api.alpaca.markets` NOT `api.alpaca.markets` (paper = fake money)

### 1d. Solana Wallet — For Pump.fun Trading
- **Option A: Phantom Wallet (Recommended for beginners)**
  1. Go to https://phantom.app/
  2. Install browser extension
  3. Create new wallet
  4. SAVE your recovery phrase somewhere safe
  5. Export private key: Settings → Security → Export Private Key
  6. Add to `.env`: `SOL_PRIVATE_KEY=your_private_key_here`

- **Option B: CLI (Faster)**
  ```bash
  # Install Solana CLI
  sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
  # Generate new wallet
  solana-keygen new --outfile ~/.config/solana/trading-wallet.json
  # Get your public address
  solana address
  # Fund it: send SOL from any exchange to this address
  ```

### 1e. Fund Your Solana Wallet
- Buy $10-20 of SOL on Coinbase, Binance, Kraken, or any exchange
- Send it to your Phantom/CLI wallet address
- This covers gas fees for Pump.fun trades (~$0.01 per transaction)

---

## Step 2: Add Keys to .env

Open your `.env` file and add:
```bash
# Trading API Keys (all free)
FINNHUB_API_KEY=your_finnhub_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Alpaca Paper Trading (free $100K fake money)
ALPACA_API_KEY=your_alpaca_key_id
ALPACA_SECRET_KEY=your_alpaca_secret

# Helius RPC (for Pump.fun MCP — free at helius.dev)
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_key
```

---

## Step 3: MCP Servers in .mcp.json

### Pump.fun MCP (Solana memecoin trading)
- **Source:** https://github.com/noahgsolomon/pumpfun-mcp-server
- **Installed to:** `mcp/pumpfun-mcp/` (cloned + built)
- **Env var needed:** `HELIUS_RPC_URL` (free at https://helius.dev)
- **Tools:** buy-token, sell-token, create-token, get-token-info, list-accounts, get-account-balance
- **Config:**
  ```json
  "pumpfun": {
    "command": "node",
    "args": ["/path/to/mcp/pumpfun-mcp/build/index.js"],
    "env": { "HELIUS_RPC_URL": "${HELIUS_RPC_URL}" }
  }
  ```

### Alpaca MCP (Paper trading stocks + crypto)
- **Source:** https://github.com/alpacahq/alpaca-mcp-server
- **Install:** `uvx alpaca-mcp-server serve` (Python, auto-installed)
- **Env vars:** `ALPACA_API_KEY`, `ALPACA_SECRET_KEY` (free at https://app.alpaca.markets/signup)
- **Tools:** trade stocks/crypto/options, portfolio, market data, watchlists
- **Config:**
  ```json
  "alpaca": {
    "command": "uvx",
    "args": ["alpaca-mcp-server", "serve"],
    "env": {
      "ALPACA_API_KEY": "${ALPACA_API_KEY}",
      "ALPACA_SECRET_KEY": "${ALPACA_SECRET_KEY}",
      "ALPACA_PAPER_TRADE": "True"
    }
  }
  ```

### Already Installed (no new keys needed)
- **Apify MCP** — Crypto Twitter tracker, DexScreener monitor, sentiment analysis
- **Firecrawl MCP** — Scrape GMGN.ai whale data, Capitol Trades, OpenInsider
- **CoinGecko API** — Free, no key (trending, markets, OHLC)
- **Fear & Greed API** — Free, no key (sentiment index)

---

## Step 4: Available Commands

| Command | What It Does |
|---------|-------------|
| `/trade` or `/trade scan` | Full market scan (crypto + stocks + sentiment) |
| `/trade deep BTC` | Deep analysis on any asset |
| `/trade congress` | Congressional + insider trading tracker |
| `/trade whale` | Whale movements + smart money flows |
| `/trade signals` | Technical analysis dashboard |
| `/trade execute BTC long 5%` | Paper trade execution via Alpaca |
| `/trade portfolio` | View open positions + P&L |
| `/trade briefing` | Full daily intelligence briefing |
| `/trade arbitrage` | Cross-exchange price discrepancies |
| `/trade fear` | Fear & Greed + sentiment dashboard |
| `/snipe` | Social signal detection → memecoin snipe pipeline |

---

## Step 5: Trading Strategies (Ranked by Risk)

### Strategy 1: Fear & Greed DCA (Lowest Risk, Proven)
- Buy when Fear & Greed < 15 → sell when > 75
- Currently at 9/100 = ALL-TIME LOW = strongest buy signal ever
- Historical 90-day return from sub-10 readings: +45% average
- Use Alpaca paper trading to test first

### Strategy 2: Congressional Trade Copying (Low-Medium Risk)
- Run `/trade congress` weekly
- Follow trades where multiple Congress members buy same stock
- 45-day disclosure delay, but still historically profitable
- NANC ETF (Democratic trades) returned 32.5%

### Strategy 3: Whale Copy-Trading (Medium Risk)
- GMGN.ai tracks 5,000+ proven whale wallets
- When 3+ whales buy same token = HIGH CONFIDENCE
- Use Apify to scrape GMGN whale data
- Execute via Pump.fun MCP

### Strategy 4: Social Signal Sniper (High Risk, High Reward)
- Apify Crypto Twitter Tracker monitors 1000+ accounts
- Detect trending tokens before retail
- Claude filters for quality (contract safety, liquidity, narrative)
- Execute via Pump.fun MCP
- Only risk $5-20 per trade (lottery ticket approach)

### Strategy 5: Memecoin Launch Detection (Highest Risk)
- Monitor Pump.fun for new launches
- Claude evaluates: name, social presence, dev wallet, contract
- Buy $5-10 in promising launches
- Auto-sell at 3-5x or -50% stop
- Math: 50 trades × $10 each, if 2 hit 50x = $1,000 gain on $500 risk

---

## Data Sources (Free, No Keys Needed)

| Source | API | What It Provides |
|--------|-----|-----------------|
| CoinGecko | `api.coingecko.com/api/v3/` | 15,000+ coin prices, OHLC, trending |
| Fear & Greed | `api.alternative.me/fng/` | Crypto sentiment 0-100 |
| DeFiLlama | `api.llama.fi/` | TVL, yields, chain data |
| Capitol Trades | `capitoltrades.com/trades` | Congressional stock trades (via Firecrawl) |
| OpenInsider | `openinsider.com` | SEC Form 4 insider trades (via Firecrawl) |

---

## Research Sources

### Claude Code Trading Success Stories
- [Claude Code $100K paper trading beat the market](https://medium.com/@jakenesler/i-gave-claude-code-100k-to-trade-with-in-the-last-month-and-beat-the-market-ece3fd6dcebc)
- [Claude Opus 4 trading strategy "DESTROYED the market"](https://medium.com/@austin-starks/i-let-claude-opus-4-create-a-trading-strategy-it-destroyed-the-market-c200bf1a19a4)
- [AI Trading Bots deliver crypto profits — Yahoo Finance](https://finance.yahoo.com/news/ai-trading-bots-really-deliver-100216403.html)
- [Build Profitable Strategy with Claude AI](https://blog.pickmytrade.io/build-profitable-futures-strategy-claude-ai-2026/)
- [Aurora: AI trading agent like Claude Code](https://medium.com/codex/i-built-aurora-an-ai-trading-agent-that-works-like-cursor-and-claude-code-heres-how-she-works-7a0b5fe909eb)

### Crypto Data & Analytics
- [CoinGecko MCP Server (Official)](https://docs.coingecko.com/docs/mcp-server)
- [Crypto.com MCP Server](https://mcp.crypto.com/docs/claude)
- [Pump.fun MCP Server](https://github.com/8bitsats/PUMP-MCP)
- [CCXT MCP Server](https://github.com/Nayshins/mcp-server-ccxt)
- [Alpaca MCP Server](https://github.com/alpacahq/alpaca-mcp-server)

### Congressional & Insider Trading
- [Quiver Quantitative](https://www.quiverquant.com/congresstrading/)
- [Capitol Trades](https://www.capitoltrades.com/)
- [Unusual Whales Pelosi Tracker](https://unusualwhales.com/nancy-pelosi)
- [Finnhub Congressional Trading API](https://finnhub.io/docs/api/congressional-trading)
- [HillSignals](https://hillsignals.com/tracker)

### Memecoin Tools
- [GMGN.ai](https://gmgn.ai/) — AI memecoin detection + whale copy-trading
- [Apify Crypto Twitter Tracker](https://apify.com/muhammetakkurtt/crypto-twitter-tracker)
- [Apify DexScan Meme Explorer](https://apify.com/muhammetakkurtt/dexscan-meme-explorer-scraper)
- [Best Meme Coin Trading Tools 2026](https://www.bitdegree.org/crypto/best-meme-coin-trading-tools)

### Trading Bot Frameworks
- [Freqtrade](https://github.com/freqtrade/freqtrade) — Most popular Python trading bot
- [CCXT](https://github.com/ccxt/ccxt) — 100+ exchange connectivity
- [Hummingbot](https://hummingbot.org/) — Market making + HFT
- [OctoBot](https://www.octobot.cloud/) — AI connectors + DCA/Grid
- [Jesse](https://jesse.trade/) — Clean strategy backtesting

### Market Context (Feb 2026)
- BTC: $67K (down from $126K ATH in Oct 2025)
- Fear & Greed: 9/100 (ALL-TIME RECORD LOW)
- Cause: Trump 100% China tariffs + Kevin Warsh Fed nomination
- [CNN: Bitcoin price under $70,000](https://www.cnn.com/2026/02/05/investing/bitcoin-price)
- [CNBC: Crypto winter selloff](https://www.cnbc.com/2026/02/05/bitcoin-prices-crypto-crash-selloff-investors.html)
- [Warren Buffett lesson meets extreme fear](https://www.ccn.com/analysis/crypto/warren-buffett-crypto-extreme-fear-index-2026-bitcoin-buy-signal/)

---

## Risk Management Rules (ALWAYS ENFORCED)

| Rule | Value |
|------|-------|
| Max risk per trade | 2% of portfolio |
| Max correlated positions | 3 |
| Max daily loss | 5% of portfolio |
| Minimum R:R | 2:1 |
| Stop loss | ALWAYS required |
| Paper trade first | ALWAYS before real money |

**DISCLAIMER:** This is a research and automation tool, NOT financial advice. Past performance does not guarantee future results. Always paper trade before risking real capital.
