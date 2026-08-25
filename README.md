# Drishti (दृष्टि) - Universal AI Accessibility Lens

> *"See beyond your own perspective."*

**Drishti** is a multimodal spatial accessibility auditor built with Google's Gemini 2.5/3.7 Vision models. It enables architects, interior designers, venue operators, educators, and the public to discover physical and sensory accessibility barriers in real-world spaces by viewing them through 6 distinct accessibility lenses.

---

## 🌟 Key Features

- **Multimodal Visual Barrier Detection**: Analyzes photos of stairs, entrances, corridors, restrooms, and doorways using Gemini multimodal vision (`@google/genai`).
- **6 Universal Design Lenses**:
  - 🚶 **Mobility & Steps**: Detects steps without ramps, steep thresholds, and pathway obstructions.
  - 👁️ **Low Vision & Contrast**: Evaluates luminance contrast, lighting levels, and tactile edge markers.
  - 🦻 **Hearing & Visual Cues**: Audits redundant visual cues and visual alarms.
  - 🧠 **Cognition & Wayfinding**: Identifies signage clutter, clarity, and intuitive directional flow.
  - ❤️ **Elderly-Friendly**: Analyzes continuous handrails, slip risks, and rest zones.
  - 👶 **Stroller & Reach**: Checks reach heights, pass-through clearance, and curb cuts.
- **Interactive Visual Barrier Pin Map**: Places coordinate-calibrated marker pins (`[1]`, `[2]`, `[3]`) directly over detected barrier zones on the image canvas.
- **Actionable Remediation Guidance**: Provides clear observations, why each barrier matters, and practical, code-compliant physical improvements.
- **PDF Audit Report Export**: Generates professional, vector-formatted PDF accessibility reports with scorecards, priority actions, and observation summaries for printing or sharing.
- **Live Camera Mode**: Instant snapshot capture from mobile and laptop webcams.
- **Local Persistence**: Saves analysis history locally in the browser via HTML5 localStorage with no external tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, jsPDF
- **Backend / AI Engine**: Node.js, Express, `@google/genai` (Gemini 2.5 Flash / Gemini 3.7 Flash)
- **API Security**: Server-side proxy (`/api/analyze`) ensuring `GEMINI_API_KEY` is never exposed to the client.

---

## 🚀 How to Export Your Code to GitHub from Google AI Studio

If you built this app inside Google AI Studio Build and want to sync or push it to your personal GitHub account:

### Method 1: Direct GitHub Sync from the UI
1. Look at the top-right header or the left-hand navigation in Google AI Studio Build.
2. Click the **Export / Settings** icon (or click the **Share / GitHub** button in the top bar).
3. Select **Export to GitHub** (or **Push to GitHub repository**).
4. Connect your GitHub account and select or create a new repository (e.g. `drishti-accessibility-lens`).
5. AI Studio will commit and push all project files directly to your repository.

### Method 2: Download ZIP and Push Manually
1. In the AI Studio top menu, click **Export** -> **Download ZIP**.
2. Extract the downloaded `.zip` file on your computer.
3. Open a terminal inside the extracted folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Drishti Accessibility Lens"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 20+ installed
- A Gemini API Key (get a free key at [Google AI Studio](https://aistudio.google.com/))

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/drishti-accessibility-lens.git
cd drishti-accessibility-lens

# Install dependencies
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root of the project:
```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🚢 Deploying to Vercel (Step-by-Step)

Because Drishti is a full-stack application with an Express backend that securely proxies Gemini API calls, follow these simple steps to deploy on Vercel:

### Step 1: Import the Project into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository where you pushed the Drishti code.

### Step 2: Configure Environment Variables in Vercel
1. In the Vercel project configuration screen, open the **Environment Variables** accordion.
2. Add the following key:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your_actual_gemini_api_key_here` (from [Google AI Studio](https://aistudio.google.com/))
   - **Environments**: Check *Production*, *Preview*, and *Development*.
3. Click **Add**.

### Step 3: Configure Build & Output Settings
- **Framework Preset**: `Vite` (or `Other`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Click Deploy
- Click **Deploy**. Vercel will build the frontend and deploy the app.
- Once completed, you will receive your live `.vercel.app` production URL!

---

## 🌐 Deploying to Other Platforms (Cloud Run, Render, Railway)

Drishti includes a standalone production start script (`npm start` running `node dist/server.cjs`), which works out-of-the-box on container and Node hosting platforms:

### Render / Railway / Heroku:
1. Connect your repository.
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`
4. Add Environment Variable: `GEMINI_API_KEY` = your key.

---

## 🛡️ Responsible AI & Ethical Disclaimer

Drishti provides AI-assisted accessibility observations to expand awareness and foster empathy in spatial design. 
- **Not a Legal Substitute**: Drishti is **not** a certified legal substitute for formal ADA (Americans with Disabilities Act), Section 508, or WCAG architectural compliance audits.
- **Lived Experience**: AI cannot replace direct consultation and collaboration with individuals with disabilities.
- **Privacy & Safety**: Images are processed ephemerally on the backend and are not used to profile individuals or diagnose medical conditions.

---

## 📄 License

MIT License © 2026 Drishti Contributors.
