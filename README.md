# ElderShield — Pause. Check. Stay Safe.

ElderShield is an independent, privacy-first, accessible web application built from scratch to help older adults and their families identify potentially fraudulent SMS messages, WhatsApp forwards, phishing links, QR/UPI traps, and suspicious financial requests.

All scam analysis runs **100% locally in the browser** using a multi-indicator heuristic detection engine — requiring **no backend, no API keys, no paid services, no external AI calls, and no user accounts**.

---

## Core Features

1. **Local Multi-Category Scam Detection Engine (`src/engine/scamScanner.ts`)**
   - Classifies messages into **Likely Scam**, **Suspicious**, or **No Obvious Scam Detected** with plain-language explanations, triggered phrases, and actionable next steps.
   - Evaluates 12 distinct fraud categories:
     1. Bank & financial institution impersonation
     2. OTP, PIN, password & credential theft (with protective-context awareness so legitimate *"Do NOT share this OTP"* bank advisories are not falsely flagged)
     3. UPI, QR-code & money-transfer scams
     4. Suspicious links, URL shorteners & misleading domains
     5. Fake courier, parcel delivery & customs fee requests
     6. Lottery winnings, prizes & unexpected rewards
     7. Fake jobs, recruitment fees & work-from-home task schemes
     8. Investment fraud & guaranteed returns
     9. Government, police, "digital arrest", utility disconnection & legal threats
     10. Remote-access apps (AnyDesk, TeamViewer, QuickSupport, `.apk` files)
     11. Urgent countdowns & pressure tactics
     12. Requests for sensitive personal or financial data
2. **Complete Seven-Language Interface (`src/i18n/locales/`)**
   - Full native-script support across the entire UI:
     - **English** (`en`)
     - **தமிழ் — Tamil** (`ta`)
     - **हिन्दी — Hindi** (`hi`)
     - **తెలుగు — Telugu** (`te`)
     - **മലയാളം — Malayalam** (`ml`)
     - **ಕನ್ನಡ — Kannada** (`kn`)
     - **বাংলা — Bengali** (`bn`)
3. **Spoken Warnings & Text-to-Speech (`src/hooks/useSpeech.ts`)**
   - Browser-native `speechSynthesis` & `SpeechSynthesisUtterance` integration with Speak, Replay, Stop, Voice Test, Speech Rate (`0.8x`–`1.0x`), and Volume controls.
   - Strictly matches voices to the selected language and **never substitutes an English voice** when an Indian-language voice pack is absent on the user's device, providing step-by-step OS/browser voice installation guidance instead.
4. **Interactive Scam Test Lab (`src/views/TestLabView.tsx`)**
   - Includes **56 fictional test messages** spanning all 12 scam categories plus legitimate lookalike messages.
   - Runs live evaluations against the actual scanner and dynamically calculates Total Cases, Correct Classifications, Incorrect Classifications, False Positives, False Negatives, and Accuracy %.
5. **Privacy-Conscious Local Scan History (`src/views/HistoryView.tsx`)**
   - Saves scan summaries locally in `localStorage`; stores original message text **only if the user explicitly opts in**.
   - Supports viewing details, deleting individual records, clearing all history after confirmation, and graceful recovery if `localStorage` is unavailable or corrupted.
6. **Practical Safety Guide (`src/views/SafetyGuideView.tsx`)**
   - Eight clear protection guides plus India-specific bank verification and official cybercrime reporting guidance.
7. **Progressive Web App (PWA) & Offline Support**
   - Configured with `vite-plugin-pwa`, compliant `192x192`, `512x512`, `maskable`, and `apple-touch-icon` PNG icons, `public/offline.html` fallback, in-app install button, and offline connectivity banner.

---

## Commands

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app locally (development server)
```bash
npm run dev
```
Opens on `http://localhost:3000`.

### 3. Run automated unit tests
```bash
npm test
```
Executes TypeScript unit tests covering the heuristic scam scanner, protective OTP handling, 56-case test dataset, metric calculations, 7-language dictionary completeness, and privacy storage behavior.

### 4. Build for production
```bash
npm run build
```
Runs `tsc --noEmit` type-checking followed by `vite build`, generating static assets and the Workbox service worker in `dist/`.

### 5. Preview the production build locally
```bash
npm run preview
```
Serves the production build locally on `http://localhost:4173`.

---

## Free Static Deployment Instructions

Because ElderShield uses hash-based navigation (`#home`, `#scanner`, etc.) and requires zero server-side APIs, the `dist/` folder deploys cleanly to any free static host.

> **Important Security Note on PWA & Service Workers:** Browser service workers and offline caching require **HTTPS** in production environments (browsers only allow plain HTTP for `localhost` during local development). Both Cloudflare Pages and GitHub Pages provide free automatic HTTPS.

### Option A: Deploy to Cloudflare Pages (Free)
1. Push this repository to your GitHub or GitLab account.
2. Sign in to the **Cloudflare Dashboard** and go to **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
3. Select your repository and configure build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20` or `22` (set `NODE_VERSION=22` in Environment Variables if needed)
4. Click **Save and Deploy**. Cloudflare Pages will serve ElderShield over HTTPS with full PWA offline support.

### Option B: Deploy to GitHub Pages (Free)
1. If deploying to a project subpath (`https://<username>.github.io/<repo-name>/`), update `vite.config.ts` to add `base: './'` (or `base: '/<repo-name>/'`) and update icon/manifest paths accordingly, or deploy to a user/custom domain root (`/`).
2. In your GitHub repository, open **Settings** -> **Pages** -> **Build and deployment** -> select **GitHub Actions**.
3. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy ElderShield to GitHub Pages
   on:
     push:
       branches: [main]
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: 'pages'
     cancel-in-progress: true
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22
             cache: 'npm'
         - run: npm ci
         - run: npm test
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist
         - uses: actions/deploy-pages@v4
   ```
4. Push to `main`; GitHub Actions will run tests, build `dist/`, and publish over HTTPS.

---

## Technical Limitations & Honest Disclosures

- **Heuristic Rule-Based Detection:** ElderShield evaluates local pattern rules in the browser. It is not connected to live banking systems, telecom registries, or law-enforcement databases, and cannot guarantee 100% accuracy. *"No Obvious Scam Detected"* never guarantees a message is safe.
- **Browser Text-to-Speech Voices:** Spoken warning availability for Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, and English depends on the user's operating system, web browser, installed language voice packs, and sometimes network connectivity. ElderShield detects missing voices and displays clear written warnings plus instructions for enabling system voice packs.
