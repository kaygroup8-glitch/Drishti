import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ScanEye,
  Sliders,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Info,
  Layers,
  RotateCcw,
  XCircle,
  X,
  Trash2,
} from 'lucide-react';
import { AnalysisResult, SampleScenario } from '../types';
import { executeWebMCPTool, isNativeWebMCPSupported } from '../webmcp';
import { dispatchPromptLocally } from '../webmcp/dispatcher';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';

interface AgentWorkspaceProps {
  currentResult: AnalysisResult | null;
  onOpenStudio: () => void;
  onSelectSample: (scenario: SampleScenario) => void;
  onOpenUpload: () => void;
  onOpenAgentInfo: () => void;
  onClearSpace?: () => void;
}

interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  toolInvoked?: {
    name: string;
    args: Record<string, any>;
    status: 'running' | 'success' | 'error';
    summary?: string;
  };
  payload?: {
    type: 'analysis' | 'barrier' | 'recommendations' | 'summary' | 'report' | 'error' | 'info';
    data: any;
  };
}

const EXAMPLE_PROMPTS = [
  'Analyze this space for mobility barriers.',
  'Find the most serious accessibility issues.',
  'Explain barrier 2 and how to fix it.',
  'Generate an accessibility report.',
];

export const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({
  currentResult,
  onOpenStudio,
  onSelectSample,
  onOpenUpload,
  onOpenAgentInfo,
  onClearSpace,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const getWelcomeMessage = (result: AnalysisResult | null): AgentMessage => ({
    id: 'welcome-' + Date.now(),
    sender: 'agent',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: result
      ? `I am connected to Drishti through WebMCP. The active scan for "${result.imageName}" is loaded with ${result.findings.length} findings and an accessibility score of ${result.accessibilityScore}/100. How can I assist you with this space?`
      : `I am connected to Drishti through WebMCP. I can execute real multimodal accessibility tools against physical spaces, explain specific barriers, prioritize remediations, or generate compliance reports. Select a sample space or ask me to analyze a space!`,
    payload: {
      type: 'info',
      data: {
        toolsCount: 5,
      },
    },
  });

  const [messages, setMessages] = useState<AgentMessage[]>([getWelcomeMessage(currentResult)]);

  const handleClearChat = () => {
    setMessages([getWelcomeMessage(currentResult)]);
    setPrompt('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendPrompt = async (inputPrompt?: string) => {
    const textToSend = (inputPrompt || prompt).trim();
    if (!textToSend || isProcessing) return;

    setPrompt('');
    const userMsgId = 'user-' + Date.now();
    const agentMsgId = 'agent-' + (Date.now() + 1);

    // 1. Add User Message
    const userMsg: AgentMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // 2. Dispatch query to determine tool and arguments
      const availableBarrierIds = currentResult ? currentResult.findings.map((f) => f.id) : [1, 2, 3];
      const activeTitle = currentResult ? currentResult.imageName : 'Sample Space';

      // Instant client-side deterministic resolution
      const localResolution = dispatchPromptLocally(textToSend, {
        hasActiveScan: Boolean(currentResult),
        availableBarrierIds,
      });

      let toolName = localResolution.toolName;
      let toolArgs: Record<string, any> = { ...localResolution.toolArgs };
      let agentIntent = localResolution.intent;

      try {
        const dispatchRes = await fetch('/api/agent-dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSend,
            hasActiveScan: Boolean(currentResult),
            availableBarrierIds,
            activeSpaceTitle: activeTitle,
          }),
        });

        if (dispatchRes.ok) {
          const dispatchData = await dispatchRes.json();
          if (dispatchData.toolName) {
            toolName = dispatchData.toolName;
            toolArgs = dispatchData.toolArgs || toolArgs;
            agentIntent = dispatchData.agentIntent || dispatchData.intent || agentIntent;
          }
        }
      } catch (dispatchErr) {
        // Network or serverless route error: local resolution succeeds automatically
        console.warn('Backend dispatch skipped/failed, using client-side tool routing:', dispatchErr);
      }

      // If user wants to analyze and no space is active, use first sample scenario
      if (toolName === 'analyze_space' && !currentResult) {
        const defaultSample = SAMPLE_SCENARIOS[0];
        onSelectSample(defaultSample);
        toolArgs.image_data = defaultSample.imageUrl;
        toolArgs.file_name = defaultSample.title;
      }

      // 3. Execute the REAL WebMCP tool via the browser model context registry
      let toolOutput: any = null;
      let errorEncountered: string | null = null;

      try {
        toolOutput = await executeWebMCPTool(toolName, toolArgs);
      } catch (toolErr: any) {
        console.error('WebMCP execution error:', toolErr);
        errorEncountered = toolErr.message || 'Error executing WebMCP tool';
      }

      // 4. Format agent response based on tool results
      let responseText = '';
      let payloadType: 'analysis' | 'barrier' | 'recommendations' | 'summary' | 'report' | 'error' = 'summary';
      let payloadData: any = toolOutput;

      if (errorEncountered) {
        responseText = `I attempted to execute \`${toolName}\`, but encountered an issue: ${errorEncountered}.`;
        payloadType = 'error';
        payloadData = { error: errorEncountered, toolName };
      } else if (toolName === 'analyze_space') {
        if (toolOutput.status === 'success') {
          const score = toolOutput.accessibilityScore ?? 0;
          const label = toolOutput.scoreLabel ? ` (${toolOutput.scoreLabel})` : '';
          const findingsCount = toolOutput.totalFindings ?? toolOutput.findings?.length ?? 0;
          responseText = `I executed \`analyze_space\` using Gemini multimodal vision. The space received an accessibility score of ${score}/100${label} with ${findingsCount} observations identified.`;
          payloadType = 'analysis';
        } else {
          responseText = toolOutput.message || 'No accessibility audit has been run yet. Please analyze a space first.';
          payloadType = 'summary';
        }
      } else if (toolName === 'get_barrier_details') {
        if (toolOutput.status === 'found' && toolOutput.barrier) {
          const b = toolOutput.barrier;
          responseText = `Here are the deep-dive details for Barrier #${b.id} (${b.title}): Identified under the ${b.lens} lens with ${b.severity} severity.`;
          payloadType = 'barrier';
        } else {
          responseText = toolOutput.message || 'No accessibility audit has been run yet. Please analyze a space first.';
          payloadType = 'summary';
        }
      } else if (toolName === 'get_recommendations') {
        if (toolOutput.hasActiveAnalysis) {
          const recCount = toolOutput.totalRecommendations ?? toolOutput.recommendations?.length ?? 0;
          responseText = `I retrieved the prioritized remediation roadmap (${recCount} actions). Here are the most impactful physical and visual modifications to improve accessibility:`;
          payloadType = 'recommendations';
        } else {
          responseText = toolOutput.message || 'No accessibility audit has been run yet. Please analyze a space first.';
          payloadType = 'summary';
        }
      } else if (toolName === 'generate_accessibility_report') {
        if (toolOutput.status === 'generated') {
          responseText = `I generated the accessibility audit report for "${toolOutput.spaceTitle || 'Active Space'}". The PDF report document has been prepared for download.`;
          payloadType = 'report';
        } else {
          responseText = toolOutput.message || 'No accessibility audit has been run yet. Please analyze a space first.';
          payloadType = 'summary';
        }
      } else {
        // get_accessibility_summary or general summary
        if (toolOutput?.hasActiveAnalysis && (toolOutput.accessibilityScore !== undefined || toolOutput.overallScore !== undefined)) {
          const score = toolOutput.accessibilityScore ?? toolOutput.overallScore ?? 0;
          const label = toolOutput.scoreLabel ? ` (${toolOutput.scoreLabel})` : '';
          const totalFindings = toolOutput.totalFindingsCount ?? toolOutput.findings?.length ?? 0;
          responseText = `Here is the current accessibility overview for "${toolOutput.imageName || 'this space'}": The space has an estimated score of ${score}/100${label} with ${totalFindings} observations identified.`;
        } else {
          responseText = toolOutput?.message || 'No accessibility audit has been run yet. Please analyze a space first.';
        }
        payloadType = 'summary';
      }

      const agentMsg: AgentMessage = {
        id: agentMsgId,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        toolInvoked: {
          name: toolName,
          args: toolArgs,
          status: errorEncountered ? 'error' : 'success',
          summary: agentIntent,
        },
        payload: {
          type: payloadType,
          data: payloadData,
        },
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error('Agent processing failed:', err);
      const agentMsg: AgentMessage = {
        id: agentMsgId,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Sorry, I ran into an error processing your request: ${err.message || 'Unknown error'}`,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 space-y-6">
      {/* 1. HEADER */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1C20] text-[#FAF6EE] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-[#FA8F79]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1A1C20] tracking-tight">
                DRISHTI AGENT
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6355]">
                Ask an AI agent to use Drishti’s accessibility tools.
              </p>
            </div>
          </div>

          {/* Header Action Badges & Clear Session */}
          <div className="flex items-center gap-2">
            <button
              id="agent-clear-chat-btn"
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAE1D2] hover:bg-[#DFD5C3] text-[#423D33] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Clear agent conversation and start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#736C5F]" />
              <span>Clear Chat</span>
            </button>

            {/* WebMCP Connection Badge */}
            <button
              onClick={onOpenAgentInfo}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] transition-colors cursor-pointer"
              title="View WebMCP Protocol Details"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-xs font-bold hidden sm:inline">WebMCP Connected</span>
              <span className="text-[11px] font-mono font-semibold bg-[#BBF7D0] px-1.5 py-0.2 rounded-md">
                5 tools
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE SPACE CONTEXT BAR */}
      <div className="bg-[#FAF4EB] border border-[#ECDCC7] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          {currentResult ? (
            <>
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1A1C20] shrink-0 border border-[#000000]/10">
                <img
                  src={currentResult.imageUrl}
                  alt={currentResult.imageName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6B6355]">
                    Active Space
                  </span>
                  <span className="text-xs font-bold text-[#1A1C20] bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#ECDCC7]">
                    Score: {currentResult.accessibilityScore}/100
                  </span>
                </div>
                <p className="text-sm font-bold text-[#1A1C20] truncate">
                  {currentResult.imageName}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFE8DC] flex items-center justify-center text-[#736C5F] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6B6355]">No space loaded</p>
                <p className="text-xs text-[#524B3F]">
                  Select a sample space below or ask the agent to inspect one.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentResult && (
            <>
              <button
                onClick={onOpenStudio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D9CEBC] text-xs font-bold text-[#1A1C20] transition-colors cursor-pointer"
              >
                <ScanEye className="w-3.5 h-3.5 text-[#FA8F79]" />
                <span>View in Studio</span>
              </button>

              {onClearSpace && (
                <button
                  id="agent-clear-space-btn"
                  onClick={onClearSpace}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#EFE7D8] hover:bg-[#E5DAC6] text-[#5C5343] hover:text-[#1A1C20] text-xs font-medium transition-colors cursor-pointer"
                  title="Clear active space"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Space</span>
                </button>
              )}
            </>
          )}

          <div className="flex items-center gap-1.5">
            {SAMPLE_SCENARIOS.slice(0, 2).map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSample(s)}
                className="px-2.5 py-1.5 rounded-xl bg-[#EAE2D4] hover:bg-[#DFD5C4] text-[11px] font-semibold text-[#423D33] transition-colors cursor-pointer truncate max-w-[130px]"
                title={`Load ${s.title}`}
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PROMPT INPUT AREA (PROMINENT AT TOP/MID) */}
      <div className="bg-[#FFFFFF] border border-[#E3D8C7] rounded-[24px] p-4 sm:p-5 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative grow">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask an AI agent to analyze this space, explain barriers, or prioritize fixes..."
              disabled={isProcessing}
              className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-[#FAF6EE] border border-[#E0D5C3] text-sm text-[#1A1C20] placeholder-[#8A8274] focus:outline-none focus:ring-2 focus:ring-[#1A1C20]/20 focus:border-[#1A1C20] transition-all disabled:opacity-60"
            />
            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8274] hover:text-[#1A1C20]"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1C20] hover:bg-[#2C2E35] disabled:bg-[#D9D1C3] text-[#FAF6EE] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#FA8F79]" />
                <span>Running Tool...</span>
              </>
            ) : (
              <>
                <span>Ask Agent</span>
                <Send className="w-4 h-4 text-[#FA8F79]" />
              </>
            )}
          </button>
        </form>

        {/* Quick Example Prompt Chips */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold text-[#787163] uppercase tracking-wider font-mono">
            Suggested Prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((exPrompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(exPrompt)}
                disabled={isProcessing}
                className="text-xs font-medium text-[#423D33] bg-[#FAF6EE] hover:bg-[#F2ECE1] border border-[#E3D8C7] px-3 py-1.5 rounded-xl transition-all hover:border-[#C4B7A2] cursor-pointer disabled:opacity-50 text-left"
              >
                {exPrompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CONVERSATION / EXECUTION FEED */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } animate-fade-in`}
          >
            <div
              className={`max-w-3xl rounded-[24px] p-5 sm:p-6 space-y-3.5 shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#1A1C20] text-[#FAF6EE] rounded-tr-sm ml-8'
                  : 'bg-[#FAF4EB] border border-[#ECDCC7] text-[#1A1C20] rounded-tl-sm mr-4'
              }`}
            >
              {/* Header meta */}
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  {msg.sender === 'agent' ? (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-[#1A1C20] text-[#FA8F79] flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold font-heading text-[#1A1C20]">
                        Drishti Agent
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-[#E5DCCE]">You</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-mono ${
                    msg.sender === 'user' ? 'text-[#9CA3AF]' : 'text-[#787163]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* WebMCP Tool Invocation Badge */}
              {msg.toolInvoked && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span className="font-mono font-bold text-[#166534]">
                    WebMCP: {msg.toolInvoked.name}()
                  </span>
                  {msg.toolInvoked.summary && (
                    <span className="text-[#15803D] hidden sm:inline">
                      • {msg.toolInvoked.summary}
                    </span>
                  )}
                </div>
              )}

              {/* Message text */}
              <p
                className={`text-sm leading-relaxed ${
                  msg.sender === 'user' ? 'text-[#FAF6EE]' : 'text-[#36322A]'
                }`}
              >
                {msg.text}
              </p>

              {/* STRUCTURED PAYLOAD WIDGETS */}
              {msg.payload && msg.payload.type === 'summary' && msg.payload.data && msg.payload.data.hasActiveAnalysis && (
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3D8C7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B6355]">
                      {msg.payload.data.imageName || 'Accessibility Scorecard'}
                    </span>
                    <span className="text-xs font-bold text-[#1A1C20] bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-[#ECDCC7]">
                      Score: {msg.payload.data.accessibilityScore ?? msg.payload.data.overallScore ?? 0}/100
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]">
                      {msg.payload.data.highPriorityCount ?? 0} High Priority
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#92400E] border border-[#FCD34D]">
                      {msg.payload.data.mediumPriorityCount ?? 0} Medium Priority
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                      {msg.payload.data.lowPriorityCount ?? 0} Low Priority
                    </span>
                  </div>

                  {(msg.payload.data.highestPriorityImprovement || msg.payload.data.topRecommendedImprovement) && (
                    <p className="text-xs text-[#524B3F] leading-relaxed bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EAE2D5]">
                      <strong>Top Recommended Fix:</strong>{' '}
                      {msg.payload.data.highestPriorityImprovement || msg.payload.data.topRecommendedImprovement}
                    </p>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={onOpenStudio}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold hover:bg-[#2C2E35] transition-colors cursor-pointer"
                    >
                      <ScanEye className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>View Full Studio Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {msg.payload && msg.payload.type === 'analysis' && (
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3D8C7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B6355]">Analysis Summary</span>
                    <span className="text-xs font-bold text-[#1A1C20] bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-[#ECDCC7]">
                      Score: {msg.payload.data.accessibilityScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-[#524B3F] leading-relaxed">
                    <strong>Highest Priority Fix:</strong> {msg.payload.data.highestPriorityImprovement}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={onOpenStudio}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold hover:bg-[#2C2E35] transition-colors cursor-pointer"
                    >
                      <ScanEye className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>Inspect Pins in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {msg.payload && msg.payload.type === 'barrier' && msg.payload.data.barrier && (
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3D8C7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1C20]">
                      Barrier #{msg.payload.data.barrier.id}: {msg.payload.data.barrier.title}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        msg.payload.data.barrier.severity === 'High'
                          ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]'
                          : msg.payload.data.barrier.severity === 'Medium'
                          ? 'bg-[#FFFBEB] text-[#92400E] border border-[#FCD34D]'
                          : 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                      }`}
                    >
                      {msg.payload.data.barrier.severity} Severity
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#524B3F]">
                    <p>
                      <strong>Detected:</strong> {msg.payload.data.barrier.whatDetected}
                    </p>
                    <p>
                      <strong>Why It Matters:</strong> {msg.payload.data.barrier.whyItMatters}
                    </p>
                    <p className="text-[#1A1C20] font-medium bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EAE2D5]">
                      <strong>Recommended Fix:</strong> {msg.payload.data.barrier.suggestedImprovement}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={onOpenStudio}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold hover:bg-[#2C2E35] transition-colors cursor-pointer"
                    >
                      <ScanEye className="w-3.5 h-3.5 text-[#FA8F79]" />
                      <span>View Marker #{msg.payload.data.barrier.id}</span>
                    </button>
                  </div>
                </div>
              )}

              {msg.payload && msg.payload.type === 'recommendations' && (
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3D8C7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B6355]">Remediation Priorities</span>
                    <span className="text-xs font-mono font-semibold text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded-md">
                      {msg.payload.data.totalRecommendations || (msg.payload.data.recommendations || msg.payload.data.prioritizedRecommendations || []).length} Actions
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(msg.payload.data.recommendations || msg.payload.data.prioritizedRecommendations || []).slice(0, 3).map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EAE2D5] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1A1C20]">
                            #{idx + 1} {rec.title}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FAF4EB] border border-[#ECDCC7] text-[#524B3F]">
                            {rec.severity}
                          </span>
                        </div>
                        <p className="text-[#524B3F]">{rec.recommendation || rec.recommendedFix || rec.suggestedImprovement}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={onOpenStudio}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold hover:bg-[#2C2E35] transition-colors cursor-pointer"
                    >
                      <span>Open Full Studio Roadmap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {msg.payload && msg.payload.type === 'report' && (
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3D8C7] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#166534]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A1C20]">Accessibility Audit PDF</p>
                      <p className="text-[11px] text-[#6B6355]">Standardized compliance report generated</p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenStudio}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1A1C20] text-[#FAF6EE] text-xs font-bold hover:bg-[#2C2E35] transition-colors cursor-pointer"
                  >
                    View Report
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-6 h-6 rounded-lg bg-[#1A1C20] text-[#FA8F79] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#FAF4EB] border border-[#ECDCC7] rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1C20]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FA8F79]" />
                <span>Executing WebMCP accessibility tools...</span>
              </div>
              <p className="text-xs text-[#6B6355]">
                Invoking registered methods on document.modelContext
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
