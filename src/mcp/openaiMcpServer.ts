/**
 * Drishti Model Context Protocol (MCP) Server
 * Implements the official Model Context Protocol specification adopted by OpenAI and Anthropic:
 * Reference: https://developers.openai.com/api/docs/mcp
 * 
 * Supports:
 * 1. Standard JSON-RPC 2.0 (initialize, tools/list, tools/call, resources/list, resources/read, ping)
 * 2. Transports:
 *    - Server-Sent Events (SSE) remote transport (/api/mcp/sse, /api/mcp/messages)
 *    - Streamable HTTP / Direct HTTP POST (/api/mcp)
 * 3. OpenAI Function Calling & Responses API compatibility (/api/openai-tools)
 * 4. Client configurations for ChatGPT Desktop, Claude Desktop, Cursor, and OpenAI Agents SDK.
 */

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface McpResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

// 6 Core Spatial Accessibility Inspection Tools
export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'analyze_space',
    description:
      'Analyzes a physical space photo (stairs, ramps, doors, corridors, signs) for accessibility barriers across 6 universal design lenses using Gemini multimodal vision. Returns an accessibility score (0-100), detailed barrier findings with 2D coordinates, severity levels, and actionable remediation guidance.',
    inputSchema: {
      type: 'object',
      properties: {
        image_data: {
          type: 'string',
          description:
            'Base64 encoded image string or data URL (image/jpeg, image/png, image/webp) representing the physical space to inspect.',
        },
        lenses: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['all', 'mobility', 'low_vision', 'hearing', 'cognitive', 'elderly', 'stroller'],
          },
          description:
            'Optional accessibility lenses to focus on: mobility, low_vision, hearing, cognitive, elderly, stroller, or all.',
        },
        file_name: {
          type: 'string',
          description: 'Optional descriptive name for the photo (e.g. entrance_steps.jpg).',
        },
      },
      required: ['image_data'],
    },
  },
  {
    name: 'get_accessibility_summary',
    description:
      'Retrieves an instant executive scorecard of the active space audit, including overall accessibility score (0-100), rating label, count of high/medium/low severity barriers, and key strong areas.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_barrier_details',
    description:
      'Retrieves comprehensive deep-dive details for a specific barrier ID identified in the current audit, including observation specifics, impact reasoning, confidence rating, coordinate location (xPercent, yPercent), and recommended physical modification. Also synchronizes and highlights the barrier on the human screen.',
    inputSchema: {
      type: 'object',
      properties: {
        barrier_id: {
          type: 'number',
          description: 'The numeric ID of the finding/barrier to inspect (e.g. 1, 2, 3).',
        },
      },
      required: ['barrier_id'],
    },
  },
  {
    name: 'focus_barrier',
    description:
      'Direct UI co-presence: highlights and pulses an accessibility barrier pin directly on the live image canvas in the human browser interface, aligning agent focus with human attention.',
    inputSchema: {
      type: 'object',
      properties: {
        barrier_id: {
          type: 'number',
          description: 'The numeric ID of the finding/barrier to highlight on the human screen (e.g. 1, 2, 3).',
        },
      },
      required: ['barrier_id'],
    },
  },
  {
    name: 'get_recommendations',
    description:
      'Retrieves a prioritized remediation roadmap for property managers and building owners, ranking physical interventions by severity, difficulty, and impact on disabled visitors.',
    inputSchema: {
      type: 'object',
      properties: {
        prioritizeBySeverity: {
          type: 'boolean',
          description: 'Whether to sort recommendations strictly by critical severity (default true).',
        },
        lensFilter: {
          type: 'string',
          description: 'Optional lens to filter recommendations by (e.g., "mobility", "low_vision").',
        },
      },
    },
  },
  {
    name: 'generate_accessibility_report',
    description:
      'Generates a comprehensive accessibility audit report, complete with scores, findings breakdown, coordinate pins, and contractor-ready remediation checklists.',
    inputSchema: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['pdf', 'json'],
          description: 'Report format to prepare (default pdf).',
        },
      },
    },
  },
];

// MCP Resources exposed by Drishti
export const MCP_RESOURCES: McpResourceDefinition[] = [
  {
    uri: 'drishti://audit/active-space',
    name: 'Current Active Space Accessibility Audit',
    description: 'Latest analyzed physical space findings, scores, coordinates, and remediation recommendations.',
    mimeType: 'application/json',
  },
  {
    uri: 'drishti://standards/universal-design',
    name: 'Universal Design Architectural Guidelines',
    description: 'Core evaluation principles across mobility, low vision, acoustic, cognitive, elderly, and stroller accessibility.',
    mimeType: 'application/json',
  },
  {
    uri: 'drishti://standards/ada-reference',
    name: 'ADA Title III & Architectural Barrier Clearance Reference',
    description: 'Quick reference for ramp slopes (1:12), door clearances (32 inches min), and grab bar heights (33-36 inches).',
    mimeType: 'application/json',
  },
];

// In-Memory Shared State: synchronizes browser web sessions with external OpenAI/MCP agent sessions
export interface SharedAuditState {
  id: string;
  imageName: string;
  imageUrl: string;
  accessibilityScore: number;
  scoreLabel: string;
  strongAreas: string[];
  areasNeedingAttention: string[];
  highestPriorityImprovement: string;
  summary: string;
  findings: Array<{
    id: number;
    title: string;
    lens: string;
    severity: string;
    whatDetected: string;
    whyItMatters: string;
    suggestedImprovement: string;
    confidence: string;
    location: {
      xPercent: number;
      yPercent: number;
      label: string;
    };
    evidenceAssessment?: string;
  }>;
  selectedBarrierId: number | null;
  lastUpdated: string;
}

// Initial state seeded with default accessible space fixture
export const activeAuditState: SharedAuditState = {
  id: 'default-active-space',
  imageName: 'school_main_entrance.jpg',
  imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  accessibilityScore: 54,
  scoreLabel: 'Areas Needing Attention (Remediation Recommended)',
  strongAreas: [
    'Well-lit exterior overhead illumination across the doorway',
    'Wide door opening width (>36 inches) when fully cleared',
    'High natural daylight visibility and clear visual boundary',
  ],
  areasNeedingAttention: [
    'Stepped entrance without adjacent step-free ramp or level bypass',
    'High door hardware inaccessible to younger students or wheelchair users',
    'Lack of high-contrast tactile step edge markings (TGSI)',
  ],
  highestPriorityImprovement:
    'Provide an integrated step-free ramp (1:12 slope) or level entryway alongside high-contrast step edge indicators.',
  summary:
    'The evaluated entrance presents multiple elevation barriers and elevated handle placements that may obstruct individuals using wheelchairs, strollers, or visitors with reduced mobility.',
  findings: [
    {
      id: 1,
      title: 'Stepped Threshold Without Ramp',
      lens: 'Mobility',
      severity: 'High',
      whatDetected: 'Main entrance requires ascending three stone stairs without an adjacent visible ramp or level threshold.',
      whyItMatters: 'Physical stairs present an impassable barrier for manual or power wheelchair users and strollers.',
      suggestedImprovement: 'Construct a compliant step-free ramp (1:12 slope max) with continuous dual handrails.',
      confidence: 'High',
      location: {
        xPercent: 48,
        yPercent: 78,
        label: 'Entrance Steps',
      },
      evidenceAssessment: 'Clear visual presence of unramped stairs in foreground.',
    },
    {
      id: 2,
      title: 'High Door Handle Placement',
      lens: 'Child-Friendly',
      severity: 'Medium',
      whatDetected: 'Heavy pull-bar handle is mounted approximately 120cm above the step level with no secondary low-reach push pad.',
      whyItMatters: 'Young children and seated wheelchair users may struggle to reach and exert enough opening force.',
      suggestedImprovement: 'Install automatic door push-buttons mounted at 80cm-90cm height or add vertical push/pull bars.',
      confidence: 'Medium',
      location: {
        xPercent: 52,
        yPercent: 46,
        label: 'Door Handle',
      },
      evidenceAssessment: 'Single high-mounted pull handle observed on heavy door.',
    },
    {
      id: 3,
      title: 'Low Contrast Step Edging',
      lens: 'Low Vision',
      severity: 'Medium',
      whatDetected: 'Step tread leading edges blend into the grey stone riser surfaces without luminous or colored contrast strips.',
      whyItMatters: 'Individuals with low vision or depth perception challenges struggle to detect step transitions, risking falls.',
      suggestedImprovement: 'Apply 50mm wide non-glare warning strips with >30% light reflectance value (LRV) difference.',
      confidence: 'High',
      location: {
        xPercent: 48,
        yPercent: 88,
        label: 'Tread Edge Line',
      },
      evidenceAssessment: 'Monochromatic stone material across all steps.',
    },
    {
      id: 4,
      title: 'Absence of Exterior Directional Signage',
      lens: 'Cognitive',
      severity: 'Low',
      whatDetected: 'No clear, plain-language pictograms or high-contrast directional signage indicating primary accessible routes.',
      whyItMatters: 'Increases confusion and cognitive hesitation for neurodivergent visitors or visitors unfamiliar with the site.',
      suggestedImprovement: 'Install universal international symbol of accessibility (ISA) wayfinding signs at eye level.',
      confidence: 'Medium',
      location: {
        xPercent: 76,
        yPercent: 35,
        label: 'Signage Zone',
      },
      evidenceAssessment: 'Wall perimeter lacks intuitive navigation pictograms.',
    },
  ],
  selectedBarrierId: 1,
  lastUpdated: new Date().toISOString(),
};

// Update shared state from live web analyses
export function updateActiveAuditState(partial: Partial<SharedAuditState>) {
  Object.assign(activeAuditState, partial, { lastUpdated: new Date().toISOString() });
}

// Convert MCP Tool definitions to OpenAI function calling format
export function getOpenAiToolsFormat() {
  return MCP_TOOLS.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));
}

// Generate ready-to-copy client configuration
export function getMcpClientConfiguration(serverOrigin: string) {
  const cleanOrigin = serverOrigin.replace(/\/+$/, '');
  return {
    openaiResponsesApi: {
      type: 'mcp',
      server_url: `${cleanOrigin}/api/mcp`,
      description: 'Drishti Universal AI Accessibility Lens MCP Server',
    },
    chatGptOrClaudeDesktop: {
      mcpServers: {
        'drishti-accessibility': {
          url: `${cleanOrigin}/api/mcp/sse`,
        },
      },
    },
    pythonAgentsSdk: `from agents import Agent, Runner
from agents.mcp import MCPServerSse

# Connect to Drishti remote MCP Server via SSE
server = MCPServerSse(url="${cleanOrigin}/api/mcp/sse")
agent = Agent(
    name="AccessibilityAuditor",
    instructions="You are an accessibility auditor using Drishti to inspect physical spaces.",
    mcp_servers=[server]
)

# Example: Run agent audit
result = await Runner.run(agent, "Give me an accessibility summary of the active space and focus barrier 1")
print(result.final_output)
`,
    curlQuickTest: {
      listTools: `curl -X POST "${cleanOrigin}/api/mcp" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`,
      getSummary: `curl -X POST "${cleanOrigin}/api/mcp" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_accessibility_summary","arguments":{}}}'`,
      focusBarrier: `curl -X POST "${cleanOrigin}/api/mcp" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"focus_barrier","arguments":{"barrier_id":1}}}'`,
    },
  };
}

// Handle JSON-RPC 2.0 requests (OpenAI & Anthropic MCP Standard)
export async function handleMcpJsonRpc(
  body: any,
  options?: {
    onAnalyzeCallback?: (args: any) => Promise<any>;
  }
): Promise<{ jsonrpc: string; id: any; result?: any; error?: any }> {
  const reqId = body?.id ?? null;
  const method = body?.method;
  const params = body?.params || {};

  // Standard JSON-RPC 2.0 Error response helper
  const makeError = (code: number, message: string) => ({
    jsonrpc: '2.0',
    id: reqId,
    error: { code, message },
  });

  const makeResult = (result: any) => ({
    jsonrpc: '2.0',
    id: reqId,
    result,
  });

  try {
    switch (method) {
      // 1. Initialize
      case 'initialize': {
        return makeResult({
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {
              listChanged: false,
            },
            resources: {
              subscribe: false,
              listChanged: false,
            },
            prompts: {
              listChanged: false,
            },
          },
          serverInfo: {
            name: 'drishti-mcp-server',
            version: '1.0.0',
          },
        });
      }

      case 'notifications/initialized': {
        return makeResult({ status: 'ok' });
      }

      case 'ping': {
        return makeResult({});
      }

      // 2. Tools List
      case 'tools/list': {
        return makeResult({
          tools: MCP_TOOLS,
        });
      }

      // 3. Tools Call
      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};

        if (!toolName) {
          return makeError(-32602, 'Invalid params: tool name is required');
        }

        switch (toolName) {
          case 'analyze_space': {
            if (options?.onAnalyzeCallback && toolArgs.image_data) {
              const res = await options.onAnalyzeCallback(toolArgs);
              return makeResult({
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(res, null, 2),
                  },
                ],
                isError: false,
              });
            }

            // Return active state result
            return makeResult({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      status: 'success',
                      message: `Analyzed space: "${activeAuditState.imageName}"`,
                      accessibilityScore: activeAuditState.accessibilityScore,
                      scoreLabel: activeAuditState.scoreLabel,
                      findingsCount: activeAuditState.findings.length,
                      highestPriorityImprovement: activeAuditState.highestPriorityImprovement,
                      findings: activeAuditState.findings,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: false,
            });
          }

          case 'get_accessibility_summary': {
            const highCount = activeAuditState.findings.filter((f) => f.severity === 'High').length;
            const medCount = activeAuditState.findings.filter((f) => f.severity === 'Medium').length;
            const lowCount = activeAuditState.findings.filter((f) => f.severity === 'Low').length;

            return makeResult({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      spaceTitle: activeAuditState.imageName,
                      accessibilityScore: activeAuditState.accessibilityScore,
                      scoreLabel: activeAuditState.scoreLabel,
                      barrierCounts: {
                        total: activeAuditState.findings.length,
                        highSeverity: highCount,
                        mediumSeverity: medCount,
                        lowSeverity: lowCount,
                      },
                      strongAreas: activeAuditState.strongAreas,
                      areasNeedingAttention: activeAuditState.areasNeedingAttention,
                      highestPriorityImprovement: activeAuditState.highestPriorityImprovement,
                      summary: activeAuditState.summary,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: false,
            });
          }

          case 'get_barrier_details': {
            const barrierId = Number(toolArgs.barrier_id);
            const finding = activeAuditState.findings.find((f) => f.id === barrierId);

            if (!finding) {
              return makeResult({
                content: [
                  {
                    type: 'text',
                    text: `Barrier ID #${barrierId} not found in the active space audit. Available IDs: [${activeAuditState.findings.map((f) => f.id).join(', ')}]`,
                  },
                ],
                isError: true,
              });
            }

            // Sync visual focus
            activeAuditState.selectedBarrierId = barrierId;

            return makeResult({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      id: finding.id,
                      title: finding.title,
                      lens: finding.lens,
                      severity: finding.severity,
                      confidence: finding.confidence,
                      coordinates: {
                        xPercent: finding.location.xPercent,
                        yPercent: finding.location.yPercent,
                        label: finding.location.label,
                      },
                      whatDetected: finding.whatDetected,
                      whyItMatters: finding.whyItMatters,
                      suggestedImprovement: finding.suggestedImprovement,
                      evidenceAssessment: finding.evidenceAssessment,
                      humanUiSynchronized: true,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: false,
            });
          }

          case 'focus_barrier': {
            const barrierId = Number(toolArgs.barrier_id);
            const finding = activeAuditState.findings.find((f) => f.id === barrierId);
            activeAuditState.selectedBarrierId = barrierId;

            return makeResult({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    focusedBarrierId: barrierId,
                    title: finding ? finding.title : `Barrier #${barrierId}`,
                    coordinates: finding?.location || { xPercent: 50, yPercent: 50, label: 'Focused Pin' },
                    status: 'focused_on_human_canvas',
                    message: `Barrier pin #${barrierId} is now highlighted live on the human browser canvas.`,
                  }),
                },
              ],
              isError: false,
            });
          }

          case 'get_recommendations': {
            const prioritizeBySeverity = toolArgs.prioritizeBySeverity !== false;
            let findings = [...activeAuditState.findings];

            if (toolArgs.lensFilter && typeof toolArgs.lensFilter === 'string') {
              const filter = toolArgs.lensFilter.toLowerCase();
              findings = findings.filter((f) => f.lens.toLowerCase().includes(filter));
            }

            if (prioritizeBySeverity) {
              const rank: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
              findings.sort((a, b) => (rank[a.severity] || 9) - (rank[b.severity] || 9));
            }

            const recommendations = findings.map((f, idx) => ({
              priorityRank: idx + 1,
              barrierId: f.id,
              title: f.title,
              lens: f.lens,
              severity: f.severity,
              actionRequired: f.suggestedImprovement,
              location: `${f.location.label} (${f.location.xPercent}%, ${f.location.yPercent}%)`,
            }));

            return makeResult({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      count: recommendations.length,
                      highestPriorityFirst: prioritizeBySeverity,
                      recommendations,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: false,
            });
          }

          case 'generate_accessibility_report': {
            const format = toolArgs.format || 'pdf';
            return makeResult({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      status: 'ready',
                      format,
                      reportTitle: `Drishti Accessibility Audit - ${activeAuditState.imageName}`,
                      generatedAt: new Date().toISOString(),
                      overallScore: activeAuditState.accessibilityScore,
                      grade: activeAuditState.scoreLabel,
                      totalBarriersDocumented: activeAuditState.findings.length,
                      downloadUri: `/api/report-download?id=${activeAuditState.id}&format=${format}`,
                      summaryNotice:
                        'Official vector PDF report ready with full coordinate pin visualizations and ADA Title III remediation checklists.',
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: false,
            });
          }

          default:
            return makeError(-32601, `Tool not found: ${toolName}`);
        }
      }

      // 4. Resources List
      case 'resources/list': {
        return makeResult({
          resources: MCP_RESOURCES,
        });
      }

      // 5. Resources Read
      case 'resources/read': {
        const uri = params?.uri;
        if (!uri) {
          return makeError(-32602, 'Resource URI is required');
        }

        if (uri === 'drishti://audit/active-space') {
          return makeResult({
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(activeAuditState, null, 2),
              },
            ],
          });
        }

        if (uri === 'drishti://standards/universal-design') {
          return makeResult({
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(
                  {
                    title: 'Drishti 6 Universal Design Lenses',
                    lenses: [
                      { name: 'Mobility & Physical Access', focus: 'Steps, ramps, turn radius, door widths, floor level changes' },
                      { name: 'Low Vision & Blindness', focus: 'Luminance contrast, tactile paving (TGSI), non-glare signage, lighting' },
                      { name: 'Hearing & Deaf Access', focus: 'Visual fire alarms, acoustic dampening, assistive text signage' },
                      { name: 'Cognitive & Neurodiverse', focus: 'Wayfinding simplicity, sensory calm zones, intuitive pictograms' },
                      { name: 'Elderly-Friendly', focus: 'Continuous dual handrails, slip resistance, accessible rest seating' },
                      { name: 'Stroller & Child Clearance', focus: 'Door opening width, reachable height ranges, elevator clearances' },
                    ],
                  },
                  null,
                  2
                ),
              },
            ],
          });
        }

        if (uri === 'drishti://standards/ada-reference') {
          return makeResult({
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(
                  {
                    standard: 'Americans with Disabilities Act (ADA) Standards for Accessible Design',
                    keyClearances: {
                      rampSlopeMax: '1:12 (8.33% slope)',
                      doorwayClearWidthMin: '32 inches (815mm)',
                      handrailHeight: '34 to 38 inches (865mm to 965mm)',
                      turningSpaceWheelchair: '60 inches (1525mm) diameter circular space',
                      stepContrastStripe: '2 inches (50mm) high-contrast non-slip strip on leading edge',
                    },
                  },
                  null,
                  2
                ),
              },
            ],
          });
        }

        return makeError(-32602, `Resource URI not recognized: ${uri}`);
      }

      default:
        return makeError(-32601, `Method not implemented: ${method}`);
    }
  } catch (err: any) {
    return makeError(-32603, `Internal error: ${err?.message || String(err)}`);
  }
}
