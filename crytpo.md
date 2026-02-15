---                                                   
  Crypto & Stock Trading Setup for Claude Code — Full   
  Research Report                                       
                                                        
  ★ Insight ─────────────────────────────────────       
  The big picture: You can build a genuinely powerful
  trading intelligence system by stacking MCPs together.
   The key insight is that Claude Code isn't a trading
  bot itself — it's a research and decision layer that
  sits on top of data feeds. The MCPs give it eyes
  (market data), ears (sentiment/news), and hands (trade
   execution). The more data sources you connect, the
  better the analysis gets.
  ─────────────────────────────────────────────────

  ---
  1. The Must-Have Crypto MCPs (Install These First)

  Tier 1: Core Market Data

  MCP Server: CoinGecko MCP (Official)
  What It Does: 15,000+ coins, real-time prices, DEX
  data
    via GeckoTerminal
  Setup: Free (30 calls/min)
  ────────────────────────────────────────
  MCP Server: Crypto.com MCP
  What It Does: Quick 5-min setup, real-time crypto data
  Setup: Free
  ────────────────────────────────────────
  MCP Server: mcp-server-ccxt
  What It Does: 100+ exchanges via CCXT library — THE
    foundation
  Setup: Free/open-source
  ────────────────────────────────────────
  MCP Server: crypto-mcp-server (npm)
  What It Does: Multi-exchange, arbitrage detection,
    MACD/Bollinger/KDJ indicators
  Setup: Free

  Tier 2: Trading Execution

  MCP Server: Alpaca MCP (Official)
  What It Does: Trade stocks + crypto + options in plain

    English
  Setup: Free paper trading
  ────────────────────────────────────────
  MCP Server: Binance MCP
  What It Does: Real-time streaming, spot + futures,
    automated strategies
  Setup: Free API key
  ────────────────────────────────────────
  MCP Server: Trade It MCP
  What It Does: Robinhood, E*Trade, Schwab, Webull,
    Coinbase, Kraken — all in one
  Setup: Multi-broker
  ────────────────────────────────────────
  MCP Server: DeFi Trading MCP
  What It Does: Autonomous DeFi trading across 17+
    blockchains
  Setup: Free/open-source

  Tier 3: On-Chain Intelligence

  ┌────────────────┬───────────────────────────┬───────┐
  │   MCP Server   │       What It Does        │ Setup │
  ├────────────────┼───────────────────────────┼───────┤
  │ Blockchain MCP │ Read/write data across    │ API   │
  │  (Tatum)       │ 130+ networks             │ key   │
  ├────────────────┼───────────────────────────┼───────┤
  │ DexPaprika MCP │ 5M+ tokens, 20+ chains,   │ Free  │
  │                │ DEX analytics             │       │
  ├────────────────┼───────────────────────────┼───────┤
  │                │ DeFi swaps, honeypot      │       │
  │ BNBChain MCP   │ detection, security       │ Free  │
  │                │ analysis                  │       │
  ├────────────────┼───────────────────────────┼───────┤
  │ Solana MCP     │ Full Solana blockchain    │ Free  │
  │                │ interaction               │       │
  └────────────────┴───────────────────────────┴───────┘

  Tier 4: Signals & Sentiment

  MCP Server: Trading Signals MCP
  What It Does: Technical analysis, multi-timeframe,
    order book data via Binance
  Setup: Free
  ────────────────────────────────────────
  MCP Server: TradingView MCP
  What It Does: Screening, candlestick patterns,
    Bollinger intelligence
  Setup: Free
  ────────────────────────────────────────
  MCP Server: Crypto Fear & Greed MCP
  What It Does: Real-time market sentiment 0-100
  Setup: Free
  ────────────────────────────────────────
  MCP Server: Alpha MCP
  What It Does: AI-powered technical + sentiment
  analysis
  Setup: Free
  ────────────────────────────────────────
  MCP Server: CryptoWeather MCP
  What It Does: Bitcoin price prediction signals, hourly

    updated
  Setup: Free

  ---
  2. Congressional & Government Trading (The "Pelosi
  Tracker" Stack)

  ★ Insight ─────────────────────────────────────
  Why this is alpha: Under the STOCK Act (2012),
  Congress members must disclose trades within 45 days.
  That's the delay. But the data shows their trades
  consistently beat the market — the NANC ETF (based on
  Democratic trades) returned 32.5%. By tracking these
  disclosures the moment they're filed, you front-run
  the public awareness of those trades.
  ─────────────────────────────────────────────────

  Congressional Trading Data

  Source: Quiver Quantitative
  Type: Best API — Senate + House trades since 2016,
    "Congressional Alpha" metric
  Cost: Freemium
  ────────────────────────────────────────
  Source: Capitol Trades
  Type: Free web tracker, trusted by WSJ/NYT
  Cost: Free
  ────────────────────────────────────────
  Source: Unusual Whales
  Type: Pelosi portfolio tracker, "I Am The Senate"
    section
  Cost: Paid
  ────────────────────────────────────────
  Source: Finnhub
  Type: Free API — congressional-trading endpoint, 60
    calls/min
  Cost: Free
  ────────────────────────────────────────
  Source: Financial Modeling Prep
  Type: Senate + House Trading APIs + insider
    transactions
  Cost: Free plan, $19/mo premium
  ────────────────────────────────────────
  Source: HillSignals
  Type: All 535 Congress members, real-time
  Cost: Free

  Related ETFs (Just Buy These If You Want Passive
  Exposure)

  - NANC — Tracks Democratic trades (named after Pelosi)
   — $180M AUM
  - KRUZ — Tracks Republican trades — $35M AUM

  SEC Insider Trading (Form 4 — Company Insiders)

  Source: sec-api.io
  Speed: <300ms after filing — fastest
  Cost: Paid tiers
  ────────────────────────────────────────
  Source: Finnhub Insider Transactions
  Speed: US/UK/Canada/Australia/India/EU, MSPR sentiment

    score
  Cost: Free
  ────────────────────────────────────────
  Source: OpenInsider
  Speed: Free Form 4 screener, real-time during market
    hours
  Cost: Free
  ────────────────────────────────────────
  Source: WhaleWisdom
  Speed: 13F filings (hedge fund holdings, $100M+
    managers)
  Cost: API requires paid account

  Stock Market Data MCPs (Already Exist!)

  MCP Server: Alpha Vantage MCP (Official)
  Data Source: 50+ indicators, real-time + historical
  Best For: AI/LLM integration
  ────────────────────────────────────────
  MCP Server: EODHD MCP (Official)
  Data Source: 150K+ tickers, 30+ years, global
  Best For: Comprehensive coverage
  ────────────────────────────────────────
  MCP Server: FMP MCP Server
  Data Source: Fundamentals, insider trades, senate
    trading
  Best For: Congressional + fundamentals
  ────────────────────────────────────────
  MCP Server: Yahoo Finance MCP
  Data Source: Historical prices, financials, options,
    news
  Best For: Free prototyping
  ────────────────────────────────────────
  MCP Server: Financial Datasets MCP
  Data Source: Income statements, balance sheets, stock
    prices
  Best For: Clean data

  Note: IEX Cloud shut down Aug 2024. FMP is the
  recommended replacement.

  ---
  3. On-Chain Intelligence (Whale Tracking / Smart
  Money)

  Platform: Nansen
  What It Tracks: 500M+ wallet labels, "smart money"
    tracking, $2B+ AUM
  API?: Premium API
  ────────────────────────────────────────
  Platform: Arkham Intelligence
  What It Tracks: De-anonymization, entity attribution,
    wallet → institution mapping
  API?: API available
  ────────────────────────────────────────
  Platform: Whale Alert
  What It Tracks: $500K+ transactions, 10+ networks,
  2.8M
    followers
  API?: WebSocket ~$30/mo
  ────────────────────────────────────────
  Platform: Glassnode
  What It Tracks: Institutional-grade BTC/ETH metrics
    (MVRV, NUPL, HODL waves)
  API?: Premium
  ────────────────────────────────────────
  Platform: CryptoQuant
  What It Tracks: Exchange flows, miner activity, large
    transaction alerts
  API?: API available
  ────────────────────────────────────────
  Platform: Santiment
  What It Tracks: 2,500+ assets, 1,000+ on-chain
  metrics,
    social + dev activity
  API?: API available
  ────────────────────────────────────────
  Platform: DeFiLlama
  What It Tracks: TVL, fees, yields, stablecoin data,
    hack histories
  API?: Free/open-source
  ────────────────────────────────────────
  Platform: LunarCrush
  What It Tracks: Social sentiment — Reddit, Twitter,
    TikTok, Telegram
  API?: API available

  ---
  4. Can We Build a Claude Code Crypto Trading Bot?

  Short answer: Yes, and someone already did it.

  A dev gave Claude Code $100K in paper trading via
  Alpaca and it beat the market over a month (Medium 
  article).

  ★ Insight ─────────────────────────────────────
  Three architecture options, increasing in complexity:

  1. Research-only (safest): Claude Code reads data from
   MCPs, generates trade recommendations, you execute
  manually. Zero risk of accidental trades.
  2. Paper trading bot: Claude Code + Alpaca MCP in
  paper trading mode. Real market data, fake money.
  Perfect for testing strategies before going live.
  3. Live trading bot: Claude Code + CCXT MCP or Alpaca
  MCP with real API keys. Claude analyzes data across
  all connected MCPs, executes trades. This is powerful
  but risky — always use stop losses and position
  limits.
  ─────────────────────────────────────────────────

  Bot Framework Options

  Framework: Freqtrade
  Language: Python
  Best For: Most popular, backtesting, Telegram control,

    ML module
  Claude Integration: Claude writes strategies
  ────────────────────────────────────────
  Framework: Hummingbot
  Language: Python
  Best For: High-frequency trading, market making,
    arbitrage
  Claude Integration: Claude optimizes params
  ────────────────────────────────────────
  Framework: OctoBot
  Language: Python
  Best For: AI connectors (OpenAI/Ollama), TradingView
    integration
  Claude Integration: Direct AI connector
  ────────────────────────────────────────
  Framework: Jesse
  Language: Python
  Best For: Clean strategy research, 300+ indicators,
    JesseGPT
  Claude Integration: Claude writes + backtests
  ────────────────────────────────────────
  Framework: CCXT
  Language: Python/JS
  Best For: Raw exchange connectivity (100+ exchanges)
  Claude Integration: Foundation for MCP servers

  The "Full Stack" Trading Architecture

  Claude Code (Brain)
      ├── CoinGecko MCP ─── Real-time prices
      ├── CCXT MCP ─── Exchange connectivity (100+
  exchanges)
      ├── Trading Signals MCP ─── Technical analysis
      ├── Fear & Greed MCP ─── Market sentiment
      ├── Blockchain MCP ─── On-chain data
      ├── Alpha Vantage MCP ─── Stock data
      ├── FMP MCP ─── Congressional trades +
  fundamentals
      ├── Finnhub API ─── Insider trades + congressional
      ├── Whale Alert ─── Large transaction alerts
      └── Alpaca MCP ─── Trade execution (paper or live)

  ---
  5. How Far Could We Go? Honest Assessment

  What Claude Code CAN Do Well

  - Multi-source analysis — Synthesize data from 10+
  MCPs simultaneously
  - Pattern recognition — Spot correlations between
  congressional trades, whale moves, and price action
  - Strategy backtesting — Write Freqtrade/Jesse
  strategies and test them
  - Sentiment analysis — Process news, social data, Fear
   & Greed in real-time
  - Portfolio rebalancing — Execute periodic rebalancing
   based on signals
  - Alert generation — "Pelosi just bought NVDA, here's
  the context from 5 data sources"

  What Claude Code Can NOT Do

  - Predict the future — No AI can. It's probabilistic
  analysis, not crystal balls
  - Sub-second execution — MCP roundtrip latency is too
  high for HFT
  - Run 24/7 autonomously — Claude Code is a
  session-based tool, not a daemon (you'd need Freqtrade
   or OctoBot for always-on)
  - Replace risk management — Still need stop losses,
  position sizing, diversification

  Realistic Expectations

  - Congressional trade copying — 45-day delay, but
  still historically profitable. NANC ETF proves it
  - Whale tracking — Real alpha if you act fast on
  Nansen/Arkham signals
  - Technical + sentiment combo — Better than either
  alone. Claude excels at weighing multiple signals
  - The edge — Claude's real advantage is speed of
  research synthesis, not prediction. You get the same
  analysis a hedge fund research team produces, but in
  minutes instead of days

  ---
  6. Recommended Setup (What I'd Install)

  Phase 1: Data Layer (Free, Install Today)

  1. CoinGecko MCP — Crypto prices
  2. Crypto.com MCP — Quick alternative
  3. Alpha Vantage MCP — Stock prices
  4. Yahoo Finance MCP — Free stock data
  5. Fear & Greed MCP — Sentiment

  Phase 2: Intelligence Layer (Free/Cheap)

  6. Finnhub API (via custom MCP or Bash) —
  Congressional trades + insider trades
  7. Trading Signals MCP — Technical analysis
  8. TradingView MCP — Charts and screening
  9. DexPaprika MCP — DEX analytics

  Phase 3: Execution Layer (Paper Trading First)

  10. Alpaca MCP — Paper trading stocks + crypto
  11. CCXT MCP — Multi-exchange crypto trading
  12. Binance MCP — Direct Binance access

  Phase 4: Advanced (When You're Ready)

  13. Blockchain MCP (Tatum) — 130+ chains on-chain data
  14. Whale Alert API — Large transaction monitoring
  15. Nansen/Arkham — Smart money tracking (premium)

  ---
  Want me to start installing some of these MCPs right
  now? I'd recommend starting wi