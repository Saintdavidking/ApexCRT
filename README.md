# ApexChart — Institutional Trading Platform

A modern multi-page trading web application built with React + Vite, featuring CRT (Candle Range Theory) and SMC (Smart Money Concepts) strategy tools with live TradingView charts and Yahoo Finance data integration.

---

## Pages

| Route     | Description                                                  |
|-----------|--------------------------------------------------------------|
| Home      | Landing page with hero, stats, tool cards, and CTA           |
| Learn     | CRT & SMC educational content with glossary                  |
| Features  | Full platform capability breakdown and product roadmap        |
| Copy Trading | Trader leaderboard UI (design-ready, backend TBD)         |
| CRT       | Full CRT analyzer — dual charts + live auto trade plan       |
| SMC       | SMC chart page with order block / BOS reference panel        |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

---

## Project Structure

```
ApexChart/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root app with page router
    ├── constants/
    │   └── index.js              # Symbols, timeframes, design tokens, ticker data
    ├── styles/
    │   └── global.css            # Global CSS, animations, utility classes
    ├── utils/
    │   ├── candleGenerator.js    # Structured mock OHLCV generator
    │   ├── crtAnalysis.js        # CRT analysis engine (range, sweep, FVG, trade plan)
    │   └── tvUrl.js              # TradingView widget URL builder
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── TickerBar.jsx
    │   ├── Pill.jsx
    │   ├── Stat.jsx
    │   ├── SectionHeader.jsx
    │   └── TradePlanPanel.jsx
    └── pages/
        ├── HomePage.jsx
        ├── LearnPage.jsx
        ├── FeaturesPage.jsx
        ├── CopyTradingPage.jsx
        ├── CRTPage.jsx
        └── SMCPage.jsx
```

---

## CRT Logic Overview

The CRT analysis engine (`src/utils/crtAnalysis.js`) runs 4 steps:

1. **Range Detection** — finds the consolidation high/low from the last ~14 HTF candles
2. **Liquidity Sweep** — detects whether price swept buy-side (BSL) or sell-side (SSL) liquidity
3. **FVG Scan** — scans last 20 LTF candles for a 3-bar imbalance aligned with sweep direction
4. **Trade Plan** — calculates entry (FVG mid), SL (beyond sweep wick), TP (opposite range extreme), and R:R

### Data source

- Primary: **Yahoo Finance** via `corsproxy.io` CORS proxy
- Fallback: Structured simulation (`src/utils/candleGenerator.js`) with realistic phase-based OHLCV data

---

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — dev server and bundler
- **TradingView Widgets** — embedded professional charts
- **Yahoo Finance API** — live OHLCV candle data
- **Google Fonts** — Syne (display) + DM Mono (data)
- Pure CSS animations — no animation library required

---

## Disclaimer

> ApexChart is for **educational purposes only** and does not constitute financial advice. Always do your own research and consult a licensed financial advisor before trading.
