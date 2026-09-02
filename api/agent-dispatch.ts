import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'drishti-accessibility-agent',
        },
      },
    });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { prompt, hasActiveScan, availableBarrierIds = [], activeSpaceTitle = 'Current Space' } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const lowerPrompt = prompt.toLowerCase();

    // Deterministic Rule Matching
    let matchedTool = 'get_accessibility_summary';
    let matchedArgs: Record<string, any> = {};
    let matchedGoal = 'Review accessibility overview';

    if (
      lowerPrompt.includes('analyze') ||
      lowerPrompt.includes('scan') ||
      lowerPrompt.includes('evaluate') ||
      lowerPrompt.includes('audit') ||
      lowerPrompt.includes('check this space')
    ) {
      matchedTool = 'analyze_space';
      const detectedLenses: string[] = [];
      if (lowerPrompt.includes('wheelchair') || lowerPrompt.includes('mobility') || lowerPrompt.includes('ramp') || lowerPrompt.includes('step')) {
        detectedLenses.push('mobility');
      }
      if (lowerPrompt.includes('vision') || lowerPrompt.includes('contrast') || lowerPrompt.includes('blind') || lowerPrompt.includes('sight')) {
        detectedLenses.push('low_vision');
      }
      if (lowerPrompt.includes('hearing') || lowerPrompt.includes('deaf') || lowerPrompt.includes('sound')) {
        detectedLenses.push('hearing');
      }
      if (lowerPrompt.includes('cognitive') || lowerPrompt.includes('neurodiverse') || lowerPrompt.includes('wayfinding')) {
        detectedLenses.push('cognitive');
      }
      if (lowerPrompt.includes('elderly') || lowerPrompt.includes('senior') || lowerPrompt.includes('aging')) {
        detectedLenses.push('elderly');
      }
      if (lowerPrompt.includes('stroller') || lowerPrompt.includes('child')) {
        detectedLenses.push('stroller');
      }
      matchedArgs = {
        lenses: detectedLenses.length > 0 ? detectedLenses : ['all'],
      };
      matchedGoal = `Analyze space using ${detectedLenses.length > 0 ? detectedLenses.join(', ') : 'all'} accessibility lenses`;
    } else if (
      lowerPrompt.includes('barrier') ||
      lowerPrompt.includes('issue') ||
      lowerPrompt.includes('problem') ||
      lowerPrompt.includes('finding') ||
      lowerPrompt.includes('obstacle') ||
      lowerPrompt.includes('explain') ||
      lowerPrompt.includes('observation')
    ) {
      // Check for specific barrier number (e.g. barrier 2, issue 1, #3)
      const numMatch = lowerPrompt.match(/(?:barrier|issue|finding|item|number|#)\s*([0-9]+)/i) || lowerPrompt.match(/\b([1-9])\b/);
      const barrierId = numMatch ? parseInt(numMatch[1], 10) : (availableBarrierIds[0] || 1);

      if (
        lowerPrompt.includes('most serious') ||
        lowerPrompt.includes('top issues') ||
        lowerPrompt.includes('highest') ||
        lowerPrompt.includes('all barriers') ||
        lowerPrompt.includes('serious accessibility')
      ) {
        matchedTool = 'get_recommendations';
        matchedArgs = { prioritizeBySeverity: true };
        matchedGoal = 'Identify the highest-severity accessibility barriers';
      } else {
        matchedTool = 'get_barrier_details';
        matchedArgs = { barrier_id: barrierId };
        matchedGoal = `Inspect barrier #${barrierId} in detail`;
      }
    } else if (
      lowerPrompt.includes('recommend') ||
      lowerPrompt.includes('fix') ||
      lowerPrompt.includes('improve') ||
      lowerPrompt.includes('action') ||
      lowerPrompt.includes('priority') ||
      lowerPrompt.includes('solution')
    ) {
      matchedTool = 'get_recommendations';
      matchedArgs = { prioritizeBySeverity: true };
      matchedGoal = 'Retrieve prioritized accessibility remediation steps';
    } else if (
      lowerPrompt.includes('report') ||
      lowerPrompt.includes('pdf') ||
      lowerPrompt.includes('export') ||
      lowerPrompt.includes('document') ||
      lowerPrompt.includes('compliance sheet')
    ) {
      matchedTool = 'generate_accessibility_report';
      matchedArgs = { format: 'pdf', includeEvidenceAssessment: true };
      matchedGoal = 'Generate vector compliance summary document';
    }

    const ai = getAiClient();
    if (ai) {
      try {
        const routerPrompt = `You are Drishti Agent Router. A user provided this instruction for an accessibility audit toolset:
"${prompt}"

Context:
- hasActiveScan: ${Boolean(hasActiveScan)}
- activeSpaceTitle: "${activeSpaceTitle}"
- availableBarrierIds: [${availableBarrierIds.join(', ')}]

Available WebMCP Tools:
1. "analyze_space": { "lenses": ["all"|"mobility"|"low_vision"|"hearing"|"cognitive"|"elderly"|"stroller"] } - evaluates a space photo for accessibility barriers.
2. "get_accessibility_summary": {} - returns overall score, rating, strong areas, and areas needing attention.
3. "get_barrier_details": { "barrier_id": number } - deep dive on a specific barrier ID (what was detected, why it matters, how to fix it).
4. "get_recommendations": { "prioritizeBySeverity": boolean } - prioritized list of architectural modifications and fixes.
5. "generate_accessibility_report": { "format": "pdf", "includeEvidenceAssessment": boolean } - exports printable PDF accessibility report.

Select the best tool, construct the arguments object, and explain the goal briefly.
If the prompt asks to explain a specific barrier by number (e.g. "barrier 2", "issue 1"), ALWAYS select "get_barrier_details" with that barrier_id.
If the prompt asks for serious issues or remediation roadmap, select "get_recommendations".`;

        const modelCandidates = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-2.5-flash'];
        for (const modelName of modelCandidates) {
          try {
            const aiDecision = await ai.models.generateContent({
              model: modelName,
              contents: routerPrompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    toolName: {
                      type: Type.STRING,
                      enum: [
                        'analyze_space',
                        'get_accessibility_summary',
                        'get_barrier_details',
                        'get_recommendations',
                        'generate_accessibility_report',
                      ],
                    },
                    toolArgs: {
                      type: Type.OBJECT,
                      properties: {
                        barrier_id: { type: Type.INTEGER },
                        prioritizeBySeverity: { type: Type.BOOLEAN },
                        format: { type: Type.STRING },
                        includeEvidenceAssessment: { type: Type.BOOLEAN },
                        lenses: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                    },
                    intent: { type: Type.STRING },
                  },
                  required: ['toolName', 'toolArgs', 'intent'],
                },
              },
            });

            if (aiDecision.text) {
              const parsed = JSON.parse(aiDecision.text);
              if (parsed.toolName) {
                return res.status(200).json({
                  toolName: parsed.toolName,
                  toolArgs: parsed.toolArgs || {},
                  intent: parsed.intent || matchedGoal,
                });
              }
            }
          } catch {
            // Try next model
          }
        }
      } catch {
        // Fall back to rule-based matching
      }
    }

    return res.status(200).json({
      toolName: matchedTool,
      toolArgs: matchedArgs,
      intent: matchedGoal,
    });
  } catch (error: any) {
    console.error('Agent dispatch error on Vercel:', error);
    return res.status(500).json({
      error: error?.message || 'Agent dispatch failed',
      toolName: 'get_accessibility_summary',
      toolArgs: {},
    });
  }
}
