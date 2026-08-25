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

### 💻 Local Development Setup

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

#
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
