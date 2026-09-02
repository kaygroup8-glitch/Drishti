# Drishti (दृष्टि) - Universal AI Accessibility Lens

> *"See beyond your own perspective."*  
> Built for the **WebMCP Hackathon (https://webmcp.devpost.com/)**

**Drishti** is an agent-native, multimodal spatial accessibility intelligence platform powered by Google Gemini Vision models and the **W3C Web Model Context Protocol (WebMCP)** standard. It empowers humans and autonomous AI agents to audit real-world physical and sensory environments across 6 universal design lenses, discover accessibility barriers, pinpoint them with 2D coordinate markers, prioritize architectural modifications, and generate official compliance reports.

---

## 🏆 Hackathon Submission Q&A (Devpost Ready)

### 1. What does your application do?
Over 1.3 billion people worldwide live with significant disabilities, yet the majority of public spaces, workplaces, and commercial venues contain physical barriers (steps without ramps, lack of tactile indicators, inaccessible door thresholds, inadequate contrast) that prevent equitable access. 

**Drishti** bridges this gap by transforming standard smartphone or webcam photos of any built environment into an instant, multi-perspective accessibility audit. Operating across 6 universal design lenses (Mobility, Low Vision, Hearing, Cognitive Wayfinding, Elderly-Friendly, and Stroller/Reach), Drishti detects physical barriers, maps them to precise coordinate pins on the image canvas, calculates an objective 0–100 accessibility score, and generates professional PDF remediation reports.

### 2. What tools does your site expose via WebMCP?
Drishti registers **6 specialized, strongly-typed agent tools** directly into the browser's model context (`navigator.modelContext`, `window.modelContext`, and `document.modelContext`), as well as exposing a standard machine-readable manifest at `/api/webmcp-manifest.json`:

| Tool Name | Scope & Purpose | Arguments | Outputs |
| :--- | :--- | :--- | :--- |
| `analyze_space` | Multimodal physical space audit using server-side Gemini vision | `image_data` (base64/data URL), optional `lenses`, `file_name` | Overall score (0-100), findings list with 2D coordinate pins, severity levels, remediation steps |
| `get_accessibility_summary` | Instant scorecard of the active space audit without redundant API calls | *(none)* | Overall score, rating label, high/medium/low severity counts, strong areas |
| `get_barrier_details` | Deep-dive investigation into a specific barrier ID + synchronizes UI | `barrier_id` (number) | What was detected, why it matters, confidence, coordinates (`xPercent`, `yPercent`), recommended improvement |
| `focus_barrier` | Direct UI co-presence: highlights barrier pin live on human canvas | `barrier_id` (number) | Focused confirmation, coordinates, pin label |
| `get_recommendations` | Prioritized remediation roadmap for facility managers | optional `prioritizeBySeverity`, `lensFilter` | Ranked recommendations ordered by critical impact and physical feasibility |
| `generate_accessibility_report`| Programmatic generation and client download of official vector PDF | optional `format` (`pdf` / `json`) | Report download status, file name, timestamp, score summary |

### 3. Why did you pick this approach?
Physical accessibility audits have historically required on-site specialist consultants, expensive clipboards, and weeks of delay. By exposing our multimodal inspection engine through **WebMCP**:
1. **Agents can act as autonomous building inspectors**: An agent reviewing a commercial property listing or drone/facility photos can autonomously invoke `analyze_space`, triage barriers with `get_recommendations`, and compile official compliance paperwork with `generate_accessibility_report`.
2. **True Human-Agent Co-Presence**: WebMCP is not just a headless API—it operates within a live webpage. When the agent inspects or calls `focus_barrier`, the human's live screen immediately highlights the pin on the visual photo, expands the relevant card, and scrolls to it. Both human and AI look at the exact same physical space simultaneously.
3. **Structured Semantics over Screen Scraping**: Standard DOM scraping cannot understand 2D coordinates in an image, nor can it reliably parse complex architectural regulations. WebMCP gives the agent direct, typed access to clean structured representations.

### 4. Walk through an example workflow.
1. **User uploads or captures a photo** of a building entrance (or provides a photo link).
2. **AI Agent calls** `analyze_space({ image_data: "data:image/jpeg;base64,...", lenses: ["mobility", "elderly"] })`.
3. Drishti executes server-side Gemini multimodal vision analysis, detecting a 3-step entrance without handrails or ramp access.
4. **AI Agent calls** `get_accessibility_summary()` to check the score (42/100, "High Remediation Priority").
5. **AI Agent calls** `focus_barrier({ barrier_id: 1 })`: The human's browser immediately highlights pin `[1]` directly over the steps on the photo canvas and scrolls to the card.
6. **AI Agent calls** `get_recommendations()` to formulate a contractor-ready quote and remediation sequence.
7. **AI Agent calls** `generate_accessibility_report()`: Drishti triggers client-side generation and download of the official vector PDF audit report.

---

## 🎯 How Drishti Meets the 5 Judging Criteria

### 1. Thoughtful Leverage of WebMCP
- Registered on standard `navigator.modelContext` (W3C specification / Chrome `WebModelContext` flag) with fallback polyfill.
- Also exposes `<link rel="model-context" href="/api/webmcp-manifest.json">` and `/api/webmcp-tools` for autonomous agent crawler discovery.
- Tools provide structured spatial, coordinate, and multi-perspective accessibility intelligence that would be impossible to obtain via plain HTML scraping.

### 2. Execution & Reliability
- Full-stack production architecture with Vite + Express + TypeScript.
- Resilient multimodal backend with Gemini 2.5 Flash / Gemini 3.7 Flash structured JSON schemas and offline fallback fixtures.
- 100% typed parameters and schemas conforming to JSON Schema standards (`type: "object"`, `required: [...]`, `properties: {...}`).
- Real-time tool execution inspector built into the UI for manual testing and debugging.

### 3. Real-World Impact & Usefulness
- Targets the physical accessibility needs of 1.3+ billion people with mobility, vision, hearing, cognitive, and age-related access requirements.
- Assists facility managers, small businesses, schools, and civic organizers in complying with the Americans with Disabilities Act (ADA Title III) and European Accessibility Act (EAA).

### 4. Originality & Creativity
- While most WebMCP demos focus on basic text forms or shopping carts, Drishti applies WebMCP to **multimodal spatial vision**, 2D image coordinate grounding, and multi-perspective empathy lenses.
- Incorporates built-in Web Speech API voice narration for accessibility-first human interaction.

### 5. Quality of the Human-Agent Experience
- **Shared State**: WebMCP tool handlers (`analyze_space`, `focus_barrier`, `generate_accessibility_report`) invoke the exact same React state bridge used by human button clicks.
- **Visual Co-Presence**: When an agent queries or focuses a barrier, the human sees the canvas pin pulse, the card auto-expand, and the view smoothly scroll.
- **Human In The Loop**: The user retains full control to override filters, zoom the image canvas, re-run analysis, or narrate findings aloud.

---

## 💻 Developer & Testing Guide

### Testing in Browser DevTools Console
Open DevTools (`F12`) on any page of Drishti:

```javascript
// 1. Inspect registered tools
console.log(navigator.modelContext.getRegisteredTools().map(t => t.name));

// 2. Query summary of active audit
const summary = await navigator.modelContext.executeTool("get_accessibility_summary", {});
console.log(summary);

// 3. Highlight barrier #1 live on the screen
await navigator.modelContext.executeTool("focus_barrier", { barrier_id: 1 });

// 4. Retrieve prioritized recommendations
const recs = await navigator.modelContext.executeTool("get_recommendations", { prioritizeBySeverity: true });
console.log(recs);

// 5. Generate and download PDF report
await navigator.modelContext.executeTool("generate_accessibility_report", { format: "pdf" });
```

### Testing with the Built-in Agent Workspace
1. Open the application.
2. Click the **"Agent Assistant"** tab or the **"Agent Ready"** pill in the top navigation bar.
3. Chat with the integrated agent using natural language (e.g. *"Analyze this space"*, *"Focus barrier 2"*, *"Find the most serious issues"*, *"Generate report"*).
4. Watch the tool execution pills appear and the human canvas synchronize in real time.

---

## 🛠️ Tech Stack

- **Client**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, jsPDF
- **WebMCP**: W3C Web Model Context Protocol (`navigator.modelContext`, `window.modelContext`, `document.modelContext`)
- **Backend**: Node.js, Express, `@google/genai` (Gemini 2.5 Flash / Gemini 3.7 Flash)
- **Deployment**: Google Cloud Run / AI Studio container environment

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
