import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
} from './types';

export interface FocusBarrierArgs {
  barrier_id: number;
}

export interface FocusBarrierOutput {
  status: 'focused' | 'not_found' | 'no_active_scan';
  barrierId?: number;
  title?: string;
  location?: {
    xPercent: number;
    yPercent: number;
    label: string;
  };
  message: string;
}

export function createFocusBarrierTool(bridge: WebMCPAppBridge): WebMCPToolDefinition<FocusBarrierArgs, FocusBarrierOutput> {
  const schema = {
    type: 'object',
    description: 'Directly focus and highlight a detected accessibility barrier pin on the live visual image canvas in the user interface.',
    properties: {
      barrier_id: {
        type: 'number',
        description: 'The numeric ID of the finding/barrier to highlight on the human screen (e.g. 1, 2, 3).',
      },
    },
    required: ['barrier_id'],
  };

  return {
    name: 'focus_barrier',
    description: 'Highlights and focuses an accessibility barrier pin directly on the live image canvas in the human user interface, demonstrating real-time human-agent visual co-presence.',
    parameters: schema,
    inputSchema: schema,
    execute: async (args: FocusBarrierArgs): Promise<FocusBarrierOutput> => {
      const current = bridge.getCurrentResult();

      if (!current) {
        return {
          status: 'no_active_scan',
          message: 'No active space audit is currently loaded. Please run analyze_space first.',
        };
      }

      const targetId = Number(args?.barrier_id !== undefined ? args.barrier_id : (args as any)?.id);
      if (isNaN(targetId)) {
        throw new Error(`Invalid barrier ID: "${args?.barrier_id}". Expected a numeric ID.`);
      }

      const finding = current.findings.find((f) => f.id === targetId);
      if (!finding) {
        const available = current.findings.map((f) => f.id);
        return {
          status: 'not_found',
          message: `Barrier #${targetId} not found in active audit. Available barrier IDs: [${available.join(', ')}].`,
        };
      }

      if (bridge.setSelectedBarrierId) {
        bridge.setSelectedBarrierId(finding.id);
      }

      return {
        status: 'focused',
        barrierId: finding.id,
        title: finding.title,
        location: {
          xPercent: finding.location.xPercent,
          yPercent: finding.location.yPercent,
          label: finding.location.label,
        },
        message: `Barrier #${finding.id} ("${finding.title}") is now highlighted on the human image canvas.`,
      };
    },
  };
}
