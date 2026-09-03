# Drishti (दृष्टि) - Universal AI Accessibility Lens

> *"See beyond your own perspective."*  
> Built for the **WebMCP Hackathon (https://webmcp.devpost.com/)**  
> Supporting **W3C WebMCP** & the **Official OpenAI Model Context Protocol (MCP)** standard ([developers.openai.com/api/docs/mcp](https://developers.openai.com/api/docs/mcp))

**Drishti** is an agent-native, multimodal spatial accessibility intelligence platform powered by Google Gemini Vision models, the **W3C Web Model Context Protocol (WebMCP)**, and the **OpenAI Model Context Protocol (MCP)** server standard. It empowers humans and autonomous AI agents (such as ChatGPT, Claude Desktop, or custom Python agents built with the OpenAI Agents SDK) to audit real-world physical and sensory environments across 6 universal design lenses, discover accessibility barriers, pinpoint them with 2D coordinate markers, prioritize architectural modifications, and generate official compliance reports.

---

## 🚀 Dual-Engine MCP Architecture

Drishti implements **both** complementary layers of the Model Context Protocol:

1. **W3C In-Browser WebMCP (`navigator.modelContext`)**:
   - Registered directly into the browser's model context for in-browser agents (Chrome `--enable-features=WebModelContext`, ChatGPT Web Browsing agent).
   - Allows browser-based agents to discover and call tools in the user's active DOM tab.

2. **OpenAI & Remote MCP Server (SSE + JSON-RPC 2.0)**:
   - Built to the specification outlined in [OpenAI's Model Context Protocol documentation](https://developers.openai.com/api/docs/mcp).
   - **SSE Transport**: `GET /api/mcp/sse` with `endpoint` message routing.
   - **Streamable HTTP POST Transport**: `POST /api/mcp` handling standard JSON-RPC 2.0 messages (`initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `ping`).
   - **OpenAI Tool Calling Format**: `GET /api/openai-tools` providing standard OpenAI `type: "function"` schemas for the Chat Completions & Responses APIs.
   - **Client Auto-Config**: `GET /api/mcp-config.json` serving ready-to-use snippets for client applications.
   - **Human-Agent Co-Presence Sync**: When an external agent calls `focus_barrier`, the human browser UI immediately highlights the 2D coordinate pin on the live photo canvas!

---

## 🏆 Hackathon Submission Q&A (Devpost Ready)

### 1. What does your application do?
Over 1.3 billion people worldwide live with significant disabilities, yet the vast majority of public spaces, workplaces, and commercial venues contain physical barriers (steps without ramps, lack of tactile indicators, heavy inaccessible door thresholds, inadequate contrast) that prevent equitable access. 

**Drishti** bridges this gap by transforming standard smartphone or webcam photos of any built environment into an instant, multi-perspective accessibility audit. Operating across 6 universal design lenses (Mobility, Low Vision, Hearing, Cognitive Wayfinding, Elderly-Friendly, and Stroller/Reach), Drishti detects physical barriers, maps them to precise coordinate pins on the image canvas, calculates an objective 0–100 accessibility score, and generates professional PDF remediation reports.

### 2. What tools does your site expose via WebMCP and OpenAI MCP?
Drishti registers **6 specialized, strongly-typed agent tools** across both in-browser WebMCP and remote OpenAI MCP:

| Tool Name | Scope & Purpose | Arguments | Outputs |
| :--- | :--- | :--- | :--- |
| `analyze_space` | Multimodal physical space audit using server-side Gemini vision | `image_data` (base64/data URL), optional `lenses`, `file_name` | Overall score (0-100), findings list with 2D coordinate pins, severity levels, remediation steps |
| `get_accessibility_summary` | Instant scorecard of the active space audit without redundant API calls | *(none)* | Overall score, rating label, high/medium/low severity counts, strong areas |
| `get_barrier_details` | Deep-dive investigation into a specific barrier ID + synchronizes UI | `barrier_id` (number) | What was detected, why it matters, confidence, coordinates (`xPercent`, `yPercent`), recommended improvement |
| `focus_barrier` | Direct UI co-presence: highlights barrier pin live on human canvas | `barrier_id` (number) | Focused confirmation, coordinates, pin label |
| `get_recommendations` | Prioritized remediation roadmap for facility managers | optional `prioritizeBySeverity`, `lensFilter` | Ranked recommendations ordered by critical impact and physical feasibility |
| `generate_accessibility_report`| Programmatic generation and client download of official vector PDF | optional `format` (`pdf` / `json`) | Report download status, file name, timestamp, score summary |

### 3. Why did you pick this approach?
Physical accessibility audits have historically required on-site specialist consultants, expensive clipboards, and weeks of delay. By exposing our multimodal inspection engine through **WebMCP and OpenAI MCP**:
1. **Agents can act as autonomous building inspectors**: An external agent reviewing a commercial property listing or drone/facility photos can autonomously invoke `analyze_space`, triage barriers with `get_recommendations`, and compile official compliance paperwork with `generate_accessibility_report`.
2. **True Human-Agent Co-Presence**: MCP is not just a headless data pipe—it connects to a live human workspace. When an external agent calls `focus_barrier({ barrier_id: 1 })`, the human's live screen immediately highlights the pin on the visual photo, expands the relevant card, and scrolls to it. Both human and AI look at the exact same physical space simultaneously.
3. **Structured Semantics over Screen Scraping**: Standard DOM scraping cannot understand 2D coordinates in an image, nor can it reliably parse complex architectural regulations. MCP gives the agent direct, typed access to clean structured representations.

### 4. Walk through an example workflow.
1. **User uploads or captures a photo** of a building entrance (or provides a photo link).
2. **AI Agent calls** `analyze_space({ image_data: "data:image/jpeg;base64,...", lenses: ["mobility", "elderly"] })`.
3. Drishti executes server-side Gemini multimodal vision analysis, detecting a 3-step entrance without handrails or ramp access.
4. **AI Agent calls** `get_accessibility_summary()` to check the score (54/100, "Areas Needing Attention").
5. **AI Agent calls** `focus_barrier({ barrier_id: 1 })`: The human's browser immediately highlights pin `[1]` directly over the steps on the photo canvas and scrolls to the card.
6. **AI Agent calls** `get_recommendations()` to formulate a contractor-ready quote and remediation sequence.
7. **AI Agent calls** `generate_accessibility_report()`: Drishti triggers client-side generation and download of the official vector PDF audit report.

---

## 🤖 Connecting with OpenAI & MCP Clients

### 1. ChatGPT Desktop & Claude Desktop (`mcpServers`)
Add the following to your `claude_desktop_config.json` or ChatGPT configuration:

```json
{
  "mcpServers": {
    "drishti-accessibility": {
      "url": "https://<your-app-domain>/api/mcp/sse"
    }
  }
}
```

### 2. OpenAI Agents SDK (Python)
Per the [OpenAI MCP guidelines](https://developers.openai.com/api/docs/mcp):

```python
import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerSse

async def main():
    # Connect to Drishti live remote MCP Server
    server = MCPServerSse(url="https://<your-app-domain>/api/mcp/sse")
    
    agent = Agent(
        name="AccessibilityAuditor",
        instructions="Audit physical spaces for accessibility barriers and coordinate with the human inspector.",
        mcp_servers=[server]
    )
    
    result = await Runner.run(agent, "Get accessibility summary and focus barrier 1 on the screen")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

### 3. OpenAI Responses API
```json
{
  "model": "gpt-4o",
  "tools": [
    {
      "type": "mcp",
      "server_url": "https://<your-app-domain>/api/mcp",
      "description": "Drishti AI Accessibility Lens MCP Server"
    }
  ],
  "input": "Summarize accessibility barriers detected in the active building audit."
}
```

### 4. Quick Testing with cURL (JSON-RPC 2.0)

**Initialize Server:**
```bash
curl -X POST "http://localhost:3000/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize"}'
```

**List Available Tools:**
```bash
curl -X POST "http://localhost:3000/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

**Call `get_accessibility_summary`:**
```bash
curl -X POST "http://localhost:3000/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_accessibility_summary","arguments":{}}}'
```

**Call `focus_barrier` (highlights pin live on human canvas):**
```bash
curl -X POST "http://localhost:3000/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"focus_barrier","arguments":{"barrier_id":1}}}'
```

---

## 🎯 How Drishti Meets the Judging Criteria

### 1. Thoughtful Leverage of WebMCP & OpenAI MCP
- **Full Spectrum Support**: Combines standard `navigator.modelContext` (W3C specification / Chrome `WebModelContext` flag) with official OpenAI MCP remote server transports (SSE & Streamable HTTP).
- Exposes machine-readable discovery headers, `<link rel="model-context">`, `<link rel="mcp-server">`, and `/api/mcp-config.json`.
- Tools provide structured spatial, coordinate, and multi-perspective accessibility intelligence that would be impossible to obtain via plain HTML scraping.

### 2. Execution & Reliability
- Full-stack production architecture with Vite + Express + TypeScript.
- Resilient multimodal backend with Gemini 2.5 Flash / Gemini 3.7 Flash structured JSON schemas and offline fallback fixtures.
- 100% typed parameters and schemas conforming to JSON Schema and OpenAI function calling standards.
- Real-time interactive tool tester built into the UI modal for instant verification.

### 3. Real-World Impact & Usefulness
- Targets the physical accessibility needs of 1.3+ billion people with mobility, vision, hearing, cognitive, and age-related access requirements.
- Assists facility managers, small businesses, schools, and civic organizers in complying with the Americans with Disabilities Act (ADA Title III) and European Accessibility Act (EAA).

### 4. Originality & Creativity
- Applies MCP to **multimodal spatial vision**, 2D image coordinate grounding, and multi-perspective empathy lenses.
- Incorporates built-in Web Speech API voice narration for accessibility-first human interaction.

### 5. Quality of the Human-Agent Experience
- **Shared State**: Remote OpenAI MCP tool calls and in-browser WebMCP tool calls update the exact same state machine.
- **Visual Co-Presence**: When an agent queries or calls `focus_barrier`, the human sees the canvas pin pulse, the card auto-expand, and the view smoothly scroll.
- **Human In The Loop**: The user retains full control to override filters, zoom the image canvas, re-run analysis, or narrate findings aloud.

---

## 🛠️ Tech Stack

- **Client**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, jsPDF
- **WebMCP & OpenAI MCP**: W3C Web Model Context Protocol + OpenAI Model Context Protocol (SSE + Streamable HTTP JSON-RPC 2.0)
- **Backend**: Node.js, Express, `@google/genai` (Gemini 2.5 Flash / Gemini 3.7 Flash)
- **Deployment**: Google Cloud Run / AI Studio container environment

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
