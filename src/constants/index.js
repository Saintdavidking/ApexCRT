// ─────────────────────────────────────────────────
//  TRADING SYMBOLS  (25 Forex/Commodities + 22 Crypto)
// ─────────────────────────────────────────────────
export const SYMBOLS = [
  // ── Forex & Commodities ──────────────────────────────────────
  { label: "EUR/USD",  value: "EURUSD",  yf: "EURUSD=X",  tv: "FX:EURUSD",         base: 1.0850,  vol: 0.005, type: "forex"  },
  { label: "GBP/USD",  value: "GBPUSD",  yf: "GBPUSD=X",  tv: "FX:GBPUSD",         base: 1.2700,  vol: 0.006, type: "forex"  },
  { label: "USD/JPY",  value: "USDJPY",  yf: "USDJPY=X",  tv: "FX:USDJPY",         base: 151.50,  vol: 0.005, type: "forex"  },
  { label: "USD/CHF",  value: "USDCHF",  yf: "USDCHF=X",  tv: "FX:USDCHF",         base: 0.9050,  vol: 0.005, type: "forex"  },
  { label: "AUD/USD",  value: "AUDUSD",  yf: "AUDUSD=X",  tv: "FX:AUDUSD",         base: 0.6520,  vol: 0.006, type: "forex"  },
  { label: "USD/CAD",  value: "USDCAD",  yf: "USDCAD=X",  tv: "FX:USDCAD",         base: 1.3650,  vol: 0.005, type: "forex"  },
  { label: "NZD/USD",  value: "NZDUSD",  yf: "NZDUSD=X",  tv: "FX:NZDUSD",         base: 0.5950,  vol: 0.006, type: "forex"  },
  { label: "EUR/GBP",  value: "EURGBP",  yf: "EURGBP=X",  tv: "FX:EURGBP",         base: 0.8550,  vol: 0.004, type: "forex"  },
  { label: "EUR/JPY",  value: "EURJPY",  yf: "EURJPY=X",  tv: "FX:EURJPY",         base: 164.20,  vol: 0.005, type: "forex"  },
  { label: "GBP/JPY",  value: "GBPJPY",  yf: "GBPJPY=X",  tv: "FX:GBPJPY",         base: 192.50,  vol: 0.006, type: "forex"  },
  { label: "CHF/JPY",  value: "CHFJPY",  yf: "CHFJPY=X",  tv: "FX:CHFJPY",         base: 167.40,  vol: 0.005, type: "forex"  },
  { label: "AUD/JPY",  value: "AUDJPY",  yf: "AUDJPY=X",  tv: "FX:AUDJPY",         base: 98.80,   vol: 0.006, type: "forex"  },
  { label: "CAD/JPY",  value: "CADJPY",  yf: "CADJPY=X",  tv: "FX:CADJPY",         base: 111.00,  vol: 0.005, type: "forex"  },
  { label: "EUR/CHF",  value: "EURCHF",  yf: "EURCHF=X",  tv: "FX:EURCHF",         base: 0.9720,  vol: 0.004, type: "forex"  },
  { label: "GBP/CHF",  value: "GBPCHF",  yf: "GBPCHF=X",  tv: "FX:GBPCHF",         base: 1.1490,  vol: 0.005, type: "forex"  },
  { label: "EUR/AUD",  value: "EURAUD",  yf: "EURAUD=X",  tv: "FX:EURAUD",         base: 1.6640,  vol: 0.006, type: "forex"  },
  { label: "EUR/CAD",  value: "EURCAD",  yf: "EURCAD=X",  tv: "FX:EURCAD",         base: 1.4810,  vol: 0.005, type: "forex"  },
  { label: "AUD/CAD",  value: "AUDCAD",  yf: "AUDCAD=X",  tv: "FX:AUDCAD",         base: 0.8900,  vol: 0.005, type: "forex"  },
  { label: "AUD/NZD",  value: "AUDNZD",  yf: "AUDNZD=X",  tv: "FX:AUDNZD",         base: 1.0960,  vol: 0.004, type: "forex"  },
  { label: "XAU/USD",  value: "XAUUSD",  yf: "GC=F",      tv: "TVC:GOLD",          base: 3100,    vol: 0.008, type: "commodity" },
  { label: "XAG/USD",  value: "XAGUSD",  yf: "SI=F",      tv: "TVC:SILVER",        base: 34.50,   vol: 0.012, type: "commodity" },
  { label: "WTI Oil",  value: "WTIUSD",  yf: "CL=F",      tv: "TVC:USOIL",         base: 78.50,   vol: 0.015, type: "commodity" },
  { label: "NAS100",   value: "NAS100",  yf: "^NDX",      tv: "NASDAQ:NDX",        base: 21000,   vol: 0.010, type: "index"  },
  { label: "SPX500",   value: "SPX500",  yf: "^GSPC",     tv: "SP:SPX",            base: 5800,    vol: 0.008, type: "index"  },
  { label: "DOW30",    value: "DOW30",   yf: "^DJI",      tv: "DJ:DJI",            base: 43000,   vol: 0.007, type: "index"  },
  // ── Crypto ───────────────────────────────────────────────────
  { label: "BTC/USD",  value: "BTCUSD",  yf: "BTC-USD",   tv: "BINANCE:BTCUSDT",   base: 95000,   vol: 0.030, type: "crypto" },
  { label: "ETH/USD",  value: "ETHUSD",  yf: "ETH-USD",   tv: "BINANCE:ETHUSDT",   base: 3200,    vol: 0.035, type: "crypto" },
  { label: "BNB/USD",  value: "BNBUSD",  yf: "BNB-USD",   tv: "BINANCE:BNBUSDT",   base: 620,     vol: 0.030, type: "crypto" },
  { label: "SOL/USD",  value: "SOLUSD",  yf: "SOL-USD",   tv: "BINANCE:SOLUSDT",   base: 175,     vol: 0.040, type: "crypto" },
  { label: "XRP/USD",  value: "XRPUSD",  yf: "XRP-USD",   tv: "BINANCE:XRPUSDT",   base: 0.62,    vol: 0.045, type: "crypto" },
  { label: "ADA/USD",  value: "ADAUSD",  yf: "ADA-USD",   tv: "BINANCE:ADAUSDT",   base: 0.48,    vol: 0.050, type: "crypto" },
  { label: "AVAX/USD", value: "AVAXUSD", yf: "AVAX-USD",  tv: "BINANCE:AVAXUSDT",  base: 38,      vol: 0.045, type: "crypto" },
  { label: "DOGE/USD", value: "DOGEUSD", yf: "DOGE-USD",  tv: "BINANCE:DOGEUSDT",  base: 0.165,   vol: 0.055, type: "crypto" },
  { label: "LINK/USD", value: "LINKUSD", yf: "LINK-USD",  tv: "BINANCE:LINKUSDT",  base: 17.5,    vol: 0.045, type: "crypto" },
  { label: "DOT/USD",  value: "DOTUSD",  yf: "DOT-USD",   tv: "BINANCE:DOTUSDT",   base: 7.80,    vol: 0.048, type: "crypto" },
  { label: "MATIC/USD",value: "MATICUSD",yf: "MATIC-USD", tv: "BINANCE:MATICUSDT", base: 0.88,    vol: 0.055, type: "crypto" },
  { label: "LTC/USD",  value: "LTCUSD",  yf: "LTC-USD",   tv: "BINANCE:LTCUSDT",   base: 88,      vol: 0.038, type: "crypto" },
  { label: "UNI/USD",  value: "UNIUSD",  yf: "UNI-USD",   tv: "BINANCE:UNIUSDT",   base: 11.2,    vol: 0.050, type: "crypto" },
  { label: "ATOM/USD", value: "ATOMUSD", yf: "ATOM-USD",  tv: "BINANCE:ATOMUSDT",  base: 9.50,    vol: 0.048, type: "crypto" },
  { label: "NEAR/USD", value: "NEARUSD", yf: "NEAR-USD",  tv: "BINANCE:NEARUSDT",  base: 5.80,    vol: 0.052, type: "crypto" },
  { label: "APT/USD",  value: "APTUSD",  yf: "APT-USD",   tv: "BINANCE:APTUSDT",   base: 10.4,    vol: 0.055, type: "crypto" },
  { label: "ARB/USD",  value: "ARBUSD",  yf: "ARB-USD",   tv: "BINANCE:ARBUSDT",   base: 1.05,    vol: 0.060, type: "crypto" },
  { label: "OP/USD",   value: "OPUSD",   yf: "OP-USD",    tv: "BINANCE:OPUSDT",    base: 2.20,    vol: 0.058, type: "crypto" },
  { label: "INJ/USD",  value: "INJUSD",  yf: "INJ-USD",   tv: "BINANCE:INJUSDT",   base: 28,      vol: 0.055, type: "crypto" },
  { label: "SUI/USD",  value: "SUIUSD",  yf: "SUI-USD",   tv: "BINANCE:SUIUSDT",   base: 1.65,    vol: 0.060, type: "crypto" },
  { label: "TIA/USD",  value: "TIAUSD",  yf: "TIA-USD",   tv: "BINANCE:TIAUSDT",   base: 8.20,    vol: 0.065, type: "crypto" },
];

// ─────────────────────────────────────────────────
//  TIMEFRAMES
// ─────────────────────────────────────────────────
export const HTF_TF = [
  { label: "1H",     tv: "60",  yf: "1h",  range: "5d"  },
  { label: "4H",     tv: "240", yf: "1h",  range: "10d" },
  { label: "Daily",  tv: "D",   yf: "1d",  range: "60d" },
  { label: "Weekly", tv: "W",   yf: "1wk", range: "1y"  },
];

export const LTF_TF = [
  { label: "1m",  tv: "1",  yf: "1m",  range: "1d" },
  { label: "5m",  tv: "5",  yf: "5m",  range: "5d" },
  { label: "15m", tv: "15", yf: "15m", range: "5d" },
  { label: "30m", tv: "30", yf: "30m", range: "5d" },
];

// ─────────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────────
export const G = {
  bg:      "#07090e",
  surface: "#0d1117",
  card:    "#111827",
  card2:   "#161f2e",
  border:  "#1e2d45",
  accent:  "#f0b429",
  blue:    "#3d7ff0",
  purple:  "#a78bfa",
  green:   "#22c55e",
  red:     "#ef4444",
  text:    "#e2e8f0",
  sub:     "#94a3b8",
  dim:     "#475569",
  muted:   "#1e293b",
};

// ─────────────────────────────────────────────────
//  TICKER DATA
// ─────────────────────────────────────────────────
export const TICKER_DATA = [
  "EUR/USD  1.08521  +0.12%",  "BTC/USD  94,832  -0.44%",
  "XAU/USD  3,112.40  +0.87%", "GBP/USD  1.27103  +0.09%",
  "NAS100  21,034  +0.33%",    "ETH/USD  3,184  -1.02%",
  "USD/JPY  151.82  -0.07%",   "SPX500  5,823  +0.21%",
  "SOL/USD  175.40  +2.11%",   "CHF/JPY  167.42  +0.04%",
  "XRP/USD  0.6218  -0.33%",   "AUD/USD  0.6521  +0.18%",
  "BNB/USD  621.30  +0.77%",   "XAG/USD  34.52  +1.04%",
];
