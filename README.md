# Groww Desktop Web Platform - 12-Month SIP Retention & Multi-Factor Discovery (Live AMFI API)

A full-scale, responsive desktop web application matching the exact web portal of **Groww** (India's leading investment platform), built with HTML5, CSS3, and Vanilla JavaScript.

Now connected directly to the **Free Official Indian Mutual Fund API (`https://api.mfapi.in`)** fetching live daily NAVs, 1-day percentage movements, and official AMFI timestamps.

---

## 🚀 How to Run & Test
Open [`index.html`](file:///c:/Users/rudra/Desktop/drishti%20proj/index.html) in any web browser (Google Chrome, Microsoft Edge, Brave, Safari, Firefox).

Or serve it locally:
```bash
npx serve .
# or
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 🟢 Live AMFI API Integration (`api.mfapi.in`)

1. **Official AMFI Scheme Codes:**
   - **Parag Parikh Flexi Cap Fund:** AMFI Code `122639`
   - **Nippon India Small Cap Fund:** AMFI Code `118778`
   - **UTI Nifty 50 Index Fund:** AMFI Code `120716`
   - **ICICI Prudential Technology Fund:** AMFI Code `120594`
   - **HDFC Banking & Financial Services Fund:** AMFI Code `148986`
   - **Tata Digital India Fund:** AMFI Code `135800`
   - **SBI Healthcare Opportunities Fund:** AMFI Code `119783`
   - **Kotak Emerging Equity Fund:** AMFI Code `120166`
   - **ICICI Prudential Bluechip Fund:** AMFI Code `120586`
   - **HDFC Balanced Advantage Fund:** AMFI Code `118968`
   - **SBI Liquid Fund:** AMFI Code `119800`
   - **Quant Active Fund:** AMFI Code `120828`
   - **DSP Healthcare Fund:** AMFI Code `145454`

2. **Live Feed Dynamics:**
   - **Automated Background Sync:** Automatically queries `https://api.mfapi.in/mf/<scheme_code>` on page load.
   - **Daily 1D % Calculation:** Compares today's NAV against the previous trading day's NAV (`data[0]` vs `data[1]`) to compute the exact daily change (e.g., `+0.76% ▲` or `-0.38% ▼`).
   - **Smart Caching:** Employs a 15-minute `sessionStorage` cache so repeat filter operations stay instant and avoid rate-limiting.
   - **Live Indicator Badge:** A pulsing green badge in the top navigation shows `"AMFI Connected (Date)"` with a manual one-click refresh button.
   - **Resilient Fallback:** If offline or if network is restricted during a mentor demonstration, it smoothly falls back to verified baseline data with zero UI breakages.

---

## 💻 Full Desktop Web Architecture

* **Groww Top Navigation:** Official brand mark, PRO DISCOVERY badge, live AMFI connection indicator, wallet balance (`₹45,200`), notifications, and user profile (`Rudra K. • First-Time Investor`).
* **Amazon / Myntra 2-Column Screener:**
  * **Left Sticky Sidebar (310px):** 10 categorized accordion filter sections with active emerald indicator dots and 1-click reset buttons.
  * **Right Content Feed:** Quick-presets bar, live active filter dismissable tags, 5-column spec grid cards (with Live Daily NAV), feature highlight badges, and collapsible analytical drawers.
* **Eval-Gated "AI Reality Check" Modal:** Tackles the **"Underwhelming Plateau" (Months 3–8)**, setting realistic expectations to prevent early panic-canceling without giving financial advice.
* **Interactive SIP Setup & 12-Month Discipline Tracker:** Salary-day synchronized debit date picker (1st–28th), UPI AutoPay selection, 12-month commitment pledge, and active habit streak dashboard.
