# Drishti (दृष्टि) - Universal AI Accessibility Lens

> *"See beyond your own perspective."*

**Drishti** is an agent-native, multimodal spatial accessibility intelligence application powered by Google's Gemini Vision models and the **WebMCP (Web Model Context Protocol)** standard. It empowers humans and autonomous AI agents to audit real-world physical and sensory environments across 6 universal design lenses, discover accessibility barriers, prioritize improvements, and generate official compliance reports.

---

## 🤖 WebMCP Integration (Agent-Ready Architecture)

Drishti implements the **W3C Web Model Context Protocol (WebMCP)**, exposing its specialized vision analysis, barrier detection, and report generation engines directly to AI agents via `document.modelContext.registerTool(...)`.

### Before WebMCP vs. With WebMCP

- **Before WebMCP**: A human user had to manually navigate the Drishti web interface to upload photos, adjust lens toggles, read through findings, copy remediation notes, and click to export PDF reports.
- **With WebMCP**: An AI agent (e.g. Claude Computer Use, autonomous browser agents, workplace assistants, or building inspection bots) can directly discover and operate Drishti's accessibility toolset, collaborate in real time with the human, prioritize architectural fixes, and automate compliance audits.

### The 5 Registered WebMCP Tools

Drishti exposes 5 specialized, strongly-typed tools registered under `document.modelContext`:

| Tool Name | Purpose | Key Inputs | Key Outputs |
| :--- | :--- | :--- | :--- |
| `analyze_space` | Audits spatial photo for accessibility barriers with Gemini | `image_data` (base64/data URL), `lenses` (`mobility`, `low_vision`, `hearing`, `cognitive`, `elderly`, `stroller`, `all`) | Score (0-100), findings array, coordinate markers, remediation advice |
| `get_accessibility_summary` | Retrieves scorecard & priority summary of the active audit without redundant Gemini calls | *(none)* | Overall score, high/med/low counts, strengths, areas needing attention, top priority fix |
| `get_barrier_details` | Inspects a specific barrier by ID | `barrier_id` (number) | Observation, why it matters, confidence, pin location (`xPercent`, `yPercent`), recommended improvement |
| `get_recommendations` | Retrieves prioritized action plan for property owners ("What to fix first?") | *(none)* | Ranked recommendations ordered by severity (High first), action items, impact reasoning |
| `generate_accessibility_report` | Triggers generation and client download of official vector PDF audit report | *(none)* | Report status, file name, timestamp, score summary |

### Example Agent Workflow

```
Human provides or uploads space image / webcam snapshot
                  ↓
AI Agent calls `analyze_space({ image_data, lenses: ['mobility', 'elderly'] })`
                  ↓
Drishti processes photo via server-side Gemini Multimodal Vision API
                  ↓
AI Agent calls `get_accessibility_summary()` to evaluate compliance level
                  ↓
AI Agent inspects critical barrier: `get_barrier_details({ barrier_id: 1 })`
                  ↓
AI Agent answers user query: "What should the building owner fix first?" using `get_recommendations()`
                  ↓
AI Agent generates client report: `generate_accessibility_report()`
```

### Agent Integration Code Example

```javascript
// 1. Discover registered Drishti tools
const tools = document.modelContext.getRegisteredTools();
console.log("Registered WebMCP Tools:", tools.map(t => t.name));

// 2. Query summary of active scan
const summary = await document.modelContext.executeTool("get_accessibility_summary", {});
console.log(`Overall Score: ${summary.overallScore}/100`);

// 3. Inspect top recommendations
const recommendations = await document.modelContext.executeTool("get_recommendations", {});
console.log("Top Priority Action:", recommendations.highestPriorityAction);

// 4. Generate print-ready PDF
const report = await document.modelContext.executeTool("generate_accessibility_report", {});
console.log("Report generated:", report.reportFileName);
```

### How to Test WebMCP in Drishti

1. Open the Drishti web application in your browser.
2. Click the **"Agent Ready"** pill button in the top navigation bar.
3. Switch to the **"Live Tool Inspector"** tab to test and execute any of the 5 tools live with sample or active audit data.
4. Open the browser DevTools Console (`F12`) and inspect `document.modelContext` or `window.drishtiWebMCP`:
   ```javascript
   await window.drishtiWebMCP.executeTool("get_accessibility_summary", {});
   ```

### Browser & Compatibility Requirements

- Drishti dynamically feature-detects native `document.modelContext`, `window.modelContext`, and `navigator.modelContext`.
- If running in a browser without native WebMCP support, Drishti gracefully mounts a standard polyfill so the app remains 100% functional, and agents/extensions can interact with `document.modelContext` seamlessly without crashing.

---

## 🌟 Core Application Features

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
- **Voice Narration**: High-fidelity speech synthesis describing key observations and recommendations.
- **Live Camera Mode**: Instant snapshot capture from mobile and laptop webcams.
- **Local Persistence**: Saves analysis history locally in the browser via HTML5 localStorage with no external tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, jsPDF
- **Agent Integration**: W3C Web Model Context Protocol (WebMCP), `document.modelContext`
- **Backend / AI Engine**: Node.js, Express, `@google/genai` (Gemini 2.5 Flash / Gemini 3.7 Flash)
- **Security**: Server-side proxy (`/api/analyze`) ensuring `GEMINI_API_KEY` is never exposed to the client or WebMCP tools.

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

# Start development server
npm run dev
```

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Start Command**: `npm run start`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
