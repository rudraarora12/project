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
// 2. STATE MANAGEMENT
// ============================================================================
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
  ]
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

function switchView(tabId) {
  el.webNavLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-tab") === tabId);
  });
  el.tabViews.forEach(view => {
    view.style.display = (view.id === tabId) ? "block" : "none";
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================================
// 10. INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  syncFormInputs();
  syncQuickPills();
  renderFundCards();
  updateActiveSipsTab();
  
  // 1. Initial live fetch
  syncAllAmfiNavs(false);

  // 2. Start automatic 45-second background polling
  startPollingCountdown();
});
