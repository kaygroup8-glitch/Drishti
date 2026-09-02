import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
  AnalyzeSpaceArgs,
  AnalyzeSpaceOutput,
} from './types';

// Supported lenses map
const LENS_MAPPING: Record<string, string> = {
  mobility: 'Mobility',
  low_vision: 'Low Vision',
  vision: 'Low Vision',
  hearing: 'Hearing',
  cognitive: 'Cognitive',
  elderly: 'Elderly-Friendly',
  stroller: 'Child-Friendly',
  child: 'Child-Friendly',
  all: 'all',
};

export function createAnalyzeSpaceTool(bridge: WebMCPAppBridge): WebMCPToolDefinition<AnalyzeSpaceArgs, AnalyzeSpaceOutput> {
  const schema = {
    type: 'object',
    description: 'Analyze an uploaded image or photo of a physical space for accessibility barriers across multiple lenses using Gemini multimodal vision.',
    properties: {
      image_data: {
        type: 'string',
        description: 'Base64 encoded image string or data URL (image/jpeg, image/png, or image/webp) representing the physical space to inspect.',
      },
      lenses: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['all', 'mobility', 'low_vision', 'hearing', 'cognitive', 'elderly', 'stroller'],
        },
        description: 'Optional accessibility lenses to focus on. Supported: mobility, low_vision, hearing, cognitive, elderly, stroller, or all (default).',
      },
      file_name: {
        type: 'string',
        description: 'Optional descriptive name for the photo (e.g., entrance_stairs.jpg).',
      },
    },
    required: ['image_data'],
  };

  return {
    name: 'analyze_space',
    description: 'Analyzes a physical space photo (stairs, ramps, doors, corridors, signs) for accessibility barriers across 6 universal design lenses using Gemini multimodal vision. Returns an accessibility score (0-100), detailed barrier findings, coordinate markers, and actionable remediation guidance.',
    parameters: schema,
    inputSchema: schema,
    execute: async (args: AnalyzeSpaceArgs): Promise<AnalyzeSpaceOutput> => {
      // Allow using current active image if none provided or set to 'current'
      let targetImage = args?.image_data;
      if (!targetImage || targetImage === 'current' || targetImage === 'active') {
        const active = bridge.getCurrentResult();
        if (active && active.imageUrl) {
          targetImage = active.imageUrl;
        } else {
          throw new Error('Validation Error: No space is currently loaded. Please provide "image_data" or select a space first.');
        }
      }

      if (typeof targetImage !== 'string' || targetImage.trim().length === 0) {
        throw new Error('Validation Error: "image_data" must be a non-empty base64 string or data URL.');
      }

      // Parse and normalize lenses
      let parsedLenses: string[] = ['all'];
      if (args.lenses) {
        const rawList = Array.isArray(args.lenses)
          ? args.lenses
          : typeof args.lenses === 'string'
          ? (args.lenses as string).split(',').map((s) => s.trim())
          : ['all'];

        const normalized = rawList
          .map((l) => l.toLowerCase().replace(/[\s-]/g, '_'))
          .map((l) => LENS_MAPPING[l] || l)
          .filter(Boolean);

        if (normalized.length > 0) {
          parsedLenses = normalized.includes('all') ? ['all'] : normalized;
        }
      }

      // Determine MIME type
      let mimeType = 'image/jpeg';
      let rawBase64 = targetImage;
      if (targetImage.startsWith('data:')) {
        const matches = targetImage.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          rawBase64 = matches[2];
        }
      }

      const fileName = args.file_name || `agent_scan_${new Date().toISOString().slice(0, 10)}.jpg`;

      // Call existing Drishti analysis pipeline
      const result = await bridge.triggerAnalysis({
        base64: rawBase64,
        mimeType,
        fileName,
        lenses: parsedLenses,
      });

      // Update state and persistence
      bridge.setCurrentResult(result);
      bridge.saveToHistory(result);

      return {
        status: 'success',
        accessibilityScore: result.accessibilityScore,
        scoreLabel: result.scoreLabel,
        summary: result.summary,
        selectedLenses: result.selectedLenses,
        strongAreas: result.strongAreas,
        areasNeedingAttention: result.areasNeedingAttention,
        highestPriorityImprovement: result.highestPriorityImprovement,
        totalFindings: result.findings.length,
        findings: result.findings.map((f) => ({
          id: f.id,
          title: f.title,
          lens: f.lens,
          severity: f.severity,
          whatDetected: f.whatDetected,
          whyItMatters: f.whyItMatters,
          suggestedImprovement: f.suggestedImprovement,
          confidence: f.confidence,
          location: {
            xPercent: f.location.xPercent,
            yPercent: f.location.yPercent,
            label: f.location.label,
          },
          evidenceAssessment: f.evidenceAssessment,
        })),
        disclaimer: result.disclaimer,
      };
    },
  };
}
