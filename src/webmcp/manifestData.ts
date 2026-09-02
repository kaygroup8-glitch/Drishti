export const WEBMCP_MANIFEST = {
  protocol: 'webmcp',
  version: '1.0-draft',
  name: 'Drishti Universal AI Accessibility Lens',
  description: 'W3C Web Model Context Protocol (WebMCP) agent interface for physical and spatial accessibility inspection powered by Google Gemini multimodal vision.',
  entrypoint: 'navigator.modelContext',
  hackathon: 'WebMCP Challenge (https://webmcp.devpost.com/)',
  license: 'MIT',
  tools: [
    {
      name: 'analyze_space',
      description: 'Analyzes a physical space photo (stairs, ramps, doors, corridors, signs) for accessibility barriers across 6 universal design lenses using Gemini multimodal vision. Returns an accessibility score (0-100), detailed barrier findings, coordinate markers, and actionable remediation guidance.',
      parameters: {
        type: 'object',
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
            description: 'Optional accessibility lenses to focus on. Supported: mobility, low_vision, hearing, cognitive, elderly, stroller, or all.',
          },
          file_name: {
            type: 'string',
            description: 'Optional descriptive name for the photo (e.g., entrance_stairs.jpg).',
          },
        },
        required: ['image_data'],
      },
    },
    {
      name: 'get_accessibility_summary',
      description: 'Retrieves an instant executive summary of the active space audit, including overall accessibility score (0-100), grade label, counts of high/medium/low severity barriers, and strongest areas.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_barrier_details',
      description: 'Retrieves comprehensive deep-dive details for a specific barrier ID identified in the current audit, including observation specifics, impact reasoning, confidence rating, coordinate location (xPercent, yPercent), and recommended physical modification. Also synchronizes and highlights the barrier on the human screen.',
      parameters: {
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
      description: 'Highlights and focuses an accessibility barrier pin directly on the live image canvas in the human user interface, demonstrating real-time human-agent visual co-presence.',
      parameters: {
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
      description: 'Retrieves a prioritized remediation roadmap for property managers and building owners, ranking physical interventions by severity, difficulty, and impact on disabled visitors.',
      parameters: {
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
      description: 'Triggers client-side generation and download of an official vector PDF accessibility audit report, complete with scores, findings breakdown, coordinate pins, and remediation checklists.',
      parameters: {
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
  ],
};
