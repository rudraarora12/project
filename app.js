/**
 * GROWW DESKTOP WEB APPLICATION
 * 12-Month SIP Retention & Multi-Factor Discovery Screener
 * Integrated with Live AMFI Daily Mutual Fund API (https://api.mfapi.in)
 * Features Real-Time Price Difference Tracking, Auto-Sync Polling, and Historical NAVs
 */

// ============================================================================
// 1. DATASET OF 16 INDIAN MUTUAL FUNDS WITH LIVE AMFI SCHEME CODES
// ============================================================================
const FUNDS_DATA = [
  {
    id: "ppfas-flexi",
    amfiCode: 122639, // Parag Parikh Flexi Cap Fund - Direct Plan - Growth
    name: "Parag Parikh Flexi Cap Fund (Direct-Growth)",
    amc: "PPFAS",
    category: "Flexi Cap",
    sector: "Broad / Diversified",
    horizon: "wealth", // 5+ Years
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 91.40,
    prevNav: 90.70,
    liveNav: 91.40,
    navDiffRupees: 0.70,
    dayChangePct: 0.76,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [
      { date: "04-Nov-2026", nav: 91.40, diff: "+₹0.70 (+0.76%)" },
      { date: "03-Nov-2026", nav: 90.70, diff: "+₹0.96 (+1.07%)" },
      { date: "02-Nov-2026", nav: 89.74, diff: "-₹0.32 (-0.36%)" },
      { date: "31-Oct-2026", nav: 90.06, diff: "+₹0.45 (+0.50%)" },
      { date: "30-Oct-2026", nav: 89.61, diff: "-₹0.15 (-0.17%)" }
    ],
    ter: 0.61, // %
    pe: 28.4,
    pb: 4.1,
    exitLoadType: "quick_exit",
    exitLoadText: "Nil after 365d (2% < 365d)",
    exitDays: 365,
    minSip: 1000,
    downsideDefense: "high", // Downside capture < 85%
    beta: 0.78,
    return3y: 22.4,
    rollingConsistency: 88, // % cycles beating benchmark
    turnover: 18, // %
    aumCr: 64200,
    topHoldings: ["HDFC Bank", "ITC Ltd", "Alphabet Inc", "Bajaj Holdings"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 7",
      expectedDropRange: "-3% to -8%",
      nominalGainM6: "₹380 on ₹6,000 invested",
      psychologyNote: "Parag Parikh holds cash buffers (up to 15%) during overheated market cycles. In months 1 to 6, it may appear slower than momentum funds, but it aggressively cushions market drawdowns in years 2 to 5."
    }
  },
  {
    id: "nippon-small",
    amfiCode: 118778, // Nippon India Small Cap Fund - Direct Plan - Growth Option
    name: "Nippon India Small Cap Fund (Direct-Growth)",
    amc: "Nippon",
    category: "Small Cap",
    sector: "Broad / Diversified",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 199.48,
    prevNav: 197.24,
    liveNav: 199.48,
    navDiffRupees: 2.24,
    dayChangePct: 1.14,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [
      { date: "04-Nov-2026", nav: 199.48, diff: "+₹2.24 (+1.14%)" },
      { date: "03-Nov-2026", nav: 197.24, diff: "+₹1.80 (+0.92%)" },
      { date: "02-Nov-2026", nav: 195.44, diff: "-₹1.10 (-0.56%)" },
      { date: "31-Oct-2026", nav: 196.54, diff: "+₹2.10 (+1.08%)" },
      { date: "30-Oct-2026", nav: 194.44, diff: "-₹0.85 (-0.44%)" }
    ],
    ter: 0.68,
    pe: 32.1,
    pb: 5.2,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 30 days",
    exitDays: 30,
    minSip: 100,
    downsideDefense: "moderate",
    beta: 1.12,
    return3y: 29.8,
    rollingConsistency: 82,
    turnover: 24,
    aumCr: 52100,
    topHoldings: ["Tube Investments", "HDFC Bank", "Apar Industries", "KPIT Tech"],
    realitySim: {
      underwhelmingWindow: "Months 2 to 9",
      expectedDropRange: "-8% to -18%",
      nominalGainM6: "₹520 on ₹6,000 invested",
      psychologyNote: "⚠️ High Volatility Alert: Small caps experience severe temporary swings. If you pause auto-debit during a 10% pullback, you lock in losses and miss compounding rebound phases."
    }
  },
  {
    id: "uti-nifty",
    amfiCode: 120716, // UTI Nifty 50 Index Fund - Direct Plan - Growth
    name: "UTI Nifty 50 Index Fund (Direct-Growth)",
    amc: "UTI",
    category: "Index / ETF",
    sector: "Broad / Diversified",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 168.77,
    prevNav: 168.06,
    liveNav: 168.77,
    navDiffRupees: 0.71,
    dayChangePct: 0.42,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.18,
    pe: 22.6,
    pb: 3.8,
    exitLoadType: "zero_exit",
    exitLoadText: "Zero Exit Load (Nil Penalty)",
    exitDays: 0,
    minSip: 500,
    downsideDefense: "moderate",
    beta: 1.00,
    return3y: 16.8,
    rollingConsistency: 100,
    turnover: 8,
    aumCr: 18400,
    topHoldings: ["HDFC Bank", "Reliance Industries", "ICICI Bank", "Infosys"],
    realitySim: {
      underwhelmingWindow: "Months 1 to 6",
      expectedDropRange: "-2% to -6%",
      nominalGainM6: "₹260 on ₹6,000 invested",
      psychologyNote: "Lowest cost in India (0.18% fee). Captures exact trajectory of India's top 50 giants. Zero fund-manager style drift risk."
    }
  },
  {
    id: "icici-tech",
    amfiCode: 120594, // ICICI Prudential Technology Fund - Direct Plan - Growth
    name: "ICICI Prudential Technology Fund (Direct-Growth)",
    amc: "ICICI",
    category: "Large Cap",
    sector: "Technology / IT",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 208.46,
    prevNav: 209.25,
    liveNav: 208.46,
    navDiffRupees: -0.79,
    dayChangePct: -0.38,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.82,
    pe: 36.2,
    pb: 6.4,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 15 days",
    exitDays: 15,
    minSip: 100,
    downsideDefense: "low",
    beta: 1.18,
    return3y: 26.5,
    rollingConsistency: 74,
    turnover: 42,
    aumCr: 14200,
    topHoldings: ["Infosys", "TCS", "HCL Tech", "Persistent Systems"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 10",
      expectedDropRange: "-10% to -20%",
      nominalGainM6: "₹340 on ₹6,000 invested",
      psychologyNote: "IT sector operates in prolonged multi-quarter valuation digestion cycles. Expect sharp volatility during US interest rate announcements."
    }
  },
  {
    id: "hdfc-bank",
    amfiCode: 148986, // HDFC Banking & Financial Services Fund - Direct Plan - Growth
    name: "HDFC Banking & Financial Services Fund (Direct-Growth)",
    amc: "HDFC",
    category: "Large Cap",
    sector: "Banking & Financial Services",
    horizon: "long", // 3 - 5 Years
    horizonLabel: "3-5Y Horizon",
    baselineNav: 18.42,
    prevNav: 18.32,
    liveNav: 18.42,
    navDiffRupees: 0.10,
    dayChangePct: 0.55,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.54,
    pe: 19.8,
    pb: 2.6,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 30 days",
    exitDays: 30,
    minSip: 500,
    downsideDefense: "high",
    beta: 0.94,
    return3y: 18.2,
    rollingConsistency: 76,
    turnover: 26,
    aumCr: 4120,
    topHoldings: ["ICICI Bank", "HDFC Bank", "State Bank of India", "Axis Bank"],
    realitySim: {
      underwhelmingWindow: "Months 2 to 6",
      expectedDropRange: "-4% to -9%",
      nominalGainM6: "₹290 on ₹6,000 invested",
      psychologyNote: "At 19.8 P/E, banking valuations currently have strong margin of safety. Slower nominal start, but high institutional stability."
    }
  },
  {
    id: "tata-digital",
    amfiCode: 135800, // Tata Digital India Fund - Direct Plan - Growth Option
    name: "Tata Digital India Fund (Direct-Growth)",
    amc: "Tata",
    category: "Large Cap",
    sector: "Technology / IT",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 48.65,
    prevNav: 48.76,
    liveNav: 48.65,
    navDiffRupees: -0.11,
    dayChangePct: -0.22,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.36,
    pe: 38.0,
    pb: 7.1,
    exitLoadType: "quick_exit",
    exitLoadText: "0.25% if redeemed < 30 days",
    exitDays: 30,
    minSip: 100,
    downsideDefense: "low",
    beta: 1.15,
    return3y: 25.4,
    rollingConsistency: 72,
    turnover: 35,
    aumCr: 9800,
    topHoldings: ["TCS", "Infosys", "Coforge", "LTIMindtree"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 8",
      expectedDropRange: "-7% to -15%",
      nominalGainM6: "₹420 on ₹6,000 invested",
      psychologyNote: "Extremely low expense ratio for a sectoral fund (0.36%). High upside in bull runs, requires high emotional resilience."
    }
  },
  {
    id: "sbi-healthcare",
    amfiCode: 119783, // SBI HEALTHCARE OPPORTUNITIES FUND - Direct Plan - Growth
    name: "SBI Healthcare Opportunities Fund (Direct-Growth)",
    amc: "SBI",
    category: "Large Cap",
    sector: "Healthcare & Pharma",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 382.40,
    prevNav: 379.06,
    liveNav: 382.40,
    navDiffRupees: 3.34,
    dayChangePct: 0.88,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.72,
    pe: 31.0,
    pb: 4.5,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 15 days",
    exitDays: 15,
    minSip: 500,
    downsideDefense: "high",
    beta: 0.82,
    return3y: 21.6,
    rollingConsistency: 78,
    turnover: 20,
    aumCr: 3100,
    topHoldings: ["Sun Pharma", "Torrent Pharma", "Lupin", "Alkem Labs"],
    realitySim: {
      underwhelmingWindow: "Months 4 to 7",
      expectedDropRange: "-3% to -7%",
      nominalGainM6: "₹360 on ₹6,000 invested",
      psychologyNote: "Defensive mandate. Excellent complement to equity portfolios to curb overall portfolio drawdown."
    }
  },
  {
    id: "kotak-emerging",
    amfiCode: 120166, // Kotak Flexi Cap / Emerging Fund - Direct Plan - Growth
    name: "Kotak Emerging Equity Fund (Direct-Growth)",
    amc: "Kotak",
    category: "Mid Cap",
    sector: "Broad / Diversified",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 95.06,
    prevNav: 94.46,
    liveNav: 95.06,
    navDiffRupees: 0.60,
    dayChangePct: 0.64,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.52,
    pe: 29.5,
    pb: 4.9,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 365 days",
    exitDays: 365,
    minSip: 500,
    downsideDefense: "high",
    beta: 0.88,
    return3y: 24.6,
    rollingConsistency: 85,
    turnover: 22,
    aumCr: 48200,
    topHoldings: ["Supreme Industries", "Schaeffler India", "Thermax", "Trent Ltd"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 7",
      expectedDropRange: "-5% to -11%",
      nominalGainM6: "₹450 on ₹6,000 invested",
      psychologyNote: "One of the most consistent mid-cap funds over 10+ years. High downside defense compared to category peers."
    }
  },
  {
    id: "icici-bluechip",
    amfiCode: 120586, // ICICI Prudential Large Cap / Bluechip Fund - Direct Plan - Growth
    name: "ICICI Prudential Bluechip Fund (Direct-Growth)",
    amc: "ICICI",
    category: "Large Cap",
    sector: "Broad / Diversified",
    horizon: "long",
    horizonLabel: "3-5Y Horizon",
    baselineNav: 118.02,
    prevNav: 117.61,
    liveNav: 118.02,
    navDiffRupees: 0.41,
    dayChangePct: 0.35,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.62,
    pe: 21.4,
    pb: 3.2,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 365 days",
    exitDays: 365,
    minSip: 100,
    downsideDefense: "high",
    beta: 0.92,
    return3y: 19.1,
    rollingConsistency: 81,
    turnover: 33,
    aumCr: 58300,
    topHoldings: ["ICICI Bank", "Reliance", "L&T", "Bharti Airtel"],
    realitySim: {
      underwhelmingWindow: "Months 2 to 5",
      expectedDropRange: "-3% to -7%",
      nominalGainM6: "₹310 on ₹6,000 invested",
      psychologyNote: "Invests predominantly in top 50 bluechip stalwarts. Very low probability of prolonged drawdown if held for 3+ years."
    }
  },
  {
    id: "hdfc-balanced",
    amfiCode: 118968, // HDFC Balanced Advantage Fund - Direct Plan - Growth
    name: "HDFC Balanced Advantage Fund (Direct-Growth)",
    amc: "HDFC",
    category: "Hybrid / Balanced",
    sector: "Broad / Diversified",
    horizon: "medium", // 1 - 3 Years
    horizonLabel: "1-3Y Horizon",
    baselineNav: 486.20,
    prevNav: 484.84,
    liveNav: 486.20,
    navDiffRupees: 1.36,
    dayChangePct: 0.28,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.74,
    pe: 20.1,
    pb: 2.8,
    exitLoadType: "quick_exit",
    exitLoadText: "Nil after 30 days (1% < 30d)",
    exitDays: 30,
    minSip: 100,
    downsideDefense: "high",
    beta: 0.68,
    return3y: 18.9,
    rollingConsistency: 89,
    turnover: 28,
    aumCr: 86000,
    topHoldings: ["HDFC Bank", "ICICI Bank", "Govt of India Bonds", "L&T"],
    realitySim: {
      underwhelmingWindow: "Months 2 to 4",
      expectedDropRange: "-1.5% to -4%",
      nominalGainM6: "₹295 on ₹6,000 invested",
      psychologyNote: "Dynamic asset allocation shifts dynamically between 35% debt and 65% equity based on market valuation. Ideal for anxious first-timers."
    }
  },
  {
    id: "sbi-liquid",
    amfiCode: 119800, // SBI LIQUID FUND - Direct Plan - Growth
    name: "SBI Liquid Fund (Direct-Growth)",
    amc: "SBI",
    category: "Hybrid / Balanced",
    sector: "Broad / Diversified",
    horizon: "short", // < 1 Year
    horizonLabel: "< 1Y Horizon",
    baselineNav: 3824.50,
    prevNav: 3823.73,
    liveNav: 3824.50,
    navDiffRupees: 0.77,
    dayChangePct: 0.02,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.20,
    pe: 1.0,
    pb: 1.0,
    exitLoadType: "zero_exit",
    exitLoadText: "Zero Exit Load (After 7 days)",
    exitDays: 7,
    minSip: 500,
    downsideDefense: "high",
    beta: 0.02,
    return3y: 7.1,
    rollingConsistency: 99,
    turnover: 10,
    aumCr: 62000,
    topHoldings: ["91D Treasury Bills", "NABARD CP", "HDFC Bank CD"],
    realitySim: {
      underwhelmingWindow: "No Underwhelming Window",
      expectedDropRange: "0.0%",
      nominalGainM6: "₹180 on ₹6,000 invested",
      psychologyNote: "Capital protection vehicle. NAV increases smoothly each day with near-zero principal volatility."
    }
  },
  {
    id: "quant-active",
    amfiCode: 120828, // Quant Active / Small Cap - Direct Plan - Growth
    name: "Quant Active Fund (Direct-Growth)",
    amc: "Quant",
    category: "Flexi Cap",
    sector: "Broad / Diversified",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 308.53,
    prevNav: 304.72,
    liveNav: 308.53,
    navDiffRupees: 3.81,
    dayChangePct: 1.25,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.77,
    pe: 27.8,
    pb: 4.4,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 15 days",
    exitDays: 15,
    minSip: 1000,
    downsideDefense: "moderate",
    beta: 1.05,
    return3y: 27.2,
    rollingConsistency: 80,
    turnover: 85,
    aumCr: 11500,
    topHoldings: ["Reliance", "Jio Financial", "Aurobindo Pharma", "SAIL"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 9",
      expectedDropRange: "-6% to -14%",
      nominalGainM6: "₹460 on ₹6,000 invested",
      psychologyNote: "High momentum, algorithmic reallocation model. High portfolio turnover (85%) means rapid changes in underlying stock holdings."
    }
  },
  {
    id: "dsp-health",
    amfiCode: 145454, // DSP Healthcare Fund - Direct Plan - Growth
    name: "DSP Healthcare Fund (Direct-Growth)",
    amc: "DSP",
    category: "Large Cap",
    sector: "Healthcare & Pharma",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 41.25,
    prevNav: 40.95,
    liveNav: 41.25,
    navDiffRupees: 0.30,
    dayChangePct: 0.72,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.76,
    pe: 34.0,
    pb: 4.9,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 30 days",
    exitDays: 30,
    minSip: 500,
    downsideDefense: "high",
    beta: 0.84,
    return3y: 23.5,
    rollingConsistency: 79,
    turnover: 28,
    aumCr: 2800,
    topHoldings: ["Cipla Ltd", "Sun Pharma", "Dr Reddy's", "Divi's Labs"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 7",
      expectedDropRange: "-3% to -8%",
      nominalGainM6: "₹390 on ₹6,000 invested",
      psychologyNote: "Pharma allocation acts as a non-cyclical shock absorber when consumer demand slows down."
    }
  },
  {
    id: "tata-consumer",
    amfiCode: 135800, // Tata Consumer / Digital proxy
    name: "Tata Consumer Fund (Direct-Growth)",
    amc: "Tata",
    category: "Large Cap",
    sector: "FMCG & Consumer",
    horizon: "long",
    horizonLabel: "3-5Y Horizon",
    baselineNav: 48.65,
    prevNav: 48.47,
    liveNav: 48.65,
    navDiffRupees: 0.18,
    dayChangePct: 0.38,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.46,
    pe: 33.2,
    pb: 5.1,
    exitLoadType: "zero_exit",
    exitLoadText: "Zero Exit Penalty",
    exitDays: 0,
    minSip: 500,
    downsideDefense: "high",
    beta: 0.72,
    return3y: 17.5,
    rollingConsistency: 77,
    turnover: 19,
    aumCr: 1850,
    topHoldings: ["ITC", "Nestle India", "Tata Consumer", "Titan Company"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 6",
      expectedDropRange: "-2% to -6%",
      nominalGainM6: "₹280 on ₹6,000 invested",
      psychologyNote: "FMCG consumption remains resilient regardless of GDP slowdowns. Lowest beta (0.72) in thematic equities."
    }
  },
  {
    id: "bandhan-value",
    amfiCode: 122639, // Bandhan Value proxy
    name: "Bandhan Sterling Value Fund (Direct-Growth)",
    amc: "Bandhan",
    category: "Flexi Cap",
    sector: "Broad / Diversified",
    horizon: "wealth",
    horizonLabel: "5Y+ Min Horizon",
    baselineNav: 91.40,
    prevNav: 90.81,
    liveNav: 91.40,
    navDiffRupees: 0.59,
    dayChangePct: 0.65,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.58,
    pe: 17.4,
    pb: 2.3,
    exitLoadType: "quick_exit",
    exitLoadText: "1% if redeemed < 365 days",
    exitDays: 365,
    minSip: 100,
    downsideDefense: "high",
    beta: 0.89,
    return3y: 23.8,
    rollingConsistency: 84,
    turnover: 25,
    aumCr: 9300,
    topHoldings: ["Jindal Steel", "Axis Bank", "Hero MotoCorp", "Cipla"],
    realitySim: {
      underwhelmingWindow: "Months 3 to 8",
      expectedDropRange: "-4% to -9%",
      nominalGainM6: "₹390 on ₹6,000 invested",
      psychologyNote: "Deep value discipline. P/E of only 17.4 protects investors against valuation compression shocks."
    }
  },
  {
    id: "nippon-auto",
    amfiCode: 118778, // Auto ETF proxy
    name: "Nippon India Nifty Auto ETF Fund (Direct-Growth)",
    amc: "Nippon",
    category: "Large Cap",
    sector: "Auto & Infra",
    horizon: "long",
    horizonLabel: "3-5Y Horizon",
    baselineNav: 199.48,
    prevNav: 197.80,
    liveNav: 199.48,
    navDiffRupees: 1.68,
    dayChangePct: 0.85,
    navDate: "04-Nov-2026",
    isLive: false,
    history5D: [],
    ter: 0.45,
    pe: 24.5,
    pb: 3.9,
    exitLoadType: "quick_exit",
    exitLoadText: "0.25% if redeemed < 15 days",
    exitDays: 15,
    minSip: 100,
    downsideDefense: "moderate",
    beta: 1.08,
    return3y: 28.4,
    rollingConsistency: 75,
    turnover: 14,
    aumCr: 3800,
    topHoldings: ["Tata Motors", "Mahindra & Mahindra", "Maruti Suzuki", "Bajaj Auto"],
    realitySim: {
      underwhelmingWindow: "Months 4 to 8",
      expectedDropRange: "-5% to -12%",
      nominalGainM6: "₹440 on ₹6,000 invested",
      psychologyNote: "Automotive sector is cyclical. High correlation with consumer demand cycles and festive season sales."
    }
  }
];

// ============================================================================
// 1B. OFFICIAL SEBI RISK-O-METER REGULATORY BASELINE MAPPING
// (SEBI/HO/IMD/DF3/CIR/P/2020/197 - 6-Tier Product Risk Labeling Standard)
// ============================================================================
const RISK_BASELINE_MAP = {
  "ppfas-flexi": {
    sebiRisk: "High",
    sebiRiskLabel: "HIGH RISK",
    sebiRiskClass: "high",
    sebiRiskScore: 4.8,
    sebiBenchmark: "NIFTY 500 TRI",
    sebiBenchmarkRisk: "High Risk",
    statVol: 13.8,
    beta: 0.78,
    sharpe: 1.28,
    sortino: 2.10,
    maxDrawdown: -12.4,
    var95: -1.42,
    downsideCapture: 74,
    riskDescription: "Parag Parikh Flexi Cap Fund invests predominantly in large and mid-sized blue chips with a selective overseas allocation. It carries an official SEBI rating of High Risk due to equity market volatility. However, its conservative cash allocation and deep margin-of-safety value philosophy provide superior downside cushion during severe market corrections."
  },
  "nippon-small": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.9,
    sebiBenchmark: "NIFTY Smallcap 250 TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 18.6,
    beta: 1.12,
    sharpe: 1.42,
    sortino: 2.25,
    maxDrawdown: -19.8,
    var95: -1.95,
    downsideCapture: 94,
    riskDescription: "Nippon India Small Cap Fund holds small-cap growth leaders with market capitalizations under ₹20,000 Cr. Small caps undergo intense temporary drawdowns (-10% to -20%) during economic pullbacks, giving it a SEBI rating of Very High Risk. Ideal for aggressive 5Y+ compounding."
  },
  "uti-nifty": {
    sebiRisk: "High",
    sebiRiskLabel: "HIGH RISK",
    sebiRiskClass: "high",
    sebiRiskScore: 4.6,
    sebiBenchmark: "NIFTY 50 TRI",
    sebiBenchmarkRisk: "High Risk",
    statVol: 14.2,
    beta: 1.00,
    sharpe: 0.95,
    sortino: 1.55,
    maxDrawdown: -14.6,
    var95: -1.50,
    downsideCapture: 100,
    riskDescription: "UTI Nifty 50 Index Fund passively mirrors the top 50 corporate giants of India with near-zero tracking error and lowest fee (0.18%). Carries a High Risk SEBI rating due to 100% equity market exposure, but eliminates fund manager style drift."
  },
  "icici-tech": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.8,
    sebiBenchmark: "S&P BSE Teck TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 21.4,
    beta: 1.18,
    sharpe: 1.15,
    sortino: 1.70,
    maxDrawdown: -24.2,
    var95: -2.35,
    downsideCapture: 112,
    riskDescription: "Concentrated thematic mandate investing in IT services, cloud providers, and digital software. Sectoral concentration exposes investors to global tech cycles and US interest rate policies, warranting a SEBI Very High Risk rating."
  },
  "hdfc-bank": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.4,
    sebiBenchmark: "NIFTY Financial Services TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 16.8,
    beta: 0.94,
    sharpe: 0.88,
    sortino: 1.45,
    maxDrawdown: -16.5,
    var95: -1.72,
    downsideCapture: 88,
    riskDescription: "High-conviction sectoral exposure to private & public sector banks, NBFCs, and insurance giants. At a moderate 19.8 P/E, banking valuations provide safety, though sectoral concentration keeps SEBI classification at Very High."
  },
  "tata-digital": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.8,
    sebiBenchmark: "NIFTY IT TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 20.9,
    beta: 1.15,
    sharpe: 1.10,
    sortino: 1.68,
    maxDrawdown: -23.8,
    var95: -2.28,
    downsideCapture: 110,
    riskDescription: "Low expense ratio sectoral IT fund (0.36%). High upside in bull runs but exhibits sharp cyclical volatility during global demand slowdowns."
  },
  "sbi-healthcare": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.3,
    sebiBenchmark: "S&P BSE Healthcare TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 15.2,
    beta: 0.82,
    sharpe: 1.18,
    sortino: 1.85,
    maxDrawdown: -13.2,
    var95: -1.48,
    downsideCapture: 81,
    riskDescription: "Non-cyclical defensive thematic fund investing in domestic pharma, diagnostics, and hospitals. Provides lower beta (0.82) than typical equities but classified as Very High Risk due to single-sector focus."
  },
  "kotak-emerging": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.6,
    sebiBenchmark: "NIFTY Midcap 150 TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 16.5,
    beta: 0.88,
    sharpe: 1.30,
    sortino: 2.05,
    maxDrawdown: -15.8,
    var95: -1.68,
    downsideCapture: 82,
    riskDescription: "One of India's most consistent mid-cap wealth generators over 10+ years. High downside defense compared to category peers, but mid-cap growth exposure commands a SEBI Very High Risk rating."
  },
  "icici-bluechip": {
    sebiRisk: "High",
    sebiRiskLabel: "HIGH RISK",
    sebiRiskClass: "high",
    sebiRiskScore: 4.7,
    sebiBenchmark: "NIFTY 100 TRI",
    sebiBenchmarkRisk: "High Risk",
    statVol: 13.9,
    beta: 0.92,
    sharpe: 1.05,
    sortino: 1.62,
    maxDrawdown: -13.8,
    var95: -1.45,
    downsideCapture: 89,
    riskDescription: "Invests exclusively in the top 100 bluechip titans of India. Lower volatility than broader indices and high institutional stability. SEBI rating: High Risk."
  },
  "hdfc-balanced": {
    sebiRisk: "Moderately High",
    sebiRiskLabel: "MOD-HIGH RISK",
    sebiRiskClass: "mod-high",
    sebiRiskScore: 3.8,
    sebiBenchmark: "NIFTY 50 Hybrid Composite Debt 50:50",
    sebiBenchmarkRisk: "Moderately High Risk",
    statVol: 9.8,
    beta: 0.68,
    sharpe: 1.45,
    sortino: 2.40,
    maxDrawdown: -8.5,
    var95: -0.98,
    downsideCapture: 58,
    riskDescription: "Dynamic asset allocation automatically rebalances between debt bonds (up to 35%) and equities based on market valuation. Drops only 58% when markets tumble, earning an optimal Moderately High SEBI rating."
  },
  "sbi-liquid": {
    sebiRisk: "Low",
    sebiRiskLabel: "LOW RISK",
    sebiRiskClass: "low",
    sebiRiskScore: 1.1,
    sebiBenchmark: "CRISIL Liquid Debt Index",
    sebiBenchmarkRisk: "Low Risk",
    statVol: 0.4,
    beta: 0.02,
    sharpe: 2.20,
    sortino: 4.50,
    maxDrawdown: -0.05,
    var95: -0.02,
    downsideCapture: 1,
    riskDescription: "Invests in 91-day Government Treasury bills and high-grade corporate commercial papers. Near-zero volatility and continuous daily accrual. Official SEBI rating: Low Risk."
  },
  "quant-active": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.7,
    sebiBenchmark: "NIFTY 500 TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 18.2,
    beta: 1.05,
    sharpe: 1.35,
    sortino: 2.12,
    maxDrawdown: -18.2,
    var95: -1.88,
    downsideCapture: 96,
    riskDescription: "High-momentum algorithmic macro reallocation model with high portfolio turnover (85%). Generates strong alpha in bull phases but requires emotional resilience during sharp market swings."
  },
  "dsp-health": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.3,
    sebiBenchmark: "S&P BSE Healthcare TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 15.4,
    beta: 0.84,
    sharpe: 1.20,
    sortino: 1.88,
    maxDrawdown: -13.5,
    var95: -1.50,
    downsideCapture: 82,
    riskDescription: "Pharma and diagnostics healthcare mandate acting as a defensive shock absorber when domestic consumer demand softens."
  },
  "tata-consumer": {
    sebiRisk: "High",
    sebiRiskLabel: "HIGH RISK",
    sebiRiskClass: "high",
    sebiRiskScore: 4.5,
    sebiBenchmark: "NIFTY India Consumption TRI",
    sebiBenchmarkRisk: "High Risk",
    statVol: 12.8,
    beta: 0.72,
    sharpe: 1.02,
    sortino: 1.65,
    maxDrawdown: -11.9,
    var95: -1.35,
    downsideCapture: 68,
    riskDescription: "FMCG consumption portfolio resilient across business cycles. Exhibits low beta (0.72) and consistent cash flows. SEBI rating: High Risk."
  },
  "bandhan-value": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.2,
    sebiBenchmark: "S&P BSE 500 TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 15.9,
    beta: 0.89,
    sharpe: 1.22,
    sortino: 1.92,
    maxDrawdown: -14.2,
    var95: -1.62,
    downsideCapture: 84,
    riskDescription: "Deep value discipline. P/E of only 17.4 protects investors against valuation compression shocks, earning high risk-adjusted ratings."
  },
  "nippon-auto": {
    sebiRisk: "Very High",
    sebiRiskLabel: "VERY HIGH RISK",
    sebiRiskClass: "very-high",
    sebiRiskScore: 5.8,
    sebiBenchmark: "NIFTY Auto TRI",
    sebiBenchmarkRisk: "Very High Risk",
    statVol: 19.5,
    beta: 1.08,
    sharpe: 1.28,
    sortino: 1.95,
    maxDrawdown: -20.4,
    var95: -2.05,
    downsideCapture: 104,
    riskDescription: "Automotive sector ETF tracking passenger vehicle, EV, and commercial auto manufacturers. Cyclical exposure with high correlation to festive sales."
  }
};

// Merge SEBI risk metrics into FUNDS_DATA
FUNDS_DATA.forEach(fund => {
  const meta = RISK_BASELINE_MAP[fund.id] || {
    sebiRisk: "High",
    sebiRiskLabel: "HIGH RISK",
    sebiRiskClass: "high",
    sebiRiskScore: 4.8,
    sebiBenchmark: "NIFTY 500 TRI",
    sebiBenchmarkRisk: "High Risk",
    statVol: 14.5,
    beta: fund.beta || 1.0,
    sharpe: 1.10,
    sortino: 1.75,
    maxDrawdown: -14.0,
    var95: -1.60,
    downsideCapture: 85,
    riskDescription: "Broad diversified equity fund subject to market volatility. Standard SEBI High Risk rating."
  };
  Object.assign(fund, meta);
});

// ============================================================================
// 2. STATE MANAGEMENT
// ============================================================================
// ============================================================================
// REAL INDIAN STOCKS DATABASE: RISK & WHEN-TO-BUY TIMING INTELLIGENCE
// ============================================================================
const STOCKS_DATA = [
  {
    id: "reliance",
    name: "Reliance Industries Ltd.",
    ticker: "NSE: RELIANCE",
    sector: "Energy & Conglomerate",
    cap: "Mega Cap",
    logo: "RE",
    cmp: 1245.50,
    change: "+14.20 (+1.15%)",
    isPositive: true,
    desc: "India's premier corporate titan dominating telecom (Jio), retail, petrochemicals, and renewable green energy.",
    riskScore: 42,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "Balanced Mega-Cap Stability",
    riskSummary: "Enjoys unrivaled domestic scale, diversified cash flows across retail and digital telecom, with prudent leverage discipline. Downside is heavily cushioned by cash generation.",
    beta: 0.92,
    betaLabel: "0.92x (Defensive vs Nifty)",
    betaWidth: 46,
    volatility: "18.4% (Lower than Nifty 50)",
    volWidth: 40,
    peRatio: 24.2,
    peLabel: "24.2 vs Sector 28.0 (Fair Value)",
    peWidth: 50,
    debtLabel: "D/E 0.38 (Safe Balance Sheet)",
    debtWidth: 32,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (BUY NOW)",
    verdictConfidence: "High Confidence (88%)",
    verdictReason: "Current price is consolidating inside the institutional demand base between ₹1,220–₹1,255. Both 50-DMA and 200-DMA offer multi-layered support with favorable risk:reward.",
    buyRange: "₹1,220 – ₹1,255",
    cmpStatus: "In Buy Zone (+0.8% of floor)",
    support1: "₹1,210.00",
    hintSupport1: "50-DMA Dip Accumulation",
    support2: "₹1,155.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹1,118.00",
    hintStopLoss: "Capital Cutoff (-10.2%)",
    targets: "₹1,385 / ₹1,520",
    target1: "₹1,385.00",
    upside: "+11.2% / +22.0%",
    rrRatio: "1 : 3.4 (Superior)",
    rsi: 45.2,
    rsiStatus: "45.2 • Neutral Accumulation",
    trancheHeading: "Deploy in 2 Staggered Tranches (40% / 60%)",
    trancheDesc: "Allocate 40% capital at current price (₹1,245.50). Reserve the remaining 60% to aggressively average down if market turbulence pushes price towards 50-DMA Support (₹1,210).",
    high52: "₹1,328.00",
    drawdown: "-6.2% from Peak (Low Risk)",
    low52: "₹1,020.00",
    cushion: "+22.1% above 52W floor",
    peVal: "24.2x",
    peMedian: "5Y Median: 26.5x (At Discount)",
    pbVal: "2.18x",
    bookVal: "Book Value: ₹571.20 / share",
    roeVal: "14.8%",
    roceVal: "ROCE: 16.2% (Strong Efficiency)",
    instHolding: "84.6%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.38x",
    intCover: "Coverage: 8.4x (High Solvency)",
    divYieldVal: "0.85%",
    payoutVal: "Annual Dividend: ₹10.00 / share",
    basePrice: 1245.50,
    minZone: 1220,
    maxZone: 1255,
    supLevel: 1155,
    tarLevel: 1385
  },
  {
    id: "tatamotors",
    name: "Tata Motors Ltd.",
    ticker: "NSE: TATAMOTORS",
    sector: "Automobile & EV",
    cap: "Large Cap",
    logo: "TM",
    cmp: 785.40,
    change: "-8.60 (-1.08%)",
    isPositive: false,
    desc: "India's electric mobility pioneer and commercial vehicle giant, encompassing British luxury maker Jaguar Land Rover (JLR).",
    riskScore: 68,
    riskTier: "high",
    riskTierLabel: "High Risk (Cyclical)",
    riskSummaryHeading: "High Beta Auto Cyclical",
    riskSummary: "Exposed to global luxury EV cycles, UK/EU tariff dynamics, and domestic commercial vehicle demand. Volatility is elevated, but balance sheet deleveraging is near complete.",
    beta: 1.34,
    betaLabel: "1.34x (High Swings vs Nifty)",
    betaWidth: 68,
    volatility: "26.8% (Higher Volatility)",
    volWidth: 65,
    peRatio: 11.2,
    peLabel: "11.2 vs Sector 21.0 (Deep Value)",
    peWidth: 35,
    debtLabel: "D/E 0.52 (Substantially Reduced)",
    debtWidth: 42,
    verdictType: "buy-dips",
    verdictBadge: "Buy On Dips",
    verdictTitle: "BUY ON DIPS (STAGGERED ACCUMULATION)",
    verdictConfidence: "High Confidence (82%)",
    verdictReason: "Stock is testing immediate support after healthy profit booking from ₹830 highs. Excellent entry for 2-3 year compounding as JLR net cash target materializes.",
    buyRange: "₹750 – ₹780",
    cmpStatus: "Near Upper Buy Edge (+0.7%)",
    support1: "₹760.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹710.00",
    hintSupport2: "200-DMA Demand Fortress",
    stopLoss: "₹685.00",
    hintStopLoss: "Safety Cutoff (-12.8%)",
    targets: "₹920 / ₹1,050",
    target1: "₹920.00",
    upside: "+17.1% / +33.7%",
    rrRatio: "1 : 2.9 (Attractive)",
    rsi: 41.8,
    rsiStatus: "41.8 • Approaching Oversold",
    trancheHeading: "Deploy 30% Now, 70% at Support",
    trancheDesc: "Enter 30% tranche at ₹785. Keep 70% in reserves to aggressively deploy if global auto sentiment drags price towards ₹750–₹760 support zone.",
    high52: "₹838.00",
    drawdown: "-6.3% from Peak",
    low52: "₹593.00",
    cushion: "+32.4% above 52W floor",
    peVal: "11.2x",
    peMedian: "5Y Median: 18.0x (Deep Value)",
    pbVal: "2.45x",
    bookVal: "Book Value: ₹320.50 / share",
    roeVal: "23.4%",
    roceVal: "ROCE: 19.8% (Exceptional Return)",
    instHolding: "68.2%",
    pledgeVal: "1.2% Pledge (Negligible)",
    debtEqVal: "0.52x",
    intCover: "Coverage: 6.8x (Improving)",
    divYieldVal: "0.76%",
    payoutVal: "Annual Dividend: ₹6.00 / share",
    basePrice: 785.40,
    minZone: 750,
    maxZone: 780,
    supLevel: 710,
    tarLevel: 920
  },
  {
    id: "hdfcbank",
    name: "HDFC Bank Ltd.",
    ticker: "NSE: HDFCBANK",
    sector: "Banking & Financials",
    cap: "Mega Cap",
    logo: "HD",
    cmp: 1748.20,
    change: "+18.80 (+1.09%)",
    isPositive: true,
    desc: "India's largest private sector bank and mortgage behemoth following the historic merger with HDFC Limited.",
    riskScore: 28,
    riskTier: "low",
    riskTierLabel: "Low Risk (Bluechip Fortress)",
    riskSummaryHeading: "Institutional Banking Pillar",
    riskSummary: "Unblemished credit underwriting track record over 3 decades. Gross NPAs under 1.35%, massive CASA deposit franchise, and industry-leading return on assets.",
    beta: 0.88,
    betaLabel: "0.88x (Defensive Moat)",
    betaWidth: 38,
    volatility: "16.1% (Rock Solid Stability)",
    volWidth: 32,
    peRatio: 18.9,
    peLabel: "18.9 vs 10Y Median 24.5 (Historical Discount)",
    peWidth: 40,
    debtLabel: "CAR 19.8% (Massive Capital Buffer)",
    debtWidth: 20,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "STRONG CONVICTION BUY (VALUE SWEET SPOT)",
    verdictConfidence: "Very High Confidence (92%)",
    verdictReason: "Trading at its lowest valuation multiples in 8 years despite steady credit growth. CD ratio is normalizing rapidly, creating textbook accumulation setup for retail and FIIs.",
    buyRange: "₹1,710 – ₹1,760",
    cmpStatus: "Inside Prime Band (Ideal Entry)",
    support1: "₹1,715.00",
    hintSupport1: "50-DMA Base Level",
    support2: "₹1,640.00",
    hintSupport2: "Major Multi-Year Support",
    stopLoss: "₹1,580.00",
    hintStopLoss: "Hard Risk Stop (-9.6%)",
    targets: "₹1,980 / ₹2,200",
    target1: "₹1,980.00",
    upside: "+13.3% / +25.8%",
    rrRatio: "1 : 3.8 (Outstanding)",
    rsi: 48.5,
    rsiStatus: "48.5 • Healthy Neutral Momentum",
    trancheHeading: "Deploy 60% Upfront, 40% on Dips",
    trancheDesc: "Because valuation is near multi-year troughs, deploy 60% of target capital immediately. Hold 40% to add on any macro rate decision volatility.",
    high52: "₹1,794.00",
    drawdown: "-2.6% from Peak (Very Resilient)",
    low52: "₹1,363.00",
    cushion: "+28.2% above 52W floor",
    peVal: "18.9x",
    peMedian: "10Y Median: 24.5x (At 23% Discount)",
    pbVal: "2.62x",
    bookVal: "Book Value: ₹667.10 / share",
    roeVal: "16.5%",
    roceVal: "ROA: 1.95% (Top Decile In Banking)",
    instHolding: "82.1%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "CAR 19.8%",
    intCover: "NIM: 3.52% (Expanding Margins)",
    divYieldVal: "1.12%",
    payoutVal: "Annual Dividend: ₹19.50 / share",
    basePrice: 1748.20,
    minZone: 1710,
    maxZone: 1760,
    supLevel: 1640,
    tarLevel: 1980
  },
  {
    id: "tcs",
    name: "Tata Consultancy Services Ltd.",
    ticker: "NSE: TCS",
    sector: "Information Technology",
    cap: "Mega Cap",
    logo: "TC",
    cmp: 4120.00,
    change: "+24.50 (+0.60%)",
    isPositive: true,
    desc: "India's highest valued IT exporter, generating unmatched free cash flows with zero debt and continuous capital return via buybacks.",
    riskScore: 24,
    riskTier: "low",
    riskTierLabel: "Low Risk (Defensive Cash Cow)",
    riskSummaryHeading: "Pristine Balance Sheet & Monopolistic Moat",
    riskSummary: "Zero long-term debt, industry-leading operating margin (~24.5%), dividend payout ratio exceeding 80%, and global tier-1 enterprise partnerships.",
    beta: 0.76,
    betaLabel: "0.76x (Very Low Volatility)",
    betaWidth: 28,
    volatility: "14.2% (Benchmark Defense)",
    volWidth: 26,
    peRatio: 29.5,
    peLabel: "29.5 vs Sector 31.2 (Fair)",
    peWidth: 55,
    debtLabel: "Zero Debt (Pristine Cash Pile)",
    debtWidth: 10,
    verdictType: "buy-dips",
    verdictBadge: "Buy On Dips",
    verdictTitle: "BUY ON MILD PULLBACKS",
    verdictConfidence: "High Confidence (85%)",
    verdictReason: "Trading near upper boundary after quarterly earnings. Patient investors should wait for mild pullback towards ₹4,020–₹4,080 for prime risk-reward entry.",
    buyRange: "₹4,000 – ₹4,080",
    cmpStatus: "Slightly Above Ideal Zone (+1.0%)",
    support1: "₹4,020.00",
    hintSupport1: "50-DMA Accumulation Level",
    support2: "₹3,880.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹3,750.00",
    hintStopLoss: "Capital Protection (-9.0%)",
    targets: "₹4,550 / ₹4,800",
    target1: "₹4,550.00",
    upside: "+10.4% / +16.5%",
    rrRatio: "1 : 2.8 (Solid)",
    rsi: 54.2,
    rsiStatus: "54.2 • Neutral Sideways",
    trancheHeading: "Wait for 2% Dip or Enter 25%",
    trancheDesc: "Start with a light 25% starter position at CMP. Place GTT buy orders at ₹4,040 and ₹3,950 for the remaining 75% capital.",
    high52: "₹4,585.00",
    drawdown: "-10.1% from Peak",
    low52: "₹3,650.00",
    cushion: "+12.9% above 52W floor",
    peVal: "29.5x",
    peMedian: "5Y Median: 30.2x (In Line)",
    pbVal: "14.2x",
    bookVal: "Book Value: ₹289.40 / share",
    roeVal: "48.6%",
    roceVal: "ROCE: 62.4% (Phenomenal Efficiency)",
    instHolding: "88.4%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.00x",
    intCover: "Net Cash: ₹42,000+ Cr Reserve",
    divYieldVal: "1.82%",
    payoutVal: "Annual Dividend: ₹75.00 / share",
    basePrice: 4120.00,
    minZone: 4000,
    maxZone: 4080,
    supLevel: 3880,
    tarLevel: 4550
  },
  {
    id: "zomato",
    name: "Zomato Ltd.",
    ticker: "NSE: ZOMATO",
    sector: "Consumer Internet & Quick Commerce",
    cap: "Large Cap",
    logo: "ZO",
    cmp: 268.50,
    change: "+6.80 (+2.60%)",
    isPositive: true,
    desc: "Market leader in food delivery and runaway hyper-growth quick commerce (Blinkit), rapidly compounding EBITDA profitability.",
    riskScore: 74,
    riskTier: "high",
    riskTierLabel: "High Risk (High Growth)",
    riskSummaryHeading: "Hyper-Growth Quick Commerce Disrupter",
    riskSummary: "Blinkit quick-commerce GMV is exploding at 100%+ YoY. However, premium forward valuation multiples and ruthless competitive land-grab make it prone to sharp corrections.",
    beta: 1.48,
    betaLabel: "1.48x (Aggressive Swings)",
    betaWidth: 76,
    volatility: "34.5% (High Cyclical Momentum)",
    volWidth: 78,
    peRatio: 118.0,
    peLabel: "118x Forward (Hyper-Growth Premium)",
    peWidth: 85,
    debtLabel: "Zero Debt / ₹12,000 Cr Net Cash",
    debtWidth: 12,
    verdictType: "wait-pullback",
    verdictBadge: "Wait For Pullback",
    verdictTitle: "WAIT FOR PULLBACK (DO NOT CHASE AT PEAK)",
    verdictConfidence: "High Confidence (86%)",
    verdictReason: "14-Day RSI is hovering near 66 after a rapid multi-month rally. Chasing here carries poor risk-reward. Wait for healthy consolidation towards ₹240–₹252.",
    buyRange: "₹240 – ₹252",
    cmpStatus: "Above Buy Zone (+6.5% - Wait)",
    support1: "₹248.00",
    hintSupport1: "50-DMA Consolidation Band",
    support2: "₹215.00",
    hintSupport2: "200-DMA Demand Line",
    stopLoss: "₹228.00",
    hintStopLoss: "Tight Trail Stop (-15.1%)",
    targets: "₹320 / ₹380",
    target1: "₹320.00",
    upside: "+19.2% / +41.5%",
    rrRatio: "1 : 2.4 (Conditional on Dip)",
    rsi: 65.8,
    rsiStatus: "65.8 • Approaching Overbought",
    trancheHeading: "Wait or Allocate Max 20%",
    trancheDesc: "Do not FOMO invest lumpsum capital. Set price alerts at ₹250. If eager, take a token 20% position and preserve 80% dry powder for a broader market shakeout.",
    high52: "₹298.00",
    drawdown: "-9.9% from Peak",
    low52: "₹118.00",
    cushion: "+127% from 52W floor",
    peVal: "118x",
    peMedian: "High Growth P/S: 12.5x",
    pbVal: "8.90x",
    bookVal: "Book Value: ₹30.15 / share",
    roeVal: "9.2%",
    roceVal: "EBITDA Margin: Inflecting Positive",
    instHolding: "72.4%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.00x",
    intCover: "Net Cash: Massive Warchest",
    divYieldVal: "0.00%",
    payoutVal: "Reinvesting All Cash for Growth",
    basePrice: 268.50,
    minZone: 240,
    maxZone: 252,
    supLevel: 215,
    tarLevel: 320
  },
  {
    id: "sbin",
    name: "State Bank of India",
    ticker: "NSE: SBIN",
    sector: "Public Sector Banking",
    cap: "Mega Cap",
    logo: "SB",
    cmp: 818.00,
    change: "+9.20 (+1.14%)",
    isPositive: true,
    desc: "India's largest public sector bank commanding 24% credit market share, with historic clean balance sheet and lowest cost of funds.",
    riskScore: 38,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "Sovereign-Backed Corporate Engine",
    riskSummary: "Enjoying the strongest credit metrics in its 70-year history with ROA sustained above 1.0% and Net NPAs at multi-decade lows of 0.57%.",
    beta: 1.15,
    betaLabel: "1.15x (Moderate Beta)",
    betaWidth: 55,
    volatility: "21.2% (Standard Bank Swings)",
    volWidth: 48,
    peRatio: 10.4,
    peLabel: "10.4 vs Private Banks 18.0 (Undervalued)",
    peWidth: 32,
    debtLabel: "CAR 14.2% (Comfortable Buffer)",
    debtWidth: 35,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (BUY NOW)",
    verdictConfidence: "High Confidence (90%)",
    verdictReason: "Trading at an attractive 1.3x 1Y forward book value with robust loan growth pipeline across corporate infra capex and retail home loans.",
    buyRange: "₹800 – ₹825",
    cmpStatus: "In Buy Zone (Prime Value)",
    support1: "₹805.00",
    hintSupport1: "50-DMA Strong Base",
    support2: "₹760.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹740.00",
    hintStopLoss: "Safety Cutoff (-9.5%)",
    targets: "₹950 / ₹1,080",
    target1: "₹950.00",
    upside: "+16.1% / +32.0%",
    rrRatio: "1 : 3.5 (Excellent)",
    rsi: 49.0,
    rsiStatus: "49.0 • Balanced Accumulation",
    trancheHeading: "Deploy 50% Now, 50% on Dips",
    trancheDesc: "Deploy 50% capital at CMP. Add remaining 50% around ₹800 support level to capture full upside toward ₹950 target.",
    high52: "₹912.00",
    drawdown: "-10.3% from Peak",
    low52: "₹630.00",
    cushion: "+29.8% above 52W floor",
    peVal: "10.4x",
    peMedian: "5Y Median: 11.2x (Attractive)",
    pbVal: "1.38x",
    bookVal: "Book Value: ₹592.00 / share",
    roeVal: "18.2%",
    roceVal: "ROA: 1.05% (Historic Peak Performance)",
    instHolding: "82.5%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "CAR 14.2%",
    intCover: "Gross NPA: 2.13% (Multi-Year Low)",
    divYieldVal: "1.68%",
    payoutVal: "Annual Dividend: ₹13.70 / share",
    basePrice: 818.00,
    minZone: 800,
    maxZone: 825,
    supLevel: 760,
    tarLevel: 950
  },
  {
    id: "itc",
    name: "ITC Ltd.",
    ticker: "NSE: ITC",
    sector: "FMCG, Cigarettes & Hotels",
    cap: "Mega Cap",
    logo: "IT",
    cmp: 472.30,
    change: "+1.90 (+0.40%)",
    isPositive: true,
    desc: "India's highest dividend paying defensive fortress with dominant 80% cigarette market share and rapid FMCG scale.",
    riskScore: 22,
    riskTier: "low",
    riskTierLabel: "Low Risk (Defensive Cash Fortress)",
    riskSummaryHeading: "Monopolistic Cash Generator & High Dividend",
    riskSummary: "Virtually zero debt, massive free cash flows, 3.2% dividend yield, and unassailable pricing power that protects margins against inflation.",
    beta: 0.65,
    betaLabel: "0.65x (Lowest Beta in Nifty)",
    betaWidth: 20,
    volatility: "13.8% (Ultra Defensive)",
    volWidth: 22,
    peRatio: 26.8,
    peLabel: "26.8 vs FMCG Peers 45+ (Deep Discount)",
    peWidth: 42,
    debtLabel: "Zero Debt (Huge Treasury)",
    debtWidth: 8,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION FOR DEFENSIVE WEALTH",
    verdictConfidence: "Very High Confidence (93%)",
    verdictReason: "Hotel business demerger unlock is on track. Valuation remains substantially cheaper than traditional FMCG peers with a generous 3%+ yield floor.",
    buyRange: "₹465 – ₹478",
    cmpStatus: "In Sweet Spot (Safe Accumulation)",
    support1: "₹465.00",
    hintSupport1: "50-DMA Strong Base",
    support2: "₹445.00",
    hintSupport2: "200-DMA Demand Line",
    stopLoss: "₹435.00",
    hintStopLoss: "Risk Stop (-7.9%)",
    targets: "₹540 / ₹600",
    target1: "₹540.00",
    upside: "+14.3% / +27.0%",
    rrRatio: "1 : 3.6 (Superior)",
    rsi: 46.2,
    rsiStatus: "46.2 • Safe Accumulation Band",
    trancheHeading: "Accumulate Aggressively in 1 or 2 Tranches",
    trancheDesc: "Deploy 50% right away. Use any temporary tobacco tax noise in the Union Budget as a golden buying opportunity to deploy remaining 50%.",
    high52: "₹528.00",
    drawdown: "-10.5% from Peak",
    low52: "₹399.00",
    cushion: "+18.4% above 52W floor",
    peVal: "26.8x",
    peMedian: "5Y Median: 24.5x (Fair Value)",
    pbVal: "7.80x",
    bookVal: "Book Value: ₹60.50 / share",
    roeVal: "29.4%",
    roceVal: "ROCE: 38.5% (Exceptional Cash Flow)",
    instHolding: "85.2%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.00x",
    intCover: "Net Cash: Massive Treasury Reserves",
    divYieldVal: "3.18%",
    payoutVal: "Annual Dividend: ₹15.00 / share",
    basePrice: 472.30,
    minZone: 465,
    maxZone: 478,
    supLevel: 445,
    tarLevel: 540
  },
  {
    id: "lt",
    name: "Larsen & Toubro Ltd.",
    ticker: "NSE: LT",
    sector: "Infrastructure & Engineering",
    cap: "Mega Cap",
    logo: "LT",
    cmp: 3560.00,
    change: "+38.00 (+1.08%)",
    isPositive: true,
    desc: "National infrastructure titan with an unprecedented ₹5,00,000+ Crore order book spanning rail, defence, green hydrogen, and semiconductors.",
    riskScore: 36,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "National Capex Engine",
    riskSummary: "Direct proxy for India's multi-decade infrastructure upgrade and Middle-East hydrocarbon capex. Order inflow visibility extends beyond 4 years.",
    beta: 1.05,
    betaLabel: "1.05x (Market Tracking)",
    betaWidth: 50,
    volatility: "19.5% (Steady Industrial)",
    volWidth: 44,
    peRatio: 33.2,
    peLabel: "33.2 vs Sector 36.0 (Fair)",
    peWidth: 56,
    debtLabel: "D/E 0.68 (Core D/E under 0.25x)",
    debtWidth: 40,
    verdictType: "buy-dips",
    verdictBadge: "Buy On Dips",
    verdictTitle: "BUY ON DIPS (CORE INFRA ACCUMULATION)",
    verdictConfidence: "High Confidence (87%)",
    verdictReason: "Order book momentum is unassailable. Wait for mild pullback towards 50-DMA support around ₹3,480–₹3,520 for top tier risk-adjusted entry.",
    buyRange: "₹3,460 – ₹3,530",
    cmpStatus: "Near Upper Bound (+0.9%)",
    support1: "₹3,480.00",
    hintSupport1: "50-DMA Key Support",
    support2: "₹3,320.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹3,250.00",
    hintStopLoss: "Cutoff Stop (-8.7%)",
    targets: "₹4,100 / ₹4,500",
    target1: "₹4,100.00",
    upside: "+15.2% / +26.4%",
    rrRatio: "1 : 3.1 (Strong)",
    rsi: 52.4,
    rsiStatus: "52.4 • Balanced Momentum",
    trancheHeading: "Deploy 35% Now, 65% on Dip",
    trancheDesc: "Take a 35% starter position at CMP. Place limit orders near ₹3,480 for the remaining 65% to benefit from standard monthly market swings.",
    high52: "₹3,948.00",
    drawdown: "-9.8% from Peak",
    low52: "₹2,980.00",
    cushion: "+19.5% above 52W floor",
    peVal: "33.2x",
    peMedian: "5Y Median: 31.0x (Slight Premium)",
    pbVal: "4.85x",
    bookVal: "Book Value: ₹734.00 / share",
    roeVal: "15.4%",
    roceVal: "ROCE: 18.2% (Strong Project Margins)",
    instHolding: "79.8%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.68x",
    intCover: "Order Book: ₹5,10,000+ Cr (All Time High)",
    divYieldVal: "0.95%",
    payoutVal: "Annual Dividend: ₹34.00 / share",
    basePrice: 3560.00,
    minZone: 3460,
    maxZone: 3530,
    supLevel: 3320,
    tarLevel: 4100
  },
  {
    id: "infy",
    name: "Infosys Ltd.",
    ticker: "NSE: INFY",
    sector: "Information Technology",
    cap: "Mega Cap",
    logo: "IN",
    cmp: 1865.00,
    change: "+12.00 (+0.65%)",
    isPositive: true,
    desc: "Global digital consulting and enterprise IT leader with $18B+ revenue run-rate and generative AI enterprise adoption.",
    riskScore: 29,
    riskTier: "low",
    riskTierLabel: "Low Risk (Bluechip Anchor)",
    riskSummaryHeading: "Global IT Services Leader",
    riskSummary: "Pristine debt-free balance sheet, 85%+ capital return via dividends and share repurchases, and top-tier client retention in BFSI and cloud.",
    beta: 0.85,
    betaLabel: "0.85x (Defensive Beta)",
    betaWidth: 35,
    volatility: "16.8% (Benchmark IT)",
    volWidth: 36,
    peRatio: 27.4,
    peLabel: "27.4 vs Sector 30.0 (Reasonable)",
    peWidth: 48,
    debtLabel: "Zero Debt (Clean Balance Sheet)",
    debtWidth: 10,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (BUY NOW)",
    verdictConfidence: "High Confidence (89%)",
    verdictReason: "BFSI discretionary spending in the US is inflecting upward. Large deal total contract value (TCV) is at records, supporting 12-18 month outperformance.",
    buyRange: "₹1,830 – ₹1,875",
    cmpStatus: "In Buy Zone (+0.6% from floor)",
    support1: "₹1,830.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹1,720.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹1,680.00",
    hintStopLoss: "Cutoff Stop (-9.9%)",
    targets: "₹2,150 / ₹2,350",
    target1: "₹2,150.00",
    upside: "+15.3% / +26.0%",
    rrRatio: "1 : 3.3 (High Value)",
    rsi: 50.8,
    rsiStatus: "50.8 • Perfect Accumulation Zone",
    trancheHeading: "Deploy 50% at CMP, 50% on Dip",
    trancheDesc: "Deploy half the allocation at current market price. Save remainder to deploy if macro currency fluctuations cause short-term dip toward ₹1,830.",
    high52: "₹1,992.00",
    drawdown: "-6.4% from Peak",
    low52: "₹1,358.00",
    cushion: "+37.3% above 52W floor",
    peVal: "27.4x",
    peMedian: "5Y Median: 28.5x (Fair Value)",
    pbVal: "8.10x",
    bookVal: "Book Value: ₹230.20 / share",
    roeVal: "31.8%",
    roceVal: "ROCE: 40.5% (Top-tier Return)",
    instHolding: "85.6%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.00x",
    intCover: "Net Cash: ₹26,000+ Cr Liquidity",
    divYieldVal: "2.45%",
    payoutVal: "Annual Dividend: ₹46.00 / share",
    basePrice: 1865.00,
    minZone: 1830,
    maxZone: 1875,
    supLevel: 1720,
    tarLevel: 2150
  },
  {
    id: "bhartiartl",
    name: "Bharti Airtel Ltd.",
    ticker: "NSE: BHARTIARTL",
    sector: "Telecom & Digital Services",
    cap: "Mega Cap",
    logo: "BA",
    cmp: 1612.00,
    change: "+19.50 (+1.22%)",
    isPositive: true,
    desc: "Leading telecom duopoly in India with highest ARPU (₹220+), commanding massive data consumption and enterprise connectivity.",
    riskScore: 32,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "Telecom Duopoly with Expanding Cash Margins",
    riskSummary: "India's telecom sector is a solid duopoly with guaranteed pricing power. Industry tariff hikes flow straight into operating free cash flow with minimal incremental capex.",
    beta: 0.82,
    betaLabel: "0.82x (Defensive Moat)",
    betaWidth: 32,
    volatility: "17.4% (Low Equity Volatility)",
    volWidth: 38,
    peRatio: 38.5,
    peLabel: "38.5 vs Forward 26.0 (EBITDA Compounding)",
    peWidth: 60,
    debtLabel: "D/E 1.10 (Rapidly Deleveraging)",
    debtWidth: 48,
    verdictType: "buy-dips",
    verdictBadge: "Buy On Dips",
    verdictTitle: "BUY ON DIPS (DUOPOLY CASH COMPOUNDER)",
    verdictConfidence: "High Confidence (88%)",
    verdictReason: "Stock is in a textbook secular bull channel. Accumulating on brief consolidation near ₹1,560–₹1,595 provides exceptional upside with limited downside.",
    buyRange: "₹1,560 – ₹1,600",
    cmpStatus: "Near Upper Bound (+0.8%)",
    support1: "₹1,565.00",
    hintSupport1: "50-DMA Strong Base",
    support2: "₹1,450.00",
    hintSupport2: "200-DMA Major Demand",
    stopLoss: "₹1,420.00",
    hintStopLoss: "Cutoff Stop (-11.9%)",
    targets: "₹1,850 / ₹2,050",
    target1: "₹1,850.00",
    upside: "+14.8% / +27.2%",
    rrRatio: "1 : 3.0 (Favorable)",
    rsi: 56.4,
    rsiStatus: "56.4 • Steady Uptrend",
    trancheHeading: "Deploy 35% Now, 65% on Minor Pullback",
    trancheDesc: "Initiate first 35% allocation at CMP. Preserve 65% to add whenever the stock tests 50-DMA support at ₹1,565.",
    high52: "₹1,712.00",
    drawdown: "-5.8% from Peak",
    low52: "₹1,090.00",
    cushion: "+47.9% above 52W floor",
    peVal: "38.5x",
    peMedian: "EV/EBITDA: 9.8x (Historical Average)",
    pbVal: "6.95x",
    bookVal: "Book Value: ₹232.00 / share",
    roeVal: "18.6%",
    roceVal: "ROCE: 17.5% (High Capital Return)",
    instHolding: "81.4%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "1.10x",
    intCover: "ARPU: ₹226 (Industry Leader)",
    divYieldVal: "0.55%",
    payoutVal: "Annual Dividend: ₹9.00 / share",
    basePrice: 1612.00,
    minZone: 1560,
    maxZone: 1600,
    supLevel: 1450,
    tarLevel: 1850
  },
  {
    id: "titan",
    name: "Titan Company Ltd.",
    ticker: "NSE: TITAN",
    sector: "Consumer Discretionary & Luxury",
    cap: "Large Cap",
    logo: "TI",
    cmp: 3410.00,
    change: "-22.00 (-0.64%)",
    isPositive: false,
    desc: "Tata Group's jewel dominating organized gold jewelry (Tanishq), watches, and premium eyewear with unparalleled consumer trust.",
    riskScore: 35,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "Aspirational Consumer Monopoly",
    riskSummary: "Enjoys unrivaled consumer trust in Indian wedding and festive jewelry. Customs duty rationalization boosts formalization, supporting sustainable 15%+ revenue compounding.",
    beta: 0.95,
    betaLabel: "0.95x (Defensive Consumer)",
    betaWidth: 45,
    volatility: "18.9% (Standard Consumer)",
    volWidth: 42,
    peRatio: 72.0,
    peLabel: "72x (Consistent Tata Brand Premium)",
    peWidth: 78,
    debtLabel: "D/E 0.45 (Prudent Working Capital)",
    debtWidth: 35,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME BUY ACCUMULATION ZONE",
    verdictConfidence: "High Confidence (91%)",
    verdictReason: "Trading near the lower band of its 1-year consolidation box. Festive gold demand and wedding season tailwinds make this an ideal low-risk entry window.",
    buyRange: "₹3,350 – ₹3,430",
    cmpStatus: "In Sweet Spot (Optimal Entry)",
    support1: "₹3,360.00",
    hintSupport1: "50-DMA Support Floor",
    support2: "₹3,220.00",
    hintSupport2: "200-DMA Institutional Base",
    stopLoss: "₹3,140.00",
    hintStopLoss: "Cutoff Stop (-7.9%)",
    targets: "₹3,950 / ₹4,300",
    target1: "₹3,950.00",
    upside: "+15.8% / +26.1%",
    rrRatio: "1 : 3.4 (Very Attractive)",
    rsi: 44.5,
    rsiStatus: "44.5 • Neutral Accumulation",
    trancheHeading: "Deploy 50% at CMP, 50% at ₹3,360",
    trancheDesc: "Deploy 50% immediately. Keep 50% in reserve for gold price volatility dip to average down near ₹3,360 support.",
    high52: "₹3,886.00",
    drawdown: "-12.2% from Peak",
    low52: "₹3,055.00",
    cushion: "+11.6% above 52W floor",
    peVal: "72.0x",
    peMedian: "5Y Median: 75.0x (Slight Discount)",
    pbVal: "21.5x",
    bookVal: "Book Value: ₹158.60 / share",
    roeVal: "30.5%",
    roceVal: "ROCE: 34.2% (Remarkable Return)",
    instHolding: "82.9%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.45x",
    intCover: "Tanishq Same-Store Growth: 18%+",
    divYieldVal: "0.38%",
    payoutVal: "Annual Dividend: ₹13.00 / share",
    basePrice: 3410.00,
    minZone: 3350,
    maxZone: 3430,
    supLevel: 3220,
    tarLevel: 3950
  },
  {
    id: "tatasteel",
    name: "Tata Steel Ltd.",
    ticker: "NSE: TATASTEEL",
    sector: "Metals & Mining",
    cap: "Large Cap",
    logo: "TS",
    cmp: 148.50,
    change: "-1.80 (-1.20%)",
    isPositive: false,
    desc: "One of the world's most geographically diversified steelmakers with 100% captive iron-ore mines in India delivering lowest cost production.",
    riskScore: 78,
    riskTier: "vhigh",
    riskTierLabel: "Very High Risk (Commodity Cyclical)",
    riskSummaryHeading: "Commodity Super-Cycle Dependent",
    riskSummary: "Highly exposed to international steel spreads, Chinese dumping, and European blast furnace decarbonization costs. Exhibits sharp boom-and-bust price swings.",
    beta: 1.45,
    betaLabel: "1.45x (High Market Sensitivity)",
    betaWidth: 78,
    volatility: "29.5% (High Cyclical Swings)",
    volWidth: 74,
    peRatio: 38.0,
    peLabel: "Cyclical Trough Multiples",
    peWidth: 70,
    debtLabel: "D/E 0.92 (UK Restructuring Drag)",
    debtWidth: 62,
    verdictType: "wait-pullback",
    verdictBadge: "Wait For Pullback",
    verdictTitle: "WAIT FOR CLEAR COMMODITY BOTTOM",
    verdictConfidence: "Medium Confidence (75%)",
    verdictReason: "Chinese export dumping continues to depress hot-rolled coil prices. Wait for price to test major demand support at ₹135–₹142 before initiating fresh positions.",
    buyRange: "₹135 – ₹142",
    cmpStatus: "Above Value Zone (+4.6% - Wait)",
    support1: "₹140.00",
    hintSupport1: "50-DMA Support Line",
    support2: "₹132.00",
    hintSupport2: "200-DMA Cyclical Floor",
    stopLoss: "₹125.00",
    hintStopLoss: "Cyclical Cutoff Stop (-15.8%)",
    targets: "₹175 / ₹200",
    target1: "₹175.00",
    upside: "+17.8% / +34.7%",
    rrRatio: "1 : 2.2 (Wait for Support)",
    rsi: 42.1,
    rsiStatus: "42.1 • Weak Momentum",
    trancheHeading: "Strictly Stagger in 3 Small Tranches",
    trancheDesc: "Do not buy lumpsum in metals. Allocate 25% at ₹142, 35% at ₹136, and 40% at ₹130 to ensure your cost basis matches the bottom of the commodity cycle.",
    high52: "₹184.60",
    drawdown: "-19.6% from Peak",
    low52: "₹119.20",
    cushion: "+24.5% above 52W floor",
    peVal: "38.0x",
    peMedian: "EV/EBITDA: 6.8x (Historical Mean)",
    pbVal: "1.82x",
    bookVal: "Book Value: ₹81.50 / share",
    roeVal: "4.8%",
    roceVal: "ROCE: 8.5% (Trough Cycle)",
    instHolding: "67.8%",
    pledgeVal: "0.8% Promoter Pledge (Negligible)",
    debtEqVal: "0.92x",
    intCover: "Captive Mines: 100% Domestic Iron Ore",
    divYieldVal: "2.42%",
    payoutVal: "Annual Dividend: ₹3.60 / share",
    basePrice: 148.50,
    minZone: 135,
    maxZone: 142,
    supLevel: 132,
    tarLevel: 175
  },
  {
    id: "sunpharma",
    name: "Sun Pharmaceutical Industries Ltd.",
    ticker: "NSE: SUNPHARMA",
    sector: "Pharmaceuticals & Healthcare",
    cap: "Large Cap",
    logo: "SP",
    cmp: 1824.00,
    change: "+15.00 (+0.83%)",
    isPositive: true,
    desc: "India's largest pharma company with unmatched global specialty dermatology and ophthalmology innovative pipeline.",
    riskScore: 26,
    riskTier: "low",
    riskTierLabel: "Low Risk (Defensive Healthcare)",
    riskSummaryHeading: "Specialty Global Pharma Leader",
    riskSummary: "Global innovative specialty drugs portfolio (Ilumya, Cequa, Winlevi) provides recurring high-margin dollar revenues immune to economic downturns.",
    beta: 0.72,
    betaLabel: "0.72x (Very Defensive)",
    betaWidth: 25,
    volatility: "15.6% (Low Drawdown)",
    volWidth: 30,
    peRatio: 36.5,
    peLabel: "36.5 vs Sector 38.0 (Fair Value)",
    peWidth: 54,
    debtLabel: "Net Cash Positive Balance Sheet",
    debtWidth: 12,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (DEFENSIVE VALUE)",
    verdictConfidence: "High Confidence (90%)",
    verdictReason: "Consistent double-digit specialty revenue growth and strong US FDA compliance record. Exceptional non-cyclical defensive anchor for any equity portfolio.",
    buyRange: "₹1,780 – ₹1,835",
    cmpStatus: "In Prime Zone (Optimal Entry)",
    support1: "₹1,790.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹1,650.00",
    hintSupport2: "200-DMA Structural Base",
    stopLoss: "₹1,610.00",
    hintStopLoss: "Cutoff Stop (-11.7%)",
    targets: "₹2,100 / ₹2,350",
    target1: "₹2,100.00",
    upside: "+15.1% / +28.8%",
    rrRatio: "1 : 3.2 (Strong)",
    rsi: 52.8,
    rsiStatus: "52.8 • Stable Accumulation",
    trancheHeading: "Deploy 60% at CMP, 40% on Dips",
    trancheDesc: "Pharma is a non-cyclical safe harbor. Deploy 60% right now, keeping 40% in reserve for any temporary regulatory headline noise.",
    high52: "₹1,960.00",
    drawdown: "-6.9% from Peak",
    low52: "₹1,240.00",
    cushion: "+47.1% above 52W floor",
    peVal: "36.5x",
    peMedian: "5Y Median: 34.0x (Slight Premium)",
    pbVal: "5.70x",
    bookVal: "Book Value: ₹320.00 / share",
    roeVal: "16.8%",
    roceVal: "ROCE: 19.5% (High Capital Return)",
    instHolding: "86.2%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.02x",
    intCover: "Net Cash: ₹18,000+ Cr Surplus",
    divYieldVal: "0.82%",
    payoutVal: "Annual Dividend: ₹15.00 / share",
    basePrice: 1824.00,
    minZone: 1780,
    maxZone: 1835,
    supLevel: 1650,
    tarLevel: 2100
  },
  {
    id: "bajfinance",
    name: "Bajaj Finance Ltd.",
    ticker: "NSE: BAJFINANCE",
    sector: "NBFC & Consumer Lending",
    cap: "Large Cap",
    logo: "BF",
    cmp: 6840.00,
    change: "+55.00 (+0.81%)",
    isPositive: true,
    desc: "India's premier retail lending franchise with 88M+ cross-sell customer franchise and lightning omni-channel loan disbursement.",
    riskScore: 52,
    riskTier: "high",
    riskTierLabel: "High Risk (High Beta Growth)",
    riskSummaryHeading: "Fastest Compounding Consumer Lender",
    riskSummary: "Unmatched 25%+ AUM growth and ROE above 20%. However, unsecured personal loan regulations from RBI and macro rate environments introduce moderate volatility.",
    beta: 1.28,
    betaLabel: "1.28x (Aggressive Swings)",
    betaWidth: 64,
    volatility: "24.2% (Moderate High Volatility)",
    volWidth: 58,
    peRatio: 26.2,
    peLabel: "26.2 vs 10Y Median 42.0 (Historical Deep Discount)",
    peWidth: 42,
    debtLabel: "CAR 21.5% (Exceptional Capital Adequacy)",
    debtWidth: 25,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (VALUE RE-RATING)",
    verdictConfidence: "High Confidence (92%)",
    verdictReason: "Trading at its lowest P/B and P/E valuation multiples in a decade while sustaining 27% profit growth. Unsecured loan slippages have peaked, offering a rare generational entry window.",
    buyRange: "₹6,650 – ₹6,900",
    cmpStatus: "In Buy Zone (Prime Multi-Year Low)",
    support1: "₹6,700.00",
    hintSupport1: "50-DMA Strong Base",
    support2: "₹6,450.00",
    hintSupport2: "Major Multi-Year Support",
    stopLoss: "₹6,200.00",
    hintStopLoss: "Cutoff Stop (-9.4%)",
    targets: "₹8,200 / ₹9,100",
    target1: "₹8,200.00",
    upside: "+19.9% / +33.0%",
    rrRatio: "1 : 3.8 (Outstanding)",
    rsi: 48.2,
    rsiStatus: "48.2 • Perfect Accumulation Zone",
    trancheHeading: "Deploy 50% Now, 50% at ₹6,700",
    trancheDesc: "Historically, buying Bajaj Finance below 30x P/E has yielded 25%+ annualized returns. Take 50% position now and reserve 50% to average on dips.",
    high52: "₹7,818.00",
    drawdown: "-12.5% from Peak",
    low52: "₹6,365.00",
    cushion: "+7.5% above 52W floor (Near Bottom)",
    peVal: "26.2x",
    peMedian: "10Y Median: 42.0x (At 38% Discount)",
    pbVal: "4.85x",
    bookVal: "Book Value: ₹1,410.00 / share",
    roeVal: "21.8%",
    roceVal: "ROA: 4.45% (Unrivaled In Indian NBFCs)",
    instHolding: "82.4%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "CAR 21.5%",
    intCover: "Gross NPA: 1.06% (Industry Benchmark)",
    divYieldVal: "0.58%",
    payoutVal: "Annual Dividend: ₹40.00 / share",
    basePrice: 6840.00,
    minZone: 6650,
    maxZone: 6900,
    supLevel: 6450,
    tarLevel: 8200
  },
  {
    id: "maruti",
    name: "Maruti Suzuki India Ltd.",
    ticker: "NSE: MARUTI",
    sector: "Automobile & Passenger Vehicles",
    cap: "Large Cap",
    logo: "MS",
    cmp: 11420.00,
    change: "+85.00 (+0.75%)",
    isPositive: true,
    desc: "King of Indian passenger vehicles commanding 42% market share, with dominating presence in hybrid tech, SUVs, and export leadership.",
    riskScore: 34,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "Dominant Passenger Vehicle Titan",
    riskSummary: "Unchallenged 42% volume market share, zero debt, strong hybrid technology collaboration with Toyota, and huge ₹50,000+ Crore cash balance.",
    beta: 0.88,
    betaLabel: "0.88x (Defensive Auto)",
    betaWidth: 38,
    volatility: "17.8% (Lower Auto Volatility)",
    volWidth: 39,
    peRatio: 24.8,
    peLabel: "24.8 vs 5Y Median 29.5 (Attractive)",
    peWidth: 50,
    debtLabel: "Zero Debt (Massive Cash Pile)",
    debtWidth: 10,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (BUY NOW)",
    verdictConfidence: "High Confidence (90%)",
    verdictReason: "Strong SUV lineup (Grand Vitara, Fronx, Brezza) and expanding rural sales offset small-car softness. Robust festive delivery books provide steady earnings visibility.",
    buyRange: "₹11,150 – ₹11,500",
    cmpStatus: "In Buy Zone (+0.6% from floor)",
    support1: "₹11,200.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹10,600.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹10,350.00",
    hintStopLoss: "Cutoff Stop (-9.4%)",
    targets: "₹13,200 / ₹14,500",
    target1: "₹13,200.00",
    upside: "+15.6% / +27.0%",
    rrRatio: "1 : 3.2 (Strong)",
    rsi: 47.9,
    rsiStatus: "47.9 • Neutral Accumulation",
    trancheHeading: "Deploy 50% at CMP, 50% on Dip",
    trancheDesc: "Deploy 50% right away. Keep remainder to average down if monthly auto dispatch numbers create transient dips near ₹11,200.",
    high52: "₹13,066.00",
    drawdown: "-12.6% from Peak",
    low52: "₹9,737.00",
    cushion: "+17.3% above 52W floor",
    peVal: "24.8x",
    peMedian: "5Y Median: 29.5x (At 16% Discount)",
    pbVal: "3.85x",
    bookVal: "Book Value: ₹2,965.00 / share",
    roeVal: "16.8%",
    roceVal: "ROCE: 21.4% (Strong Capital Efficiency)",
    instHolding: "82.6%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.00x",
    intCover: "Net Cash: ₹52,000+ Cr Surplus",
    divYieldVal: "1.10%",
    payoutVal: "Annual Dividend: ₹125.00 / share",
    basePrice: 11420.00,
    minZone: 11150,
    maxZone: 11500,
    supLevel: 10600,
    tarLevel: 13200
  },
  {
    id: "adanient",
    name: "Adani Enterprises Ltd.",
    ticker: "NSE: ADANIENT",
    sector: "Infrastructure Incubator & Energy",
    cap: "Large Cap",
    logo: "AE",
    cmp: 2840.00,
    change: "+48.00 (+1.72%)",
    isPositive: true,
    desc: "Flagship incubator for the Adani Group driving airports, green hydrogen, solar gigafactories, data centers, and toll roads.",
    riskScore: 82,
    riskTier: "vhigh",
    riskTierLabel: "Very High Risk (High Leverage / Beta)",
    riskSummaryHeading: "Aggressive Infrastructure Incubator",
    riskSummary: "High capital expenditure intensity, international regulatory scrutiny, and high debt servicing requirements create very high beta swings.",
    beta: 1.82,
    betaLabel: "1.82x (Extreme Volatility)",
    betaWidth: 92,
    volatility: "42.5% (High Historical Swings)",
    volWidth: 88,
    peRatio: 84.0,
    peLabel: "84x (Incubation Premium)",
    peWidth: 82,
    debtLabel: "D/E 1.85 (High Infra Leverage)",
    debtWidth: 80,
    verdictType: "wait-pullback",
    verdictBadge: "Wait For Pullback",
    verdictTitle: "WAIT FOR CONSOLIDATION / HIGH VOLATILITY",
    verdictConfidence: "Medium Confidence (72%)",
    verdictReason: "Stock is subject to sharp headline sensitivity. Enter only if price tests strong technical support at ₹2,600–₹2,720 with strict stop loss.",
    buyRange: "₹2,600 – ₹2,720",
    cmpStatus: "Above Safe Zone (+4.4% - Wait)",
    support1: "₹2,680.00",
    hintSupport1: "50-DMA Support Level",
    support2: "₹2,420.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹2,340.00",
    hintStopLoss: "Strict Capital Cutoff (-17.6%)",
    targets: "₹3,450 / ₹3,900",
    target1: "₹3,450.00",
    upside: "+21.5% / +37.3%",
    rrRatio: "1 : 2.1 (High Risk Swings)",
    rsi: 58.2,
    rsiStatus: "58.2 • Elevated Momentum",
    trancheHeading: "Strictly Limit to 5% Portfolio Capital",
    trancheDesc: "Due to very high beta, do not allocate more than 5% of total equity capital. Stagger purchases across 3 tranches strictly around support levels.",
    high52: "₹3,450.00",
    drawdown: "-17.7% from Peak",
    low52: "₹2,142.00",
    cushion: "+32.6% above 52W floor",
    peVal: "84.0x",
    peMedian: "Incubator Enterprise Value Multiple",
    pbVal: "7.20x",
    bookVal: "Book Value: ₹394.00 / share",
    roeVal: "9.8%",
    roceVal: "ROCE: 10.4% (Early Stage Assets)",
    instHolding: "76.4%",
    pledgeVal: "2.8% Promoter Pledge",
    debtEqVal: "1.85x",
    intCover: "Airport Traffic Growth: 24% YoY",
    divYieldVal: "0.05%",
    payoutVal: "Annual Dividend: ₹1.30 / share",
    basePrice: 2840.00,
    minZone: 2600,
    maxZone: 2720,
    supLevel: 2420,
    tarLevel: 3450
  },
  {
    id: "hindunilvr",
    name: "Hindustan Unilever Ltd.",
    ticker: "NSE: HINDUNILVR",
    sector: "FMCG & Consumer Staples",
    cap: "Mega Cap",
    logo: "HU",
    cmp: 2385.00,
    change: "+4.50 (+0.19%)",
    isPositive: true,
    desc: "India's premier FMCG staple king present in 9 out of 10 Indian households across personal care, foods, and household beauty.",
    riskScore: 21,
    riskTier: "low",
    riskTierLabel: "Low Risk (Staples Fortress)",
    riskSummaryHeading: "Unshakeable Rural & Urban Moat",
    riskSummary: "Virtually zero debt, astronomical 80%+ ROCE, unmatched supply chain reach into 9 million retail outlets, and reliable dividend compounding.",
    beta: 0.62,
    betaLabel: "0.62x (Ultra Low Volatility)",
    betaWidth: 20,
    volatility: "14.1% (Rock Solid Defense)",
    volWidth: 24,
    peRatio: 52.0,
    peLabel: "52.0 vs 10Y Median 62.0 (Historical Deep Value)",
    peWidth: 50,
    debtLabel: "Zero Debt (Pristine Balance Sheet)",
    debtWidth: 8,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION ZONE (VALUE TROUGH)",
    verdictConfidence: "Very High Confidence (93%)",
    verdictReason: "Trading near a 5-year valuation trough. Rural demand recovery, normal monsoon harvests, and benign raw material costs pave the way for steady re-rating.",
    buyRange: "₹2,320 – ₹2,410",
    cmpStatus: "In Sweet Spot (Deep Value Entry)",
    support1: "₹2,340.00",
    hintSupport1: "50-DMA Strong Base",
    support2: "₹2,260.00",
    hintSupport2: "Multi-Year Demand Fortress",
    stopLoss: "₹2,210.00",
    hintStopLoss: "Cutoff Stop (-7.3%)",
    targets: "₹2,850 / ₹3,100",
    target1: "₹2,850.00",
    upside: "+19.5% / +30.0%",
    rrRatio: "1 : 3.9 (Superb Defense)",
    rsi: 42.8,
    rsiStatus: "42.8 • Oversold Accumulation",
    trancheHeading: "Deploy 60% Upfront, 40% on Dips",
    trancheDesc: "HUL rarely trades at 52x P/E. Deploy 60% of target capital immediately and reserve 40% to add on any seasonal quarterly volume noise.",
    high52: "₹3,034.00",
    drawdown: "-21.4% from Peak (Rare Opportunity)",
    low52: "₹2,170.00",
    cushion: "+9.9% above 52W floor",
    peVal: "52.0x",
    peMedian: "10Y Median: 62.0x (At 16% Discount)",
    pbVal: "10.8x",
    bookVal: "Book Value: ₹220.50 / share",
    roeVal: "20.4%",
    roceVal: "ROCE: 26.5% (Elite Quality Moat)",
    instHolding: "86.5%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.00x",
    intCover: "Net Cash: Consistent Free Cash Flow",
    divYieldVal: "1.78%",
    payoutVal: "Annual Dividend: ₹42.00 / share",
    basePrice: 2385.00,
    minZone: 2320,
    maxZone: 2410,
    supLevel: 2260,
    tarLevel: 2850
  },
  {
    id: "mm",
    name: "Mahindra & Mahindra Ltd.",
    ticker: "NSE: M&M",
    sector: "Automotive & Farm Equipment",
    cap: "Large Cap",
    logo: "MM",
    cmp: 2940.00,
    change: "+34.00 (+1.17%)",
    isPositive: true,
    desc: "India's undisputed SUV and tractor powerhouse, capturing leadership with Scorpio-N, Thar Roxx, XUV700, and EV architecture.",
    riskScore: 39,
    riskTier: "mod",
    riskTierLabel: "Moderate Risk",
    riskSummaryHeading: "SUV Juggernaut & Tractor Monopolist",
    riskSummary: "Enjoys massive multi-month waiting periods for premier SUVs, commanding 40%+ tractor market share, with aggressive capital allocation discipline.",
    beta: 1.12,
    betaLabel: "1.12x (Moderate Beta)",
    betaWidth: 54,
    volatility: "21.5% (Steady Auto Cyclical)",
    volWidth: 46,
    peRatio: 28.5,
    peLabel: "28.5 vs Sector 30.0 (Reasonable)",
    peWidth: 52,
    debtLabel: "D/E 0.35 (Strong Balance Sheet)",
    debtWidth: 30,
    verdictType: "buy-dips",
    verdictBadge: "Buy On Dips",
    verdictTitle: "BUY ON DIPS (PREMIUM AUTO LEADER)",
    verdictConfidence: "High Confidence (89%)",
    verdictReason: "Outstanding booking order books for Thar Roxx and XUV700 underpin double-digit revenue growth. Wait for mild consolidation near ₹2,840–₹2,900 for best entry.",
    buyRange: "₹2,820 – ₹2,900",
    cmpStatus: "Near Upper Bound (+1.4%)",
    support1: "₹2,850.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹2,680.00",
    hintSupport2: "200-DMA Major Demand",
    stopLoss: "₹2,580.00",
    hintStopLoss: "Cutoff Stop (-12.2%)",
    targets: "₹3,400 / ₹3,800",
    target1: "₹3,400.00",
    upside: "+15.6% / +29.2%",
    rrRatio: "1 : 2.8 (Solid)",
    rsi: 55.2,
    rsiStatus: "55.2 • Steady Uptrend",
    trancheHeading: "Deploy 35% Now, 65% at ₹2,850 Support",
    trancheDesc: "Initiate 35% position at CMP. Place limit orders at ₹2,850 to capture any profit-booking pullbacks.",
    high52: "₹3,222.00",
    drawdown: "-8.7% from Peak",
    low52: "₹1,504.00",
    cushion: "+95.5% above 52W floor",
    peVal: "28.5x",
    peMedian: "5Y Median: 25.0x (Slight Premium)",
    pbVal: "5.10x",
    bookVal: "Book Value: ₹576.00 / share",
    roeVal: "19.5%",
    roceVal: "ROCE: 22.1% (High Return on Capital)",
    instHolding: "78.9%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "0.35x",
    intCover: "Tractor Share: 41.6% Market Leader",
    divYieldVal: "0.72%",
    payoutVal: "Annual Dividend: ₹21.10 / share",
    basePrice: 2940.00,
    minZone: 2820,
    maxZone: 2900,
    supLevel: 2680,
    tarLevel: 3400
  },
  {
    id: "icicibank",
    name: "ICICI Bank Ltd.",
    ticker: "NSE: ICICIBANK",
    sector: "Banking & Financial Services",
    cap: "Mega Cap",
    logo: "IC",
    cmp: 1285.00,
    change: "+14.00 (+1.10%)",
    isPositive: true,
    desc: "Gold standard of Indian private banking delivering industry-leading 2.3% ROA, unblemished credit quality, and superior digital franchise.",
    riskScore: 27,
    riskTier: "low",
    riskTierLabel: "Low Risk (Premier Bluechip)",
    riskSummaryHeading: "Elite Underwriting & Highest Return on Assets",
    riskSummary: "Unmatched operational excellence. Net NPAs at 0.42%, Net Interest Margin at 4.36%, and Core Operating Profit growing at consistent 18%+ CAGR.",
    beta: 0.90,
    betaLabel: "0.90x (Defensive Banking)",
    betaWidth: 40,
    volatility: "17.2% (Low Banking Swings)",
    volWidth: 36,
    peRatio: 17.5,
    peLabel: "17.5 vs 5Y Median 19.8 (Deep Value)",
    peWidth: 40,
    debtLabel: "CAR 16.8% (Rock Solid Tier 1)",
    debtWidth: 22,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "STRONG CONVICTION BUY (TOP BANKING PICK)",
    verdictConfidence: "Very High Confidence (94%)",
    verdictReason: "Consistent outperformer with top-tier ROE (18.5%). Consolidating neatly near ₹1,260–₹1,295 before its next expansion leg towards ₹1,500.",
    buyRange: "₹1,250 – ₹1,295",
    cmpStatus: "In Prime Buy Zone (Optimal Entry)",
    support1: "₹1,255.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹1,180.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹1,140.00",
    hintStopLoss: "Cutoff Stop (-11.3%)",
    targets: "₹1,480 / ₹1,650",
    target1: "₹1,480.00",
    upside: "+15.2% / +28.4%",
    rrRatio: "1 : 3.6 (Outstanding)",
    rsi: 50.4,
    rsiStatus: "50.4 • Ideal Accumulation Zone",
    trancheHeading: "Deploy 50% at CMP, 50% on Dips",
    trancheDesc: "ICICI Bank is a core compounder. Deploy 50% right away. If broad market profit booking occurs, deploy remaining 50% around ₹1,255.",
    high52: "₹1,334.00",
    drawdown: "-3.7% from Peak",
    low52: "₹910.00",
    cushion: "+41.2% above 52W floor",
    peVal: "17.5x",
    peMedian: "5Y Median: 19.8x (At 12% Discount)",
    pbVal: "2.85x",
    bookVal: "Book Value: ₹450.00 / share",
    roeVal: "18.8%",
    roceVal: "ROA: 2.32% (Highest Amongst Large Banks)",
    instHolding: "88.2%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "CAR 16.8%",
    intCover: "Net NPA: 0.42% (Multi-Decade Low)",
    divYieldVal: "0.78%",
    payoutVal: "Annual Dividend: ₹10.00 / share",
    basePrice: 1285.00,
    minZone: 1250,
    maxZone: 1295,
    supLevel: 1180,
    tarLevel: 1480
  },
  {
    id: "ntpc",
    name: "NTPC Ltd.",
    ticker: "NSE: NTPC",
    sector: "Power Generation & Clean Energy",
    cap: "Large Cap",
    logo: "NP",
    cmp: 382.40,
    change: "+4.10 (+1.08%)",
    isPositive: true,
    desc: "National power generation titan delivering 25% of India's total electricity, rapidly scaling NTPC Green Energy for solar and wind renewables.",
    riskScore: 28,
    riskTier: "low",
    riskTierLabel: "Low Risk (Sovereign Utility Moat)",
    riskSummaryHeading: "Guaranteed Return-on-Equity Utility Giant",
    riskSummary: "Regulated CERC return model guarantees a minimum 15.5% ROE on invested equity. Zero demand risk as peak power deficits in India continue to hit records.",
    beta: 0.84,
    betaLabel: "0.84x (Low Defensive Beta)",
    betaWidth: 35,
    volatility: "16.4% (Stable Utility Dividends)",
    volWidth: 35,
    peRatio: 14.5,
    peLabel: "14.5 vs Utility Median 17.0 (Undervalued)",
    peWidth: 42,
    debtLabel: "D/E 1.25 (Long-Term Regulated Debt)",
    debtWidth: 50,
    verdictType: "prime-buy",
    verdictBadge: "Prime Buy Zone",
    verdictTitle: "PRIME ACCUMULATION (SOVEREIGN VALUE)",
    verdictConfidence: "High Confidence (91%)",
    verdictReason: "NTPC Green Energy demerger/IPO unlocks massive latent value. Base thermal power plants operating at peak plant load factors (PLF) above 76%.",
    buyRange: "₹370 – ₹388",
    cmpStatus: "In Sweet Spot (Optimal Value Entry)",
    support1: "₹372.00",
    hintSupport1: "50-DMA Strong Support",
    support2: "₹345.00",
    hintSupport2: "200-DMA Institutional Floor",
    stopLoss: "₹335.00",
    hintStopLoss: "Cutoff Stop (-12.4%)",
    targets: "₹450 / ₹510",
    target1: "₹450.00",
    upside: "+17.7% / +33.4%",
    rrRatio: "1 : 3.1 (Strong)",
    rsi: 48.6,
    rsiStatus: "48.6 • Balanced Accumulation",
    trancheHeading: "Deploy 50% at CMP, 50% on Dips",
    trancheDesc: "Allocate 50% capital at CMP. Add remaining 50% if broader market pullbacks push price towards ₹372 support.",
    high52: "₹435.00",
    drawdown: "-12.1% from Peak",
    low52: "₹248.00",
    cushion: "+54.2% above 52W floor",
    peVal: "14.5x",
    peMedian: "5Y Median: 12.0x (Reasonable)",
    pbVal: "1.95x",
    bookVal: "Book Value: ₹196.00 / share",
    roeVal: "13.8%",
    roceVal: "ROCE: 12.5% (Regulated CERC Framework)",
    instHolding: "83.8%",
    pledgeVal: "0.0% Promoter Pledge (Zero Risk)",
    debtEqVal: "1.25x",
    intCover: "Green Capacity: 60 GW by 2032",
    divYieldVal: "2.10%",
    payoutVal: "Annual Dividend: ₹8.00 / share",
    basePrice: 382.40,
    minZone: 370,
    maxZone: 388,
    supLevel: 345,
    tarLevel: 450
  }
];

const state = {
  searchQuery: "",
  sort: "expense_asc",
  horizon: new Set(),
  category: new Set(),
  sector: new Set(),
  ter: "any",
  pe: "any",
  exit: new Set(),
  budget: "any",
  risk: new Set(),
  consistency: new Set(),
  selectedFundForModal: null,
  isAmfiSyncing: false,
  liveSyncedCount: 0,
  countdownSeconds: 45,
  pollingTimer: null,
  countdownTimer: null,
  activeSipsList: [
    {
      id: "active-1",
      fundName: "Parag Parikh Flexi Cap Fund (Direct-Growth)",
      sipAmount: 1000,
      debitDate: 5,
      monthsActive: 4,
      totalInvested: 4000,
      nextDebit: "5th Dec 2026",
      status: "Active (Discipline Streak)"
    },
    {
      id: "active-2",
      fundName: "UTI Nifty 50 Index Fund (Direct-Growth)",
      sipAmount: 1000,
      debitDate: 5,
      monthsActive: 4,
      totalInvested: 4000,
      nextDebit: "5th Dec 2026",
      status: "Active (Discipline Streak)"
    }
  ],
  stockRisk: {
    selectedStockId: "reliance",
    chartTimeframe: "6M",
    searchQuery: "",
    screenerQuery: ""
  }
};

// ============================================================================
// 3. DOM ELEMENTS
// ============================================================================
const el = {
  brandHomeBtn: document.getElementById("brandHomeBtn"),
  searchInput: document.getElementById("searchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  webNavLinks: document.querySelectorAll(".web-nav-link"),
  tabViews: document.querySelectorAll(".tab-view"),
  quickPills: document.querySelectorAll(".web-quick-pill"),
  fundsCountLabel: document.getElementById("fundsCountLabel"),
  activeFilterSummary: document.getElementById("activeFilterSummary"),
  activeChipsStrip: document.getElementById("activeChipsStrip"),
  clearAllFiltersQuick: document.getElementById("clearAllFiltersQuick"),
  sidebarResetBtn: document.getElementById("sidebarResetBtn"),
  activeFilterBadgeWeb: document.getElementById("activeFilterBadgeWeb"),
  fundsFeedList: document.getElementById("fundsFeedList"),
  emptyStateCard: document.getElementById("emptyStateCard"),
  resetEmptyBtn: document.getElementById("resetEmptyBtn"),

  // AMFI Live Sync Elements
  amfiSyncBadge: document.getElementById("amfiSyncBadge"),
  amfiStatusText: document.getElementById("amfiStatusText"),
  refreshAmfiBtn: document.getElementById("refreshAmfiBtn"),
  simulateTickBtn: document.getElementById("simulateTickBtn"),
  syncCountdown: document.getElementById("syncCountdown"),
  amfiPulseDot: document.getElementById("amfiPulseDot"),

  // Modals
  aiModalBackdrop: document.getElementById("aiModalBackdrop"),
  closeAiModalBtn: document.getElementById("closeAiModalBtn"),
  aiModalBody: document.getElementById("aiModalBody"),
  aiProceedToSipBtn: document.getElementById("aiProceedToSipBtn"),

  sipModalBackdrop: document.getElementById("sipModalBackdrop"),
  closeSipModalBtn: document.getElementById("closeSipModalBtn"),
  setupSchemeTitle: document.getElementById("setupSchemeTitle"),
  sipAmountInput: document.getElementById("sipAmountInput"),
  amtChips: document.querySelectorAll(".amt-chip"),
  dateChips: document.querySelectorAll(".date-chip"),
  confirmSipBtn: document.getElementById("confirmSipBtn"),

  // Dashboard
  dashLivePortfolioVal: document.getElementById("dashLivePortfolioVal"),
  dashLiveGainPill: document.getElementById("dashLiveGainPill"),

  // SIPs Tab
  activeSipsContainer: document.getElementById("activeSipsContainer"),
  topNavSipCount: document.getElementById("topNavSipCount"),

  // Risk-o-meter Elements
  navRiskMeterBtn: document.getElementById("navRiskMeterBtn"),
  riskFundSelect: document.getElementById("riskFundSelect"),
  customAmfiInput: document.getElementById("customAmfiInput"),
  btnFetchCustomAmfi: document.getElementById("btnFetchCustomAmfi"),
  riskPresetPills: document.getElementById("riskPresetPills"),
  gaugeNeedleGroup: document.getElementById("gaugeNeedleGroup"),
  riskLevelBadge: document.getElementById("riskLevelBadge"),
  riskLevelText: document.getElementById("riskLevelText"),
  riskScoreVal: document.getElementById("riskScoreVal"),
  sebiStatutoryText: document.getElementById("sebiStatutoryText"),
  schemeRiskText: document.getElementById("schemeRiskText"),
  benchmarkNameLabel: document.getElementById("benchmarkNameLabel"),
  benchmarkRiskText: document.getElementById("benchmarkRiskText"),
  rfundName: document.getElementById("rfundName"),
  rfundCategory: document.getElementById("rfundCategory"),
  rfundAmc: document.getElementById("rfundAmc"),
  rfundAmfiCode: document.getElementById("rfundAmfiCode"),
  rfundSchemeType: document.getElementById("rfundSchemeType"),
  rfundLiveNav: document.getElementById("rfundLiveNav"),
  rfundDeltaPill: document.getElementById("rfundDeltaPill"),
  rfundNavDate: document.getElementById("rfundNavDate"),
  rfundRiskDescription: document.getElementById("rfundRiskDescription"),
  rfundHorizon: document.getElementById("rfundHorizon"),
  rfundDownsideCushion: document.getElementById("rfundDownsideCushion"),
  rfundBeta: document.getElementById("rfundBeta"),
  rfundCagr: document.getElementById("rfundCagr"),
  btnRiskStartSip: document.getElementById("btnRiskStartSip"),
  btnRiskAiCheck: document.getElementById("btnRiskAiCheck"),
  btnRefreshSchemeNav: document.getElementById("btnRefreshSchemeNav"),
  qmVolVal: document.getElementById("qmVolVal"),
  qmVolBadge: document.getElementById("qmVolBadge"),
  qmVolBar: document.getElementById("qmVolBar"),
  qmBetaVal: document.getElementById("qmBetaVal"),
  qmBetaBadge: document.getElementById("qmBetaBadge"),
  qmBetaBar: document.getElementById("qmBetaBar"),
  qmSharpeVal: document.getElementById("qmSharpeVal"),
  qmSharpeBadge: document.getElementById("qmSharpeBadge"),
  qmSharpeBar: document.getElementById("qmSharpeBar"),
  qmSortinoVal: document.getElementById("qmSortinoVal"),
  qmSortinoBadge: document.getElementById("qmSortinoBadge"),
  qmSortinoBar: document.getElementById("qmSortinoBar"),
  qmMaxDdVal: document.getElementById("qmMaxDdVal"),
  qmMaxDdBadge: document.getElementById("qmMaxDdBadge"),
  qmMaxDdBar: document.getElementById("qmMaxDdBar"),
  qmVarVal: document.getElementById("qmVarVal"),
  qmVarBadge: document.getElementById("qmVarBadge"),
  qmVarBar: document.getElementById("qmVarBar"),
  qmDownsideVal: document.getElementById("qmDownsideVal"),
  qmDownsideBadge: document.getElementById("qmDownsideBadge"),
  qmDownsideBar: document.getElementById("qmDownsideBar"),
  qmTerVal: document.getElementById("qmTerVal"),
  qmTerBadge: document.getElementById("qmTerBadge"),
  qmTerBar: document.getElementById("qmTerBar"),
  riskNavChart: document.getElementById("riskNavChart"),
  chartCanvasWrapper: document.getElementById("chartCanvasWrapper"),
  chartHoverTooltip: document.getElementById("chartHoverTooltip"),
  tipDate: document.getElementById("tipDate"),
  tipNav: document.getElementById("tipNav"),
  tipDd: document.getElementById("tipDd"),
  chartStatHigh: document.getElementById("chartStatHigh"),
  chartStatLow: document.getElementById("chartStatLow"),
  chartStatVol: document.getElementById("chartStatVol"),
  chartPeriodTabs: document.getElementById("chartPeriodTabs"),
  stressScenarioButtons: document.getElementById("stressScenarioButtons"),
  stressScenarioDesc: document.getElementById("stressScenarioDesc"),
  customShockSlider: document.getElementById("customShockSlider"),
  customShockVal: document.getElementById("customShockVal"),
  stressCapitalInput: document.getElementById("stressCapitalInput"),
  simFundDropVal: document.getElementById("simFundDropVal"),
  simVsBenchLabel: document.getElementById("simVsBenchLabel"),
  simPortfolioLowVal: document.getElementById("simPortfolioLowVal"),
  simLossRupees: document.getElementById("simLossRupees"),
  simRecoveryVal: document.getElementById("simRecoveryVal"),
  stressAdviceText: document.getElementById("stressAdviceText"),
  matrixTiersGrid: document.getElementById("matrixTiersGrid"),
  userRiskScoreVal: document.getElementById("userRiskScoreVal"),
  userPersonaTitle: document.getElementById("userPersonaTitle"),
  userPersonaDesc: document.getElementById("userPersonaDesc"),
  compatBadge: document.getElementById("compatBadge"),
  compatText: document.getElementById("compatText"),
  compatMarker: document.getElementById("compatMarker"),
  btnRetakeRiskQuiz: document.getElementById("btnRetakeRiskQuiz"),

  // Toast
  toastNotification: document.getElementById("toastNotification"),
  toastTitle: document.getElementById("toastTitle"),
  toastMessage: document.getElementById("toastMessage")
};

// ============================================================================
// 4. LIVE AMFI DATA FETCHING & AUTOMATIC POLLING ENGINE
// ============================================================================
async function fetchSingleFundNav(fund, flashTarget = false) {
  const cacheKey = `amfi_nav_${fund.amfiCode}`;

  try {
    const res = await fetch(`https://api.mfapi.in/mf/${fund.amfiCode}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data && data.data && data.data.length >= 2) {
      const todayEntry = data.data[0];
      const prevEntry = data.data[1];

      const latestNav = parseFloat(todayEntry.nav);
      const prevNav = parseFloat(prevEntry.nav);

      if (!isNaN(latestNav) && !isNaN(prevNav) && prevNav > 0) {
        const oldNav = fund.liveNav;
        const diffRupees = latestNav - prevNav;
        const changePct = (diffRupees / prevNav) * 100;

        fund.prevNav = parseFloat(prevNav.toFixed(2));
        fund.liveNav = parseFloat(latestNav.toFixed(2));
        fund.navDiffRupees = parseFloat(diffRupees.toFixed(2));
        fund.dayChangePct = parseFloat(changePct.toFixed(2));
        fund.navDate = todayEntry.date;
        fund.isLive = true;

        // Build 5-day history
        fund.history5D = data.data.slice(0, 5).map((entry, idx, arr) => {
          let dayDiffStr = "—";
          if (idx + 1 < arr.length) {
            const nextVal = parseFloat(arr[idx + 1].nav);
            const currVal = parseFloat(entry.nav);
            const diffVal = currVal - nextVal;
            const pctVal = (diffVal / nextVal) * 100;
            dayDiffStr = `${diffVal >= 0 ? '+' : ''}₹${diffVal.toFixed(2)} (${diffVal >= 0 ? '+' : ''}${pctVal.toFixed(2)}%)`;
          }
          return {
            date: entry.date,
            nav: parseFloat(entry.nav).toFixed(2),
            diff: dayDiffStr
          };
        });

        // Trigger flash effect if NAV actually changed
        if (flashTarget && oldNav !== fund.liveNav) {
          triggerPriceFlash(fund.id, fund.liveNav >= oldNav ? "green" : "red");
        }

        return true;
      }
    }
  } catch (err) {
    fund.isLive = false;
  }
  return false;
}

async function syncAllAmfiNavs(manual = false) {
  if (state.isAmfiSyncing) return;
  state.isAmfiSyncing = true;

  if (el.amfiStatusText) el.amfiStatusText.textContent = "Syncing AMFI Feed...";
  if (el.refreshAmfiBtn) el.refreshAmfiBtn.classList.add("spinning");
  if (el.amfiPulseDot) el.amfiPulseDot.classList.add("syncing");

  let synced = 0;
  const batchSize = 4;
  for (let i = 0; i < FUNDS_DATA.length; i += batchSize) {
    const chunk = FUNDS_DATA.slice(i, i + batchSize);
    const results = await Promise.all(chunk.map(f => fetchSingleFundNav(f, manual)));
    synced += results.filter(Boolean).length;
    renderFundCards();
  }

  state.liveSyncedCount = synced;
  state.isAmfiSyncing = false;
  if (el.refreshAmfiBtn) el.refreshAmfiBtn.classList.remove("spinning");
  if (el.amfiPulseDot) el.amfiPulseDot.classList.remove("syncing");

  // Reset countdown
  state.countdownSeconds = 45;

  if (synced > 0) {
    updateCountdownUI();
    if (manual) {
      showToast("Live AMFI Feed Updated", `Checked ${synced} mutual funds directly from AMFI database.`);
    }
  } else {
    if (el.amfiStatusText) el.amfiStatusText.textContent = "AMFI Mode: Baseline Feed";
  }
}

// Polling countdown ticker
function startPollingCountdown() {
  if (state.countdownTimer) clearInterval(state.countdownTimer);

  state.countdownTimer = setInterval(() => {
    state.countdownSeconds--;
    if (state.countdownSeconds <= 0) {
      state.countdownSeconds = 45;
      syncAllAmfiNavs(false);
    }
    updateCountdownUI();
  }, 1000);
}

function updateCountdownUI() {
  if (el.syncCountdown) {
    el.syncCountdown.textContent = `${state.countdownSeconds}s`;
  }
  if (el.amfiStatusText && !state.isAmfiSyncing) {
    el.amfiStatusText.innerHTML = `AMFI Auto-Sync: Active (<span id="syncCountdown">${state.countdownSeconds}s</span>)`;
  }
}

// Visual flash animation on card when price changes
function triggerPriceFlash(fundId, type) {
  const card = document.querySelector(`.desktop-fund-card[data-fund-id="${fundId}"]`);
  if (!card) return;
  const navValueEl = card.querySelector(".spec-value-nav");
  if (navValueEl) {
    navValueEl.classList.remove("flash-green", "flash-red");
    void navValueEl.offsetWidth; // trigger reflow
    navValueEl.classList.add(type === "green" ? "flash-green" : "flash-red");
  }
}

// Demo Feature: Simulate a real-time price change so the user/mentor sees instant reactivity
function simulateMarketTick() {
  // Pick Parag Parikh (first fund) or random fund
  const fund = FUNDS_DATA[0];
  const oldNav = fund.liveNav;

  // Simulate a random move of +0.35% to +0.85%
  const deltaRupees = parseFloat(((Math.random() * 0.8 + 0.2) * (Math.random() > 0.3 ? 1 : -1)).toFixed(2));
  fund.liveNav = parseFloat((fund.liveNav + deltaRupees).toFixed(2));
  fund.navDiffRupees = parseFloat((fund.liveNav - fund.prevNav).toFixed(2));
  fund.dayChangePct = parseFloat(((fund.navDiffRupees / fund.prevNav) * 100).toFixed(2));

  // Update card UI
  renderFundCards();
  triggerPriceFlash(fund.id, deltaRupees >= 0 ? "green" : "red");

  // Update dashboard portfolio value dynamically
  const newPortVal = (8000 + (fund.liveNav - 90) * 12).toFixed(2);
  if (el.dashLivePortfolioVal) el.dashLivePortfolioVal.textContent = `₹${parseFloat(newPortVal).toLocaleString('en-IN')}`;
  if (el.dashLiveGainPill) {
    const gainRupees = (newPortVal - 8000).toFixed(2);
    const gainPct = ((gainRupees / 8000) * 100).toFixed(1);
    el.dashLiveGainPill.textContent = `+₹${gainRupees} (+${gainPct}%) ▲`;
  }

  showToast(
    `Live Price Move Detected: ${fund.amc}`,
    `${fund.name}: NAV shifted from ₹${oldNav.toFixed(2)} to ₹${fund.liveNav.toFixed(2)} (${deltaRupees >= 0 ? '+' : ''}₹${deltaRupees}). UI updated automatically!`
  );
}

// ============================================================================
// 5. COMPUTATIONS & FILTER LOGIC
// ============================================================================
function computeActiveFilterCount() {
  let count = 0;
  if (state.sort !== "expense_asc") count++;
  if (state.horizon.size > 0) count += state.horizon.size;
  if (state.category.size > 0) count += state.category.size;
  if (state.sector.size > 0) count += state.sector.size;
  if (state.ter !== "any") count++;
  if (state.pe !== "any") count++;
  if (state.exit.size > 0) count += state.exit.size;
  if (state.budget !== "any") count++;
  if (state.risk.size > 0) count += state.risk.size;
  if (state.consistency.size > 0) count += state.consistency.size;
  return count;
}

function updateIndicatorDots() {
  document.getElementById("dot-sort").classList.toggle("active", state.sort !== "expense_asc");
  document.getElementById("dot-horizon").classList.toggle("active", state.horizon.size > 0);
  document.getElementById("dot-category").classList.toggle("active", state.category.size > 0);
  document.getElementById("dot-sector").classList.toggle("active", state.sector.size > 0);
  document.getElementById("dot-ter").classList.toggle("active", state.ter !== "any");
  document.getElementById("dot-valuation").classList.toggle("active", state.pe !== "any");
  document.getElementById("dot-exit").classList.toggle("active", state.exit.size > 0);
  document.getElementById("dot-budget").classList.toggle("active", state.budget !== "any");
  document.getElementById("dot-risk").classList.toggle("active", state.risk.size > 0);
  document.getElementById("dot-consistency").classList.toggle("active", state.consistency.size > 0);
}

function getFilteredFunds() {
  return FUNDS_DATA.filter(fund => {
    // 1. Search Query
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase();
      const match = fund.name.toLowerCase().includes(q) ||
                    fund.amc.toLowerCase().includes(q) ||
                    fund.sector.toLowerCase().includes(q) ||
                    fund.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Horizon
    if (state.horizon.size > 0) {
      if (!state.horizon.has(fund.horizon)) return false;
    }

    // 3. Category
    if (state.category.size > 0) {
      if (!state.category.has(fund.category)) return false;
    }

    // 4. Sector
    if (state.sector.size > 0) {
      if (!state.sector.has(fund.sector)) return false;
    }

    // 5. TER
    if (state.ter === "ultra_low" && fund.ter >= 0.30) return false;
    if (state.ter === "low" && fund.ter >= 0.50) return false;
    if (state.ter === "moderate" && fund.ter >= 0.80) return false;

    // 6. PE
    if (state.pe === "value" && fund.pe >= 20) return false;
    if (state.pe === "balanced" && (fund.pe < 20 || fund.pe > 32)) return false;
    if (state.pe === "growth" && fund.pe <= 32) return false;

    // 7. Exit Load
    if (state.exit.has("zero_exit") && fund.exitLoadType !== "zero_exit") return false;
    if (state.exit.has("quick_exit") && fund.exitDays > 90) return false;

    // 8. Min SIP Budget
    if (state.budget === "100" && fund.minSip > 100) return false;
    if (state.budget === "500" && fund.minSip > 500) return false;
    if (state.budget === "1000" && fund.minSip > 1000) return false;

    // 9. Risk & Downside
    if (state.risk.has("crash_defense") && fund.downsideDefense !== "high") return false;
    if (state.risk.has("low_volatility") && fund.beta >= 0.90) return false;

    // 10. Consistency
    if (state.consistency.has("consistent_outperformer") && fund.rollingConsistency < 75) return false;
    if (state.consistency.has("patient_compounder") && fund.turnover >= 30) return false;

    return true;
  }).sort((a, b) => {
    switch (state.sort) {
      case "expense_asc":
        return a.ter - b.ter;
      case "return_desc":
        return b.return3y - a.return3y;
      case "consistency_desc":
        return b.rollingConsistency - a.rollingConsistency;
      case "aum_desc":
        return b.aumCr - a.aumCr;
      case "pe_asc":
        return a.pe - b.pe;
      default:
        return 0;
    }
  });
}

// ============================================================================
// 6. RENDER DESKTOP FUND CARDS WITH EXACT LIVE PRICE DIFFERENCE
// ============================================================================
function renderFundCards() {
  const filtered = getFilteredFunds();
  const totalCount = filtered.length;

  el.fundsCountLabel.textContent = `Showing ${totalCount} Mutual Funds`;

  const activeCount = computeActiveFilterCount();
  if (activeCount > 0) {
    el.activeFilterBadgeWeb.style.display = "inline-block";
    el.activeFilterBadgeWeb.textContent = `${activeCount} Filters Applied`;
    el.clearAllFiltersQuick.style.display = "flex";
    el.activeFilterSummary.textContent = `Filtered by ${activeCount} active screener parameters`;
  } else {
    el.activeFilterBadgeWeb.style.display = "none";
    el.clearAllFiltersQuick.style.display = "none";
    el.activeFilterSummary.textContent = "All direct plans matching current criteria";
  }

  updateIndicatorDots();
  renderActiveChipsStrip();

  if (totalCount === 0) {
    el.fundsFeedList.innerHTML = "";
    el.emptyStateCard.style.display = "flex";
    lucide.createIcons();
    return;
  }

  el.emptyStateCard.style.display = "none";

  // Build Desktop Fund Cards HTML with Explicit Price Difference
  el.fundsFeedList.innerHTML = filtered.map(fund => {
    const isFeeLow = fund.ter < 0.50;
    const isValuationValue = fund.pe < 22;
    const isCrashDefense = fund.downsideDefense === "high";

    const isPositiveDay = fund.navDiffRupees >= 0;
    const diffSign = isPositiveDay ? "+" : "";
    const changeArrow = isPositiveDay ? "▲" : "▼";

    return `
      <div class="desktop-fund-card" data-fund-id="${fund.id}">
        <!-- Main Row -->
        <div class="dfund-main-row">
          
          <!-- Left: Identity -->
          <div class="dfund-identity-block">
            <div class="dfund-amc-avatar">${fund.amc}</div>
            <div class="dfund-title-area">
              <h3 class="dfund-scheme-name">${fund.name}</h3>
              <div class="dfund-tags-line">
                <span class="tag-badge tag-cat">${fund.category}</span>
                <span class="tag-badge tag-sec">${fund.sector}</span>
                <span class="tag-badge tag-hor">⏱ ${fund.horizonLabel}</span>
                <span class="fund-sebi-risk-tag ${fund.sebiRiskClass || 'high'}">
                  <i data-lucide="gauge" style="width:11px; height:11px;"></i>
                  ${fund.sebiRiskLabel || 'SEBI RISK'}
                </span>
              </div>
            </div>
          </div>

          <!-- Middle: 5-Column Spec Grid with Live Difference & Prev Close -->
          <div class="dfund-specs-block">
            <div class="spec-item">
              <span class="spec-lbl">Live Daily NAV</span>
              <span class="spec-value spec-value-nav">₹${fund.liveNav.toFixed(2)}</span>
              <span class="live-nav-subtext ${isPositiveDay ? 'pos' : 'neg'}">
                ${diffSign}₹${Math.abs(fund.navDiffRupees).toFixed(2)} (${diffSign}${fund.dayChangePct}% ${changeArrow})
              </span>
              <span class="live-prev-close-lbl">Prev: ₹${fund.prevNav.toFixed(2)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-lbl">3Y Ann. Return</span>
              <span class="spec-value positive">${fund.return3y}% ▲</span>
            </div>
            <div class="spec-item">
              <span class="spec-lbl">Expense Ratio</span>
              <span class="spec-value">${fund.ter}%</span>
            </div>
            <div class="spec-item">
              <span class="spec-lbl">Exit Penalty</span>
              <span class="spec-value">${fund.exitDays === 0 ? 'Nil' : fund.exitDays + ' Days'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-lbl">Min Monthly SIP</span>
              <span class="spec-value">₹${fund.minSip}</span>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="dfund-actions-block">
            <button class="btn-web-riskmeter" data-riskmeter-fund="${fund.id}" title="Inspect Official SEBI Risk-o-meter">
              <i data-lucide="gauge"></i>
              <span>Risk-o-meter</span>
            </button>
            <button class="btn-web-ai" data-ai-fund="${fund.id}">
              <i data-lucide="sparkles"></i>
              <span>AI Reality Check</span>
            </button>
            <button class="btn-web-chevron" data-expand-fund="${fund.id}" title="Toggle Detailed Analytics">
              <i data-lucide="chevron-down"></i>
            </button>
            <button class="btn-web-sip" data-sip-fund="${fund.id}">
              <span>Start SIP</span>
              <i data-lucide="arrow-right"></i>
            </button>
          </div>

        </div>

        <!-- Highlight Feature Chips -->
        <div class="dfund-highlights-row">
          <span class="highlight-chip live-amfi">
            <span class="amfi-pulse-dot" style="width:6px; height:6px;"></span>
            AMFI Code: ${fund.amfiCode} • Latest NAV Date: ${fund.navDate}
          </span>
          <span class="highlight-chip" style="background: #EFF6FF; color: #1E40AF; cursor: pointer;" data-riskmeter-fund="${fund.id}">
            📊 SEBI Risk: ${fund.sebiRisk} (${fund.sebiRiskScore}/6.0)
          </span>
          ${isFeeLow ? `<span class="highlight-chip green">⚡ Low Direct Fee (${fund.ter}%)</span>` : ''}
          ${isCrashDefense ? `<span class="highlight-chip blue">🛡️ High Crash Defense (Sortino > 1.8)</span>` : ''}
          ${isValuationValue ? `<span class="highlight-chip amber">💎 Value Margin of Safety (P/E ${fund.pe})</span>` : ''}
          <span class="highlight-chip" style="background:#F1F5F9; color:#475569;">Turnover: ${fund.turnover}%</span>
          <span class="highlight-chip" style="background:#F8FAFC; color:#64748B;">AUM: ₹${fund.aumCr.toLocaleString('en-IN')} Cr</span>
        </div>

        <!-- Collapsible Details Drawer with 5-Day Historical NAV Table -->
        <div class="dfund-expanded-panel" id="drawer-${fund.id}" style="display: none;">
          <div class="panel-stats-grid">
            <div class="panel-stat">
              <span class="stat-lbl">Valuation Multiples:</span>
              <span class="stat-data">P/E ${fund.pe} • P/B ${fund.pb}</span>
            </div>
            <div class="panel-stat">
              <span class="stat-lbl">Benchmark Consistency:</span>
              <span class="stat-data">${fund.rollingConsistency}% of 3Y rolling cycles beat index</span>
            </div>
            <div class="panel-stat">
              <span class="stat-lbl">Volatility (Beta):</span>
              <span class="stat-data">Beta ${fund.beta} (Index = 1.00)</span>
            </div>
            <div class="panel-stat">
              <span class="stat-lbl">Top Stock Holdings:</span>
              <div class="holdings-tags-line">
                ${fund.topHoldings.map(h => `<span class="h-tag">${h}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- 5-Day Historical AMFI Trajectory Table -->
          <div class="amfi-history-section">
            <div class="history-title">
              <i data-lucide="line-chart" style="width:14px; height:14px; color:#2563EB;"></i>
              <span>AMFI Live 5-Day Historical Price Movement & Daily Net Difference</span>
            </div>
            <table class="amfi-history-table">
              <thead>
                <tr>
                  <th>Trade Date</th>
                  <th>Closing Daily NAV</th>
                  <th>Daily Price Difference (Delta)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${(fund.history5D && fund.history5D.length > 0) ? fund.history5D.map((h, i) => `
                  <tr>
                    <td><strong>${h.date}</strong></td>
                    <td>₹${h.nav}</td>
                    <td style="font-weight:700; color: ${h.diff.includes('+') ? '#059669' : (h.diff.includes('-') ? '#DC2626' : '#64748B')};">${h.diff}</td>
                    <td><span style="font-size:10px; color:#64748B;">${i === 0 ? '🟢 Latest Verified' : 'Historical AMFI Close'}</span></td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td>${fund.navDate}</td>
                    <td>₹${fund.liveNav.toFixed(2)}</td>
                    <td style="color:#059669;">+₹${fund.navDiffRupees.toFixed(2)} (+${fund.dayChangePct}%)</td>
                    <td>Latest Verified</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
  attachCardListeners();
}

function renderActiveChipsStrip() {
  const chips = [];

  if (state.sort !== "expense_asc") {
    chips.push({ label: `Sort: ${state.sort.replace('_', ' ')}`, type: "sort" });
  }
  state.horizon.forEach(val => chips.push({ label: `Horizon: ${val}`, type: "horizon", val }));
  state.category.forEach(val => chips.push({ label: val, type: "category", val }));
  state.sector.forEach(val => chips.push({ label: val, type: "sector", val }));
  if (state.ter !== "any") chips.push({ label: `TER: ${state.ter}`, type: "ter" });
  if (state.pe !== "any") chips.push({ label: `P/E: ${state.pe}`, type: "pe" });
  state.exit.forEach(val => chips.push({ label: val === "zero_exit" ? "Zero Exit Penalty" : "Quick Exit", type: "exit", val }));
  if (state.budget !== "any") chips.push({ label: `Min ₹${state.budget} SIP`, type: "budget" });
  state.risk.forEach(val => chips.push({ label: val === "crash_defense" ? "Crash Defense" : "Low Beta", type: "risk", val }));
  state.consistency.forEach(val => chips.push({ label: val === "consistent_outperformer" ? "Consistent Outperformer" : "Low Churn", type: "consistency", val }));

  el.activeChipsStrip.innerHTML = chips.map(c => `
    <span class="active-chip-tag">
      ${c.label}
      <button data-remove-type="${c.type}" data-remove-val="${c.val || ''}">&times;</button>
    </span>
  `).join('');

  el.activeChipsStrip.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-remove-type");
      const val = btn.getAttribute("data-remove-val");
      removeFilter(type, val);
    });
  });
}

function removeFilter(type, val) {
  if (type === "sort") state.sort = "expense_asc";
  if (type === "horizon") state.horizon.delete(val);
  if (type === "category") state.category.delete(val);
  if (type === "sector") state.sector.delete(val);
  if (type === "ter") state.ter = "any";
  if (type === "pe") state.pe = "any";
  if (type === "exit") state.exit.delete(val);
  if (type === "budget") state.budget = "any";
  if (type === "risk") state.risk.delete(val);
  if (type === "consistency") state.consistency.delete(val);

  syncFormInputs();
  syncQuickPills();
  renderFundCards();
}

function resetAllFilters() {
  state.sort = "expense_asc";
  state.horizon.clear();
  state.category.clear();
  state.sector.clear();
  state.ter = "any";
  state.pe = "any";
  state.exit.clear();
  state.budget = "any";
  state.risk.clear();
  state.consistency.clear();
  state.searchQuery = "";
  el.searchInput.value = "";
  el.clearSearchBtn.style.display = "none";

  syncFormInputs();
  syncQuickPills();
  renderFundCards();
}

// ============================================================================
// 7. SYNCHRONIZATION
// ============================================================================
function syncFormInputs() {
  const sortR = document.querySelector(`input[name="sortOption"][value="${state.sort}"]`);
  if (sortR) sortR.checked = true;

  document.querySelectorAll('input[name="horizonOption"]').forEach(cb => {
    cb.checked = state.horizon.has(cb.value);
  });
  document.querySelectorAll('input[name="catOption"]').forEach(cb => {
    cb.checked = state.category.has(cb.value);
  });
  document.querySelectorAll('input[name="sectorOption"]').forEach(cb => {
    cb.checked = state.sector.has(cb.value);
  });

  const terR = document.querySelector(`input[name="terOption"][value="${state.ter}"]`);
  if (terR) terR.checked = true;

  const peR = document.querySelector(`input[name="peOption"][value="${state.pe}"]`);
  if (peR) peR.checked = true;

  document.querySelectorAll('input[name="exitOption"]').forEach(cb => {
    cb.checked = state.exit.has(cb.value);
  });

  const bR = document.querySelector(`input[name="budgetOption"][value="${state.budget}"]`);
  if (bR) bR.checked = true;

  document.querySelectorAll('input[name="riskOption"]').forEach(cb => {
    cb.checked = state.risk.has(cb.value);
  });
  document.querySelectorAll('input[name="consistencyOption"]').forEach(cb => {
    cb.checked = state.consistency.has(cb.value);
  });
}

function syncQuickPills() {
  el.quickPills.forEach(pill => {
    const q = pill.getAttribute("data-quick");
    let active = false;
    if (q === "min_sip_100" && state.budget === "100") active = true;
    if (q === "min_sip_500" && state.budget === "500") active = true;
    if (q === "low_fee" && (state.ter === "low" || state.ter === "ultra_low")) active = true;
    if (q === "crash_defense" && state.risk.has("crash_defense")) active = true;
    if (q === "sector_healthcare" && state.sector.has("Healthcare & Pharma")) active = true;
    if (q === "sector_banking" && state.sector.has("Banking & Financial Services")) active = true;
    if (q === "cat_index" && state.category.has("Index / ETF")) active = true;
    if (q === "wealth_builder" && state.horizon.has("wealth")) active = true;

    pill.classList.toggle("active", active);
  });
}

function readSidebarInputs() {
  const sortR = document.querySelector('input[name="sortOption"]:checked');
  if (sortR) state.sort = sortR.value;

  state.horizon.clear();
  document.querySelectorAll('input[name="horizonOption"]:checked').forEach(cb => state.horizon.add(cb.value));

  state.category.clear();
  document.querySelectorAll('input[name="catOption"]:checked').forEach(cb => state.category.add(cb.value));

  state.sector.clear();
  document.querySelectorAll('input[name="sectorOption"]:checked').forEach(cb => state.sector.add(cb.value));

  const terR = document.querySelector('input[name="terOption"]:checked');
  if (terR) state.ter = terR.value;

  const peR = document.querySelector('input[name="peOption"]:checked');
  if (peR) state.pe = peR.value;

  state.exit.clear();
  document.querySelectorAll('input[name="exitOption"]:checked').forEach(cb => state.exit.add(cb.value));

  const bR = document.querySelector('input[name="budgetOption"]:checked');
  if (bR) state.budget = bR.value;

  state.risk.clear();
  document.querySelectorAll('input[name="riskOption"]:checked').forEach(cb => state.risk.add(cb.value));

  state.consistency.clear();
  document.querySelectorAll('input[name="consistencyOption"]:checked').forEach(cb => state.consistency.add(cb.value));

  syncQuickPills();
  renderFundCards();
}

// ============================================================================
// 8. CARD LISTENERS & MODALS
// ============================================================================
function attachCardListeners() {
  // Expand chevron
  document.querySelectorAll(".btn-web-chevron").forEach(btn => {
    btn.addEventListener("click", () => {
      const fundId = btn.getAttribute("data-expand-fund");
      const drawer = document.getElementById(`drawer-${fundId}`);
      if (drawer) {
        const isHidden = drawer.style.display === "none";
        drawer.style.display = isHidden ? "flex" : "none";
        btn.innerHTML = isHidden ? `<i data-lucide="chevron-up"></i>` : `<i data-lucide="chevron-down"></i>`;
        lucide.createIcons();
      }
    });
  });

  // Risk-o-meter button & badge click
  document.querySelectorAll(".btn-web-riskmeter, [data-riskmeter-fund]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const fundId = btn.getAttribute("data-riskmeter-fund");
      if (fundId) {
        switchView("tab-riskmeter");
      }
    });
  });

  // AI Reality Check
  document.querySelectorAll(".btn-web-ai").forEach(btn => {
    btn.addEventListener("click", () => {
      const fundId = btn.getAttribute("data-ai-fund");
      const fund = FUNDS_DATA.find(f => f.id === fundId);
      if (fund) openAiRealityModal(fund);
    });
  });

  // Start SIP
  document.querySelectorAll(".btn-web-sip").forEach(btn => {
    btn.addEventListener("click", () => {
      const fundId = btn.getAttribute("data-sip-fund");
      const fund = FUNDS_DATA.find(f => f.id === fundId);
      if (fund) openSipModal(fund);
    });
  });
}

// AI Reality Check Modal
function openAiRealityModal(fund) {
  state.selectedFundForModal = fund;
  const sim = fund.realitySim;
  const isHighRisk = fund.beta > 1.05 || fund.category === "Small Cap";

  el.aiModalBody.innerHTML = `
    <div class="ai-scheme-header">
      <h3>${fund.name}</h3>
      <p>${fund.category} • ${fund.sector} • AMFI Code: <strong>${fund.amfiCode}</strong></p>
      <div style="margin-top:8px; font-size:12px; color:#047857; font-weight:700; background:#ECFDF5; padding:6px 10px; border-radius:6px; border:1px solid #A7F3D0;">
        🟢 Live AMFI Daily NAV: ₹${fund.liveNav.toFixed(2)} 
        <span style="color:${fund.navDiffRupees >= 0 ? '#059669' : '#DC2626'}; font-weight:800;">
          (${fund.navDiffRupees >= 0 ? '+' : ''}₹${Math.abs(fund.navDiffRupees).toFixed(2)} / ${fund.dayChangePct}%)
        </span>
        • Dated: ${fund.navDate}
      </div>
    </div>

    <!-- 12-Month Timeline -->
    <div class="ai-card-block">
      <div class="ai-card-title">
        <i data-lucide="clock" style="color: #0284C7; width: 17px; height: 17px;"></i>
        <span>12-Month Reality Simulator (What Months 3–8 Actually Feel Like)</span>
      </div>
      <p class="ai-card-text">
        Based on rolling 10-year historical data, first-time investors encounter the 
        <strong>"Underwhelming Plateau"</strong> during <strong>${sim.underwhelmingWindow}</strong>:
      </p>

      <div class="ai-timeline-milestones">
        <div class="timeline-item">
          <span class="timeline-tag">Month 1–3</span>
          <span class="timeline-desc">Excitement phase. Portfolio mirrors cash deposits. Nominal gains look very small.</span>
        </div>
        <div class="timeline-item">
          <span class="timeline-tag" style="background: #FEE2E2; color: #991B1B;">Month 4–7</span>
          <span class="timeline-desc">
            <strong>The Drop-Off Danger Zone:</strong> Historically, this fund experienced temporary mid-year drawdowns of 
            <strong style="color: #DC2626;">${sim.expectedDropRange}</strong>. 
            At 6 months, an investor with ₹1,000/mo has invested ₹6,000 and seen a nominal profit of only 
            <em>${sim.nominalGainM6}</em>.
          </span>
        </div>
        <div class="timeline-item">
          <span class="timeline-tag" style="background: #ECFDF5; color: #065F46;">Month 8–12</span>
          <span class="timeline-desc">Compounding acceleration. Earlier dip purchases begin generating noticeable returns.</span>
        </div>
      </div>
    </div>

    <!-- Psychology & Bias Check -->
    <div class="ai-card-block ${isHighRisk ? 'warning' : ''}">
      <div class="ai-card-title">
        <i data-lucide="brain-circuit" style="color: ${isHighRisk ? '#D97706' : '#059669'}; width: 17px; height: 17px;"></i>
        <span>Discipline & Behavioral Alignment Check</span>
      </div>
      <p class="ai-card-text">${sim.psychologyNote}</p>
    </div>

    <!-- Holding Duration Alignment -->
    <div class="ai-card-block" style="background: #F1F5F9;">
      <div class="ai-card-title">
        <i data-lucide="shield-check" style="color: #0F172A; width: 17px; height: 17px;"></i>
        <span>Holding Horizon Safe Fallback</span>
      </div>
      <p class="ai-card-text">
        <strong>Mandated Duration:</strong> This scheme requires an investment horizon of 
        <strong>${fund.horizonLabel}</strong>. If your financial goal is within 12 months, our safe objective gate recommends liquid or arbitrage funds instead.
      </p>
    </div>
  `;

  el.aiModalBackdrop.style.display = "flex";
  lucide.createIcons();
}

function closeAiModal() {
  el.aiModalBackdrop.style.display = "none";
}

// SIP Setup Modal
function openSipModal(fund) {
  state.selectedFundForModal = fund;
  el.setupSchemeTitle.textContent = `${fund.name} (Live NAV: ₹${fund.liveNav.toFixed(2)})`;
  el.sipAmountInput.value = fund.minSip >= 500 ? fund.minSip : 500;

  el.amtChips.forEach(chip => {
    const amt = parseInt(chip.getAttribute("data-amt"));
    chip.classList.toggle("active", amt === parseInt(el.sipAmountInput.value));
  });

  el.sipModalBackdrop.style.display = "flex";
  lucide.createIcons();
}

function closeSipModal() {
  el.sipModalBackdrop.style.display = "none";
}

function handleConfirmSip() {
  const fund = state.selectedFundForModal;
  if (!fund) return;

  const amount = parseInt(el.sipAmountInput.value) || 1000;
  const activeDateChip = document.querySelector(".date-chip.active");
  const debitDate = activeDateChip ? activeDateChip.getAttribute("data-date") : "5";

  const newSip = {
    id: `active-${Date.now()}`,
    fundName: fund.name,
    sipAmount: amount,
    debitDate: parseInt(debitDate),
    monthsActive: 1,
    totalInvested: amount,
    nextDebit: `${debitDate}th Dec 2026`,
    status: "Active (Discipline Streak)"
  };

  state.activeSipsList.unshift(newSip);
  updateActiveSipsTab();
  closeSipModal();

  showToast("Monthly SIP Activated!", `₹${amount.toLocaleString('en-IN')}/mo locked for ${fund.name}. Next debit on ${debitDate}th.`);
}

function updateActiveSipsTab() {
  el.topNavSipCount.textContent = state.activeSipsList.length;

  el.activeSipsContainer.innerHTML = state.activeSipsList.map(sip => `
    <div class="active-sip-web-card">
      <div class="asip-head">
        <strong>${sip.fundName}</strong>
        <span class="asip-status">${sip.status}</span>
      </div>
      <div class="asip-meta-grid">
        <div class="asip-meta-item">
          <span class="m-lbl">Monthly SIP:</span>
          <span class="m-data">₹${sip.sipAmount.toLocaleString('en-IN')}/mo</span>
        </div>
        <div class="asip-meta-item">
          <span class="m-lbl">Salary Synced Date:</span>
          <span class="m-data">${sip.debitDate}th of every month</span>
        </div>
        <div class="asip-meta-item">
          <span class="m-lbl">Retention Habit:</span>
          <span class="m-data">Month ${sip.monthsActive} of 12</span>
        </div>
        <div class="asip-meta-item">
          <span class="m-lbl">Next Auto-Debit:</span>
          <span class="m-data">${sip.nextDebit}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function showToast(title, message) {
  el.toastTitle.textContent = title;
  el.toastMessage.textContent = message;
  el.toastNotification.style.display = "flex";
  lucide.createIcons();

  setTimeout(() => {
    el.toastNotification.style.display = "none";
  }, 4000);
}

// ============================================================================
// 9. EVENT HANDLERS
// ============================================================================
function setupEventListeners() {
  // Brand Logo click -> Back to Explore
  el.brandHomeBtn.addEventListener("click", () => {
    switchView("tab-explore");
  });

  // Top Nav Links
  el.webNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetTab = link.getAttribute("data-tab");
      switchView(targetTab);
    });
  });

  // Buttons that switch views
  document.querySelectorAll("[data-switch-to]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-switch-to");
      switchView(target);
    });
  });

  // Live AMFI Manual Refresh
  if (el.refreshAmfiBtn) {
    el.refreshAmfiBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      syncAllAmfiNavs(true);
    });
  }
  if (el.amfiSyncBadge) {
    el.amfiSyncBadge.addEventListener("click", () => {
      syncAllAmfiNavs(true);
    });
  }

  // Demo Simulation Button (Simulate a live price change)
  if (el.simulateTickBtn) {
    el.simulateTickBtn.addEventListener("click", () => {
      simulateMarketTick();
    });
  }

  // Search Input
  el.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    el.clearSearchBtn.style.display = state.searchQuery ? "flex" : "none";
    renderFundCards();
  });

  el.clearSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    el.searchInput.value = "";
    el.clearSearchBtn.style.display = "none";
    renderFundCards();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.activeElement === el.searchInput) {
      state.searchQuery = "";
      el.searchInput.value = "";
      el.clearSearchBtn.style.display = "none";
      el.searchInput.blur();
      renderFundCards();
    }
  });

  // Quick Pills
  el.quickPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const q = pill.getAttribute("data-quick");

      if (q === "min_sip_100") state.budget = state.budget === "100" ? "any" : "100";
      else if (q === "min_sip_500") state.budget = state.budget === "500" ? "any" : "500";
      else if (q === "low_fee") state.ter = state.ter === "low" ? "any" : "low";
      else if (q === "crash_defense") {
        if (state.risk.has("crash_defense")) state.risk.delete("crash_defense");
        else state.risk.add("crash_defense");
      } else if (q === "sector_healthcare") {
        if (state.sector.has("Healthcare & Pharma")) state.sector.delete("Healthcare & Pharma");
        else state.sector.add("Healthcare & Pharma");
      } else if (q === "sector_banking") {
        if (state.sector.has("Banking & Financial Services")) state.sector.delete("Banking & Financial Services");
        else state.sector.add("Banking & Financial Services");
      } else if (q === "cat_index") {
        if (state.category.has("Index / ETF")) state.category.delete("Index / ETF");
        else state.category.add("Index / ETF");
      } else if (q === "wealth_builder") {
        if (state.horizon.has("wealth")) state.horizon.delete("wealth");
        else state.horizon.add("wealth");
      }

      syncFormInputs();
      syncQuickPills();
      renderFundCards();
    });
  });

  // Sidebar changes
  const sidebarContent = document.querySelector(".sidebar-scrollable-content");
  if (sidebarContent) {
    sidebarContent.addEventListener("change", () => {
      readSidebarInputs();
    });
  }

  // Resets
  el.sidebarResetBtn.addEventListener("click", resetAllFilters);
  el.clearAllFiltersQuick.addEventListener("click", resetAllFilters);
  el.resetEmptyBtn.addEventListener("click", resetAllFilters);

  // Modals Close
  el.closeAiModalBtn.addEventListener("click", closeAiModal);
  el.aiProceedToSipBtn.addEventListener("click", () => {
    closeAiModal();
    if (state.selectedFundForModal) openSipModal(state.selectedFundForModal);
  });

  el.closeSipModalBtn.addEventListener("click", closeSipModal);
  el.confirmSipBtn.addEventListener("click", handleConfirmSip);

  // Amount Quick Chips
  el.amtChips.forEach(chip => {
    chip.addEventListener("click", () => {
      el.amtChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      el.sipAmountInput.value = chip.getAttribute("data-amt");
    });
  });

  // Date Chips
  el.dateChips.forEach(chip => {
    chip.addEventListener("click", () => {
      el.dateChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  // Click outside to close modals
  el.aiModalBackdrop.addEventListener("click", (e) => {
    if (e.target === el.aiModalBackdrop) closeAiModal();
  });
  el.sipModalBackdrop.addEventListener("click", (e) => {
    if (e.target === el.sipModalBackdrop) closeSipModal();
  });
}

// ============================================================================
// 9. INDIAN STOCKS RISK-O-METER & WHEN-TO-BUY TIMING INTELLIGENCE ENGINE
// ============================================================================

function initStockRiskMeter() {
  const stockSelectDropdown = document.getElementById("stockSelectDropdown");
  const stockSearchInput = document.getElementById("stockSearchInput");
  const stockClearSearchBtn = document.getElementById("stockClearSearchBtn");
  const stockQuickPills = document.getElementById("stockQuickPills");
  const screenerTableSearch = document.getElementById("screenerTableSearch");

  // 1. Populate Dropdown
  populateStockDropdown();

  // 2. Render Quick Pills
  renderStockQuickPills();

  // 3. Render 20-Stock Screener Table
  renderStockScreenerTable("");

  // 4. Dropdown change listener
  if (stockSelectDropdown) {
    stockSelectDropdown.addEventListener("change", (e) => {
      selectStockForRiskMeter(e.target.value);
    });
  }

  // 5. Stock Search listener
  if (stockSearchInput) {
    stockSearchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (stockClearSearchBtn) {
        stockClearSearchBtn.style.display = q ? "flex" : "none";
      }
      filterStockDropdown(q);
    });
  }

  if (stockClearSearchBtn && stockSearchInput) {
    stockClearSearchBtn.addEventListener("click", () => {
      stockSearchInput.value = "";
      stockClearSearchBtn.style.display = "none";
      populateStockDropdown();
      stockSearchInput.focus();
    });
  }

  // 6. Screener Table Search listener
  if (screenerTableSearch) {
    screenerTableSearch.addEventListener("input", (e) => {
      renderStockScreenerTable(e.target.value.trim().toLowerCase());
    });
  }

  // 7. Chart Timeframe Buttons
  const tfBtns = document.querySelectorAll(".tf-btn");
  tfBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tfBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tf = btn.getAttribute("data-tf") || "6M";
      state.stockRisk.chartTimeframe = tf;
      const currentStock = STOCKS_DATA.find(s => s.id === state.stockRisk.selectedStockId) || STOCKS_DATA[0];
      renderStockPriceChart(currentStock, tf);
    });
  });

  // 8. Select Default Stock
  selectStockForRiskMeter(state.stockRisk.selectedStockId || "reliance");
}

function onOpenStockRiskMeterView() {
  const currentStock = STOCKS_DATA.find(s => s.id === state.stockRisk.selectedStockId) || STOCKS_DATA[0];
  updateStockMeterUI(currentStock);
  renderStockPriceChart(currentStock, state.stockRisk.chartTimeframe || "6M");
  if (window.lucide) window.lucide.createIcons();
}

function populateStockDropdown() {
  const dropdown = document.getElementById("stockSelectDropdown");
  if (!dropdown) return;
  dropdown.innerHTML = "";

  // Group by sector
  const sectors = {};
  STOCKS_DATA.forEach(stock => {
    if (!sectors[stock.sector]) sectors[stock.sector] = [];
    sectors[stock.sector].push(stock);
  });

  Object.keys(sectors).forEach(sector => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = sector;
    sectors[sector].forEach(stock => {
      const opt = document.createElement("option");
      opt.value = stock.id;
      opt.textContent = `${stock.name} (${stock.ticker.replace("NSE: ", "")}) - ₹${stock.cmp.toFixed(2)}`;
      if (stock.id === state.stockRisk.selectedStockId) opt.selected = true;
      optgroup.appendChild(opt);
    });
    dropdown.appendChild(optgroup);
  });
}

function filterStockDropdown(query) {
  const dropdown = document.getElementById("stockSelectDropdown");
  if (!dropdown) return;
  if (!query) {
    populateStockDropdown();
    return;
  }

  dropdown.innerHTML = "";
  const matched = STOCKS_DATA.filter(s => 
    s.name.toLowerCase().includes(query) || 
    s.ticker.toLowerCase().includes(query) ||
    s.sector.toLowerCase().includes(query)
  );

  if (matched.length === 0) {
    const opt = document.createElement("option");
    opt.disabled = true;
    opt.textContent = "No stocks match search query";
    dropdown.appendChild(opt);
    return;
  }

  matched.forEach(stock => {
    const opt = document.createElement("option");
    opt.value = stock.id;
    opt.textContent = `${stock.name} (${stock.ticker.replace("NSE: ", "")}) - ₹${stock.cmp.toFixed(2)}`;
    if (stock.id === state.stockRisk.selectedStockId) opt.selected = true;
    dropdown.appendChild(opt);
  });

  // Auto-select first match if current is not in results
  if (!matched.some(s => s.id === state.stockRisk.selectedStockId)) {
    selectStockForRiskMeter(matched[0].id);
  }
}

function renderStockQuickPills() {
  const container = document.getElementById("stockQuickPills");
  if (!container) return;

  const popular = ["reliance", "tatamotors", "hdfcbank", "tcs", "zomato", "sbin", "itc", "lt", "infy", "titan"];
  container.innerHTML = "";

  popular.forEach(id => {
    const stock = STOCKS_DATA.find(s => s.id === id);
    if (!stock) return;
    const btn = document.createElement("button");
    btn.className = `stock-pill-btn ${stock.id === state.stockRisk.selectedStockId ? "active" : ""}`;
    btn.innerHTML = `<span>${stock.name.split(" ")[0]}</span> <small style="opacity: 0.7;">₹${stock.cmp.toFixed(0)}</small>`;
    btn.addEventListener("click", () => {
      selectStockForRiskMeter(stock.id);
    });
    container.appendChild(btn);
  });
}

function selectStockForRiskMeter(stockId) {
  const stock = STOCKS_DATA.find(s => s.id === stockId);
  if (!stock) return;

  state.stockRisk.selectedStockId = stockId;

  // Sync Dropdown
  const dropdown = document.getElementById("stockSelectDropdown");
  if (dropdown && dropdown.value !== stockId) {
    dropdown.value = stockId;
  }

  // Sync Quick Pills
  const pills = document.querySelectorAll(".stock-pill-btn");
  pills.forEach(pill => {
    const stockShort = stock.name.split(" ")[0];
    pill.classList.toggle("active", pill.textContent.includes(stockShort));
  });

  // Sync Screener Table Selected Row
  const rows = document.querySelectorAll("#stockScreenerTbody tr");
  rows.forEach(tr => {
    tr.classList.toggle("row-selected", tr.getAttribute("data-stock-id") === stockId);
  });

  // Update UI & Chart
  updateStockMeterUI(stock);
  renderStockPriceChart(stock, state.stockRisk.chartTimeframe || "6M");

  if (window.lucide) window.lucide.createIcons();
}

function updateStockMeterUI(stock) {
  // Hero Identity
  const logo = document.getElementById("stockLogoBadge");
  const name = document.getElementById("stockHeroName");
  const ticker = document.getElementById("stockHeroTicker");
  const cap = document.getElementById("stockHeroCap");
  const sector = document.getElementById("stockHeroSector");
  const desc = document.getElementById("stockHeroDesc");
  const cmp = document.getElementById("stockHeroCmp");
  const changeBadge = document.getElementById("stockHeroChangeBadge");
  const changeTxt = document.getElementById("stockHeroChange");

  if (logo) logo.textContent = stock.logo;
  if (name) name.textContent = stock.name;
  if (ticker) ticker.textContent = stock.ticker;
  if (cap) cap.textContent = stock.cap;
  if (sector) sector.textContent = stock.sector;
  if (desc) desc.textContent = stock.desc;
  if (cmp) cmp.textContent = stock.cmp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  if (changeBadge && changeTxt) {
    changeTxt.textContent = stock.change + " Today";
    changeBadge.className = "cmp-change-row " + (stock.isPositive ? "positive" : "negative");
    const icon = changeBadge.querySelector("i");
    if (icon) {
      icon.setAttribute("data-lucide", stock.isPositive ? "trending-up" : "trending-down");
    }
  }

  // Risk Gauge Needle & Score
  const needleGroup = document.getElementById("gaugeNeedleGroup");
  const scoreNum = document.getElementById("gaugeScoreNum");
  const tierBadge = document.getElementById("riskTierBadge");
  const riskHdr = document.getElementById("riskSummaryHeading");
  const riskTxt = document.getElementById("riskSummaryText");

  if (scoreNum) scoreNum.textContent = stock.riskScore;
  if (tierBadge) {
    tierBadge.textContent = stock.riskTierLabel;
    tierBadge.className = "risk-badge-tier " + stock.riskTier;
  }
  if (riskHdr) riskHdr.textContent = stock.riskSummaryHeading;
  if (riskTxt) riskTxt.textContent = stock.riskSummary;

  // Animate Gauge Needle: map riskScore (0 to 100) to degrees (-90 to +90)
  if (needleGroup) {
    const angle = -90 + (stock.riskScore / 100) * 180;
    needleGroup.setAttribute("transform", `rotate(${angle}, 160, 150)`);
  }

  // 4 Micro Factors
  const betaVal = document.getElementById("metricBetaVal");
  const betaBar = document.getElementById("metricBetaBar");
  const volVal = document.getElementById("metricVolVal");
  const volBar = document.getElementById("metricVolBar");
  const peVal = document.getElementById("metricPeVal");
  const peBar = document.getElementById("metricPeBar");
  const debtVal = document.getElementById("metricDebtVal");
  const debtBar = document.getElementById("metricDebtBar");

  if (betaVal) betaVal.textContent = stock.betaLabel;
  if (betaBar) betaBar.style.width = Math.min(100, stock.betaWidth) + "%";
  if (volVal) volVal.textContent = stock.volatility;
  if (volBar) volBar.style.width = Math.min(100, stock.volWidth) + "%";
  if (peVal) peVal.textContent = stock.peLabel;
  if (peBar) peBar.style.width = Math.min(100, stock.peWidth) + "%";
  if (debtVal) debtVal.textContent = stock.debtLabel;
  if (debtBar) debtBar.style.width = Math.min(100, stock.debtWidth) + "%";

  // When to Buy Timing Card
  const timingStatusBadge = document.getElementById("timingStatusBadge");
  const timingVerdictBanner = document.getElementById("timingVerdictBanner");
  const verdictIcon = document.getElementById("verdictIcon");
  const verdictConfidence = document.getElementById("verdictConfidence");
  const verdictTitle = document.getElementById("verdictTitle");
  const verdictReason = document.getElementById("verdictReason");

  if (timingStatusBadge) {
    timingStatusBadge.textContent = stock.verdictBadge;
    timingStatusBadge.className = "timing-badge-status " + (
      stock.verdictType === "prime-buy" ? "badge-prime" :
      stock.verdictType === "buy-dips" ? "badge-dips" :
      stock.verdictType === "wait-pullback" ? "badge-wait" : "badge-overbought"
    );
  }

  if (timingVerdictBanner) {
    timingVerdictBanner.className = "timing-verdict-banner " + (
      stock.verdictType === "prime-buy" ? "verdict-prime-buy" :
      stock.verdictType === "buy-dips" ? "verdict-buy-dips" :
      stock.verdictType === "wait-pullback" ? "verdict-wait-pullback" : "verdict-overbought"
    );
  }

  if (verdictIcon) {
    const icName = stock.verdictType === "prime-buy" ? "check-circle-2" :
                   stock.verdictType === "buy-dips" ? "clock" :
                   stock.verdictType === "wait-pullback" ? "pause-circle" : "alert-triangle";
    verdictIcon.setAttribute("data-lucide", icName);
  }

  if (verdictConfidence) verdictConfidence.textContent = stock.verdictConfidence;
  if (verdictTitle) verdictTitle.textContent = stock.verdictTitle;
  if (verdictReason) verdictReason.textContent = stock.verdictReason;

  // Buy Range & Key Technicals
  const cmpBuyStatus = document.getElementById("cmpBuyStatus");
  const recommendedBuyRange = document.getElementById("recommendedBuyRange");
  const valSupport1 = document.getElementById("valSupport1");
  const hintSupport1 = document.getElementById("hintSupport1");
  const valSupport2 = document.getElementById("valSupport2");
  const hintSupport2 = document.getElementById("hintSupport2");
  const valStopLoss = document.getElementById("valStopLoss");
  const hintStopLoss = document.getElementById("hintStopLoss");
  const valTargets = document.getElementById("valTargets");
  const hintRrRatio = document.getElementById("hintRrRatio");

  if (cmpBuyStatus) cmpBuyStatus.textContent = stock.cmpStatus;
  if (recommendedBuyRange) recommendedBuyRange.textContent = stock.buyRange;
  if (valSupport1) valSupport1.textContent = stock.support1;
  if (hintSupport1) hintSupport1.textContent = stock.hintSupport1;
  if (valSupport2) valSupport2.textContent = stock.support2;
  if (hintSupport2) hintSupport2.textContent = stock.hintSupport2;
  if (valStopLoss) valStopLoss.textContent = stock.stopLoss;
  if (hintStopLoss) hintStopLoss.textContent = stock.hintStopLoss;
  if (valTargets) valTargets.textContent = stock.targets;
  if (hintRrRatio) hintRrRatio.textContent = "Risk : Reward = " + stock.rrRatio;

  // RSI Momentum
  const rsiStatusBadge = document.getElementById("rsiStatusBadge");
  const rsiPointer = document.getElementById("rsiPointer");
  const rsiPointerVal = document.getElementById("rsiPointerVal");

  if (rsiStatusBadge) rsiStatusBadge.textContent = stock.rsiStatus;
  if (rsiPointer) rsiPointer.style.left = Math.min(96, Math.max(4, stock.rsi)) + "%";
  if (rsiPointerVal) rsiPointerVal.textContent = stock.rsi.toFixed(1);

  // Tranche Strategy
  const trancheHeading = document.getElementById("trancheHeading");
  const trancheDesc = document.getElementById("trancheDesc");
  if (trancheHeading) trancheHeading.textContent = stock.trancheHeading;
  if (trancheDesc) trancheDesc.textContent = stock.trancheDesc;

  // 8 Deep Fundamental Specs
  const spec52High = document.getElementById("spec52High");
  const specDrawdown = document.getElementById("specDrawdown");
  const spec52Low = document.getElementById("spec52Low");
  const specCushion = document.getElementById("specCushion");
  const specPeRatio = document.getElementById("specPeRatio");
  const specPeMedian = document.getElementById("specPeMedian");
  const specPbRatio = document.getElementById("specPbRatio");
  const specBookVal = document.getElementById("specBookVal");
  const specRoe = document.getElementById("specRoe");
  const specRoce = document.getElementById("specRoce");
  const specInstHolding = document.getElementById("specInstHolding");
  const specPledge = document.getElementById("specPledge");
  const specDebtEq = document.getElementById("specDebtEq");
  const specIntCover = document.getElementById("specIntCover");
  const specDivYield = document.getElementById("specDivYield");
  const specPayout = document.getElementById("specPayout");

  if (spec52High) spec52High.textContent = stock.high52;
  if (specDrawdown) specDrawdown.textContent = stock.drawdown;
  if (spec52Low) spec52Low.textContent = stock.low52;
  if (specCushion) specCushion.textContent = stock.cushion;
  if (specPeRatio) specPeRatio.textContent = stock.peVal;
  if (specPeMedian) specPeMedian.textContent = stock.peMedian;
  if (specPbRatio) specPbRatio.textContent = stock.pbVal;
  if (specBookVal) specBookVal.textContent = stock.bookVal;
  if (specRoe) specRoe.textContent = stock.roeVal;
  if (specRoce) specRoce.textContent = stock.roceVal;
  if (specInstHolding) specInstHolding.textContent = stock.instHolding;
  if (specPledge) specPledge.textContent = stock.pledgeVal;
  if (specDebtEq) specDebtEq.textContent = stock.debtEqVal;
  if (specIntCover) specIntCover.textContent = stock.intCover;
  if (specDivYield) specDivYield.textContent = stock.divYieldVal;
  if (specPayout) specPayout.textContent = stock.payoutVal;
}

// ----------------------------------------------------------------------------
// INTERACTIVE PRICE ACTION & BUY-ZONE CANVAS CHART
// ----------------------------------------------------------------------------
function generateStockChartSeries(stock, timeframe) {
  const days = timeframe === "1M" ? 22 : timeframe === "3M" ? 65 : timeframe === "1Y" ? 250 : 130;
  const series = [];
  const base = stock.basePrice;
  const variance = (stock.beta || 1) * 0.015;

  let current = base * (timeframe === "1Y" ? 0.82 : timeframe === "6M" ? 0.90 : 0.96);
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    // Organic price walk
    const trend = (base - current) / (i + 10);
    const noise = (Math.sin(i * 0.4) * 0.6 + (Math.random() - 0.5)) * variance * current;
    current += trend + noise;

    // Pin final day to actual live CMP
    if (i === 0) current = stock.cmp;

    series.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      price: Math.max(stock.supLevel * 0.9, current)
    });
  }
  return series;
}

function renderStockPriceChart(stock, timeframe) {
  const canvas = document.getElementById("stockPriceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Handle Retina HiDPI
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1000;
  const height = rect.height || 340;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.resetTransform();
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const data = generateStockChartSeries(stock, timeframe);
  if (!data || data.length < 2) return;

  const prices = data.map(d => d.price);
  const minZone = stock.minZone;
  const maxZone = stock.maxZone;
  const supLevel = stock.supLevel;
  const tarLevel = stock.tarLevel;

  const allVals = prices.concat([minZone, maxZone, supLevel, tarLevel]);
  const minVal = Math.min(...allVals) * 0.96;
  const maxVal = Math.max(...allVals) * 1.04;

  const padding = { top: 30, right: 70, bottom: 40, left: 20 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const getY = (val) => padding.top + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;
  const getX = (i) => padding.left + (i / (data.length - 1)) * plotW;

  // 1. Draw Green Buy Zone Band
  const yZoneTop = getY(maxZone);
  const yZoneBot = getY(minZone);
  const zoneH = Math.max(2, yZoneBot - yZoneTop);

  ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
  ctx.fillRect(padding.left, yZoneTop, plotW, zoneH);

  // Border lines for Buy Zone
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padding.left, yZoneTop);
  ctx.lineTo(padding.left + plotW, yZoneTop);
  ctx.moveTo(padding.left, yZoneBot);
  ctx.lineTo(padding.left + plotW, yZoneBot);
  ctx.stroke();
  ctx.setLineDash([]);

  // Buy Zone Label
  ctx.fillStyle = "#059669";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`BUY ZONE (₹${minZone} - ₹${maxZone})`, padding.left + plotW + 65, (yZoneTop + yZoneBot) / 2 + 3);

  // 2. Draw Target 1 Resistance Line
  const yTar = getY(tarLevel);
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.moveTo(padding.left, yTar);
  ctx.lineTo(padding.left + plotW, yTar);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`TARGET ₹${tarLevel}`, padding.left + plotW + 65, yTar + 3);

  // 3. Draw Support Floor Line
  const ySup = getY(supLevel);
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(padding.left, ySup);
  ctx.lineTo(padding.left + plotW, ySup);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#d97706";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`200-DMA ₹${supLevel}`, padding.left + plotW + 65, ySup + 3);

  // 4. Draw Price Gradient Fill
  const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + plotH);
  grad.addColorStop(0, "rgba(14, 165, 233, 0.28)");
  grad.addColorStop(1, "rgba(14, 165, 233, 0.0)");

  ctx.beginPath();
  ctx.moveTo(getX(0), getY(prices[0]));
  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(getX(i), getY(prices[i]));
  }
  ctx.lineTo(getX(data.length - 1), padding.top + plotH);
  ctx.lineTo(getX(0), padding.top + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // 5. Draw Price Line
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(prices[0]));
  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(getX(i), getY(prices[i]));
  }
  ctx.strokeStyle = "#0ea5e9";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 6. Draw CMP Endpoint Circle Pulse
  const lastX = getX(data.length - 1);
  const lastY = getY(stock.cmp);

  ctx.beginPath();
  ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#0ea5e9";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  // 7. X-Axis Date Labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  const step = Math.ceil(data.length / 6);
  for (let i = 0; i < data.length; i += step) {
    ctx.fillText(data[i].date, getX(i), height - 12);
  }

  // Hover Tooltip Interactions
  setupStockChartTooltip(canvas, data, padding, plotW, plotH, minVal, maxVal, stock);
}

function setupStockChartTooltip(canvas, data, padding, plotW, plotH, minVal, maxVal, stock) {
  const tooltip = document.getElementById("chartTooltip");
  if (!tooltip) return;

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX < padding.left || mouseX > padding.left + plotW) {
      tooltip.style.display = "none";
      return;
    }

    const relX = (mouseX - padding.left) / plotW;
    const idx = Math.min(data.length - 1, Math.max(0, Math.round(relX * (data.length - 1))));
    const pt = data[idx];

    const inBuyZone = pt.price >= stock.minZone && pt.price <= stock.maxZone;
    const zoneStatus = inBuyZone ? 
      '<span style="color: #10b981; font-weight: 700;">● Inside Buy Accumulation Zone</span>' : 
      (pt.price > stock.maxZone ? 
        '<span style="color: #f59e0b; font-weight: 700;">● Above Buy Zone (Wait for Dip)</span>' : 
        '<span style="color: #10b981; font-weight: 700;">● Deep Discount Value</span>');

    tooltip.innerHTML = `
      <div style="font-size: 11px; opacity: 0.7; margin-bottom: 2px;">${pt.date}</div>
      <div style="font-size: 15px; font-weight: 800; color: #38bdf8;">₹${pt.price.toFixed(2)}</div>
      <div style="font-size: 11px; margin-top: 4px;">${zoneStatus}</div>
    `;

    tooltip.style.display = "block";
    tooltip.style.left = Math.min(rect.width - 190, Math.max(10, mouseX - 70)) + "px";
    tooltip.style.top = Math.max(10, mouseY - 70) + "px";
  };

  canvas.onmouseleave = () => {
    tooltip.style.display = "none";
  };
}

// ----------------------------------------------------------------------------
// 20-STOCK RISK & BUY-TIMING SCREENER TABLE
// ----------------------------------------------------------------------------
function renderStockScreenerTable(filterQuery) {
  const tbody = document.getElementById("stockScreenerTbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = STOCKS_DATA.filter(stock => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return stock.name.toLowerCase().includes(q) ||
           stock.ticker.toLowerCase().includes(q) ||
           stock.sector.toLowerCase().includes(q) ||
           stock.verdictBadge.toLowerCase().includes(q) ||
           stock.riskTierLabel.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">No stocks matched your filter. Try searching for "Banking", "Prime Buy", "Tata", or "Reliance".</td>';
    tbody.appendChild(tr);
    return;
  }

  filtered.forEach(stock => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-stock-id", stock.id);
    if (stock.id === state.stockRisk.selectedStockId) {
      tr.className = "row-selected";
    }

    const verdictClass = stock.verdictType === "prime-buy" ? "badge-prime" :
                         stock.verdictType === "buy-dips" ? "badge-dips" :
                         stock.verdictType === "wait-pullback" ? "badge-wait" : "badge-overbought";

    tr.innerHTML = `
      <td>
        <div class="tbl-stock-cell">
          <div class="tbl-logo">${stock.logo}</div>
          <div class="tbl-names">
            <span class="tbl-name">${stock.name}</span>
            <span class="tbl-sub">${stock.ticker} • ${stock.sector}</span>
          </div>
        </div>
      </td>
      <td style="font-weight: 800; font-variant-numeric: tabular-nums;">
        ₹${stock.cmp.toFixed(2)}
        <div style="font-size: 11px; font-weight: 600; color: ${stock.isPositive ? '#059669' : '#dc2626'};">
          ${stock.change}
        </div>
      </td>
      <td>
        <span class="risk-badge-tier ${stock.riskTier}">${stock.riskTierLabel}</span>
      </td>
      <td style="font-weight: 700; color: #047857; font-variant-numeric: tabular-nums;">
        ${stock.buyRange}
      </td>
      <td>
        <span class="timing-badge-status ${verdictClass}">${stock.verdictBadge}</span>
      </td>
      <td style="font-weight: 700; font-variant-numeric: tabular-nums;">
        ${stock.rsi.toFixed(1)}
      </td>
      <td style="font-weight: 800; color: #059669; font-variant-numeric: tabular-nums;">
        ${stock.target1}
      </td>
      <td style="font-weight: 700; color: #0284c7;">
        ${stock.upside}
      </td>
      <td>
        <button class="tbl-btn-analyze" data-analyze-stock="${stock.id}">Analyze</button>
      </td>
    `;

    tr.addEventListener("click", (e) => {
      selectStockForRiskMeter(stock.id);
      window.scrollTo({ top: 380, behavior: "smooth" });
    });

    const btnAnalyze = tr.querySelector(".tbl-btn-analyze");
    if (btnAnalyze) {
      btnAnalyze.addEventListener("click", (e) => {
        e.stopPropagation();
        selectStockForRiskMeter(stock.id);
        window.scrollTo({ top: 380, behavior: "smooth" });
      });
    }

    tbody.appendChild(tr);
  });
}

function switchView(tabId) {
  const links = document.querySelectorAll(".web-nav-link");
  const views = document.querySelectorAll(".tab-view");
  links.forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-tab") === tabId);
  });
  views.forEach(view => {
    view.style.display = (view.id === tabId) ? "block" : "none";
  });
  if (tabId === "tab-riskmeter") {
    onOpenStockRiskMeterView();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 10. INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  syncFormInputs();
  syncQuickPills();
  renderFundCards();
  updateActiveSipsTab();
  initStockRiskMeter();
  
  // 1. Initial live fetch
  syncAllAmfiNavs(false);

  // 2. Start automatic 45-second background polling
  startPollingCountdown();
});
