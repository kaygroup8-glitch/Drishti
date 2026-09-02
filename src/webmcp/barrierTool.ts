import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
  GetBarrierDetailsArgs,
  BarrierDetailsOutput,
} from './types';

export function createBarrierTool(bridge: WebMCPAppBridge): WebMCPToolDefinition<GetBarrierDetailsArgs, BarrierDetailsOutput> {
  const schema = {
    type: 'object',
    description: 'Inspect detailed observation data, visual coordinates, impact reasoning, and remediation instructions for a specific detected accessibility barrier.',
    properties: {
      barrier_id: {
        type: 'number',
        description: 'The numeric ID of the finding/barrier to inspect (e.g. 1, 2, 3).',
      },
    },
    required: ['barrier_id'],
  };

  return {
    name: 'get_barrier_details',
    description: 'Retrieves comprehensive deep-dive details for a specific accessibility barrier identified in the current audit, including what was detected, why it matters, confidence level, image pin coordinates, and recommended improvement.',
    parameters: schema,
    inputSchema: schema,
    execute: async (args: GetBarrierDetailsArgs): Promise<BarrierDetailsOutput> => {
      const current = bridge.getCurrentResult();

      if (!current) {
        return {
          status: 'no_active_scan',
          message: 'No accessibility audit has been run yet. Please analyze a space first.',
        };
      }

      if (!args || (args.barrier_id === undefined && (args as any).id === undefined)) {
        throw new Error('Validation Error: "barrier_id" parameter is required (e.g., {"barrier_id": 1}).');
      }

      const targetId = Number(args.barrier_id !== undefined ? args.barrier_id : (args as any).id);

      if (isNaN(targetId)) {
        throw new Error(`Invalid barrier ID: "${args.barrier_id}". Expected a numeric ID.`);
      }

      const finding = current.findings.find((f) => f.id === targetId);

      if (!finding) {
        const availableIds = current.findings.map((f) => f.id);
        return {
          status: 'not_found',
          availableBarrierIds: availableIds,
          message: `Barrier with ID ${targetId} not found in the current audit. Available IDs are: [${availableIds.join(', ')}].`,
        };
      }

      // Synchronize selection with human interface so the barrier pin is focused live on screen
      if (bridge.setSelectedBarrierId) {
        bridge.setSelectedBarrierId(finding.id);
      }

      return {
        status: 'found',
        barrier: {
          id: finding.id,
          title: finding.title,
          lens: finding.lens,
          severity: finding.severity,
          whatDetected: finding.whatDetected,
          whyItMatters: finding.whyItMatters,
          suggestedImprovement: finding.suggestedImprovement,
          confidence: finding.confidence,
          location: {
            xPercent: finding.location.xPercent,
            yPercent: finding.location.yPercent,
            label: finding.location.label,
          },
          evidenceAssessment: finding.evidenceAssessment,
        },
      };
    },
  };
}
