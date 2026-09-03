import React, { useState, useEffect } from 'react';
import {
  Bot,
  CheckCircle2,
  X,
  ShieldCheck,
  Layers,
  Cpu,
  FileCheck,
  Globe,
  Terminal,
  Copy,
  Check,
  Play,
  Code2,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface AgentReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentReadyModal: React.FC<AgentReadyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeProtocolTab, setActiveProtocolTab] = useState<'openai' | 'webmcp'>('openai');
  const [activeCodeTab, setActiveCodeTab] = useState<'desktop' | 'python' | 'responses' | 'curl'>('desktop');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live tester state
  const [testTool, setTestTool] = useState<string>('tools/list');
  const [isExecutingTest, setIsExecutingTest] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  // Current origin
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drishti.app';
  const sseUrl = `${origin}/api/mcp/sse`;
  const mcpUrl = `${origin}/api/mcp`;
  const openaiToolsUrl = `${origin}/api/openai-tools`;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const desktopConfigJson = JSON.stringify(
    {
      mcpServers: {
        'drishti-accessibility': {
          url: sseUrl,
        },
      },
    },
    null,
    2
  );

  const pythonSnippet = `from agents import Agent, Runner
from agents.mcp import MCPServerSse

# Connect to Drishti live remote MCP Server
async def run_audit():
    server = MCPServerSse(url="${sseUrl}")
    agent = Agent(
        name="AccessibilityAuditor",
        instructions="Analyze physical spaces for barriers and synchronize pins with human UI.",
        mcp_servers=[server]
    )
    result = await Runner.run(agent, "Get accessibility summary and focus barrier 1 on the screen")
    print(result.final_output)`;

  const responsesApiSnippet = `{
  "model": "gpt-4o",
  "tools": [
    {
      "type": "mcp",
      "server_url": "${mcpUrl}",
      "description": "Drishti AI Accessibility Lens MCP Server"
    }
  ],
  "input": "Summarize accessibility barriers detected in the active building audit."
}`;

  const curlSnippet = `curl -X POST "${mcpUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_accessibility_summary","arguments":{}}}'`;

  const runLiveTest = async () => {
    setIsExecutingTest(true);
    setTestOutput(null);
    try {
      let body: any;
      if (testTool === 'tools/list') {
        body = { jsonrpc: '2.0', id: Date.now(), method: 'tools/list' };
      } else if (testTool === 'get_accessibility_summary') {
        body = {
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: { name: 'get_accessibility_summary', arguments: {} },
        };
      } else if (testTool === 'focus_barrier') {
        body = {
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: { name: 'focus_barrier', arguments: { barrier_id: 1 } },
        };
      } else if (testTool === 'get_recommendations') {
        body = {
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: { name: 'get_recommendations', arguments: { prioritizeBySeverity: true } },
        };
      } else if (testTool === 'resources/list') {
        body = { jsonrpc: '2.0', id: Date.now(), method: 'resources/list' };
      }

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setTestOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestOutput(`Error testing endpoint: ${err?.message || String(err)}`);
    } finally {
      setIsExecutingTest(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF6EE] border border-[#E3D8C7] rounded-[28px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-transform animate-scale-in"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE2D5] flex items-center justify-between bg-[#F4EDE0]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1C20] text-[#FAF6EE] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-[#FA8F79]" />
            </div>
            <div>
              <h2 id="agent-modal-title" className="text-lg sm:text-xl font-bold font-heading text-[#1A1C20]">
                Agent & MCP Integration
              </h2>
              <p className="text-xs text-[#6B6355]">
                Official OpenAI MCP Standard & W3C In-Browser WebMCP
              </p>
            </div>
          </div>

          <button
            id="agent-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B6355] hover:text-[#1A1C20] hover:bg-[#EAE1D2] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex border-b border-[#EAE2D5] bg-[#F7F1E6] px-5 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveProtocolTab('openai')}
            className={`pb-3 px-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeProtocolTab === 'openai'
                ? 'border-[#1A1C20] text-[#1A1C20]'
                : 'border-transparent text-[#6B6355] hover:text-[#1A1C20]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#FA8F79]" />
            <span>OpenAI MCP Standard</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#E5D7C2] text-[#1A1C20]">
              SSE + HTTP
            </span>
          </button>

          <button
            onClick={() => setActiveProtocolTab('webmcp')}
            className={`pb-3 px-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeProtocolTab === 'webmcp'
                ? 'border-[#1A1C20] text-[#1A1C20]'
                : 'border-transparent text-[#6B6355] hover:text-[#1A1C20]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>W3C WebMCP (In-Browser)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#E5D7C2] text-[#1A1C20]">
              DOM Context
            </span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain text-[#1A1C20]">
          {activeProtocolTab === 'openai' ? (
            /* TAB 1: OpenAI & Remote MCP Protocol */
            <div className="space-y-4">
              {/* Server Status Banner */}
              <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <div>
                    <span className="text-xs font-bold text-[#166534]">
                      OpenAI MCP Server Active & Listening
                    </span>
                    <p className="text-[11px] text-[#15803D]">
                      JSON-RPC 2.0 • SSE & Streamable HTTP transports
                    </p>
                  </div>
                </div>
                <a
                  href="https://developers.openai.com/api/docs/mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] hover:underline"
                >
                  <span>OpenAI MCP Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Endpoints Table */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6B6355]">
                  Live Remote MCP Endpoints
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF4EB] border border-[#ECDCC7]">
                    <div className="flex items-center gap-2 font-mono text-[11px] overflow-hidden">
                      <span className="px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#166534] font-bold">SSE</span>
                      <span className="truncate text-[#1A1C20]">{sseUrl}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(sseUrl, 'sse')}
                      className="p-1.5 rounded-lg hover:bg-[#EAE1D2] text-[#6B6355] hover:text-[#1A1C20] transition-colors cursor-pointer shrink-0 ml-2"
                      title="Copy SSE URL"
                    >
                      {copiedKey === 'sse' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF4EB] border border-[#ECDCC7]">
                    <div className="flex items-center gap-2 font-mono text-[11px] overflow-hidden">
                      <span className="px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#6D28D9] font-bold">POST</span>
                      <span className="truncate text-[#1A1C20]">{mcpUrl}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(mcpUrl, 'post')}
                      className="p-1.5 rounded-lg hover:bg-[#EAE1D2] text-[#6B6355] hover:text-[#1A1C20] transition-colors cursor-pointer shrink-0 ml-2"
                      title="Copy HTTP URL"
                    >
                      {copiedKey === 'post' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Integration Snippets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6B6355]">
                    Client Configuration
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveCodeTab('desktop')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        activeCodeTab === 'desktop' ? 'bg-[#1A1C20] text-[#FAF6EE]' : 'bg-[#EAE1D2] text-[#6B6355] hover:text-[#1A1C20]'
                      }`}
                    >
                      ChatGPT / Claude
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('python')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        activeCodeTab === 'python' ? 'bg-[#1A1C20] text-[#FAF6EE]' : 'bg-[#EAE1D2] text-[#6B6355] hover:text-[#1A1C20]'
                      }`}
                    >
                      Python SDK
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('responses')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        activeCodeTab === 'responses' ? 'bg-[#1A1C20] text-[#FAF6EE]' : 'bg-[#EAE1D2] text-[#6B6355] hover:text-[#1A1C20]'
                      }`}
                    >
                      Responses API
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('curl')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        activeCodeTab === 'curl' ? 'bg-[#1A1C20] text-[#FAF6EE]' : 'bg-[#EAE1D2] text-[#6B6355] hover:text-[#1A1C20]'
                      }`}
                    >
                      cURL
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl bg-[#141619] border border-[#2A2E35] p-3 text-[#E2E8F0] font-mono text-xs overflow-hidden">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2A2E35] text-[11px] text-[#94A3B8]">
                    <span>
                      {activeCodeTab === 'desktop' && 'claude_desktop_config.json / ChatGPT App'}
                      {activeCodeTab === 'python' && 'OpenAI Agents SDK (Python)'}
                      {activeCodeTab === 'responses' && 'OpenAI Responses API Payload'}
                      {activeCodeTab === 'curl' && 'Terminal Command (Direct JSON-RPC 2.0)'}
                    </span>
                    <button
                      onClick={() => {
                        const val =
                          activeCodeTab === 'desktop'
                            ? desktopConfigJson
                            : activeCodeTab === 'python'
                            ? pythonSnippet
                            : activeCodeTab === 'responses'
                            ? responsesApiSnippet
                            : curlSnippet;
                        handleCopy(val, activeCodeTab);
                      }}
                      className="flex items-center gap-1 text-[11px] text-[#FA8F79] hover:underline cursor-pointer"
                    >
                      {copiedKey === activeCodeTab ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed max-h-40">
                    <code>
                      {activeCodeTab === 'desktop' && desktopConfigJson}
                      {activeCodeTab === 'python' && pythonSnippet}
                      {activeCodeTab === 'responses' && responsesApiSnippet}
                      {activeCodeTab === 'curl' && curlSnippet}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Live Interactive Tester */}
              <div className="p-3.5 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-[#FA8F79]" />
                    <span className="text-xs font-bold text-[#1A1C20]">
                      Live Remote MCP Tester
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6B6355]">POST /api/mcp</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={testTool}
                    onChange={(e) => setTestTool(e.target.value)}
                    className="text-xs rounded-xl bg-[#FAF6EE] border border-[#D5C7B0] px-3 py-1.5 font-medium text-[#1A1C20] cursor-pointer focus:outline-none"
                  >
                    <option value="tools/list">tools/list (Inspect 6 capabilities)</option>
                    <option value="get_accessibility_summary">tools/call: get_accessibility_summary</option>
                    <option value="focus_barrier">tools/call: focus_barrier (ID: 1)</option>
                    <option value="get_recommendations">tools/call: get_recommendations</option>
                    <option value="resources/list">resources/list (Universal standards)</option>
                  </select>

                  <button
                    onClick={runLiveTest}
                    disabled={isExecutingTest}
                    className="px-4 py-1.5 rounded-xl bg-[#1A1C20] hover:bg-[#2C2E35] text-[#FAF6EE] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {isExecutingTest ? (
                      <span>Executing...</span>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-[#FA8F79] fill-current" />
                        <span>Execute via MCP</span>
                      </>
                    )}
                  </button>
                </div>

                {testOutput && (
                  <div className="rounded-xl bg-[#141619] p-3 text-xs font-mono text-[#4ADE80] overflow-x-auto max-h-36 border border-[#2A2E35]">
                    <pre className="text-[10px] leading-tight">{testOutput}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TAB 2: W3C WebMCP (In-Browser) */
            <div className="space-y-4">
              {/* Status Indicator Chip */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#166534]">
                    WebMCP Active on navigator.modelContext
                  </span>
                </div>
                <span className="text-xs font-mono text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full font-semibold">
                  6 tools ready
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2.5 text-xs sm:text-sm text-[#524B3F] leading-relaxed">
                <p>
                  Drishti is designed for seamless human and autonomous AI collaboration. Its accessibility inspection capabilities are registered directly into the browser&apos;s standard model context via <code className="px-1.5 py-0.5 rounded bg-[#EDE3D2] font-mono text-xs text-[#1A1C20]">navigator.modelContext</code>.
                </p>
                <p>
                  When a WebMCP-compatible browser agent connects (such as ChatGPT&apos;s in-app browser or Chrome with <code className="px-1.5 py-0.5 rounded bg-[#EDE3D2] font-mono text-[11px] text-[#1A1C20]">--enable-features=WebModelContext</code>), it can autonomously request space evaluations, review detected barriers, highlight specific pins live on the human screen, prioritize architectural modifications, and export official reports.
                </p>
              </div>

              {/* Registered Capabilities 2x2 Grid */}
              <div className="space-y-2.5 pt-1">
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#6B6355]">
                  Active Agent Tools (navigator.modelContext)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                      <Cpu className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>analyze_space</span>
                    </div>
                    <p className="text-[11px] text-[#6B6355] leading-relaxed">
                      Evaluates physical photos across 6 universal design lenses.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                      <Layers className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>get_barrier_details & focus_barrier</span>
                    </div>
                    <p className="text-[11px] text-[#6B6355] leading-relaxed">
                      Retrieves 2D pin locations and focuses pins on the human screen live.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>get_recommendations & summary</span>
                    </div>
                    <p className="text-[11px] text-[#6B6355] leading-relaxed">
                      Calculates highest-impact remediation roadmaps and executive scorecards.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#ECDCC7] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                      <FileCheck className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>generate_accessibility_report</span>
                    </div>
                    <p className="text-[11px] text-[#6B6355] leading-relaxed">
                      Generates vector compliance summary documents for client download.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security Note */}
          <div className="p-3.5 rounded-2xl bg-[#FAF2E6] border border-[#E4D5BE] flex items-start gap-2.5 text-xs text-[#5C4824]">
            <ShieldCheck className="w-4 h-4 text-[#805D26] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              External agents operate within strictly scoped accessibility inspection methods. Visual coordinate focus updates the human browser screen non-destructively in real time.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EAE2D5] bg-[#F4EDE0]/70 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#6B6355]">
            Complies with OpenAI MCP Spec & W3C WebMCP
          </span>
          <button
            id="agent-modal-got-it-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#1A1C20] hover:bg-[#2C2E35] text-[#FAF6EE] font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
