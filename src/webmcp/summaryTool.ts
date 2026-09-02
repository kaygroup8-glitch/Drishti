import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
  AccessibilitySummaryOutput,
} from './types';

export function createSummaryTool(bridge: WebMCPAppBridge): WebMCPToolDefinition<Record<string, never>, AccessibilitySummaryOutput> {
  const schema = {
    type: 'object',
    description: 'Retrieve high-level accessibility scorecard and priority summary of the current space without re-running visual analysis.',
    properties: {},
  };

  return {
    name: 'get_accessibility_summary',
    description: 'Retrieves the accessibility summary, overall score (0-100), key strengths, areas needing attention, and top priority improvements from the active scan.',
    parameters: schema,
    inputSchema: schema,
    execute: async (): Promise<AccessibilitySummaryOutput> => {
      const current = bridge.getCurrentResult();

      if (!current) {
        return {
          hasActiveAnalysis: false,
          message: 'No active space analysis found in Drishti. Use the "analyze_space" tool to analyze a photo or select a scenario first.',
        };
      }

      const highPriority = current.findings.filter((f) => f.severity === 'High');
      const medPriority = current.findings.filter((f) => f.severity === 'Medium');
      const lowPriority = current.findings.filter((f) => f.severity === 'Low');

      return {
        hasActiveAnalysis: true,
        imageName: current.imageName,
        overallScore: current.accessibilityScore,
        scoreLabel: current.scoreLabel,
        totalFindingsCount: current.findings.length,
        highPriorityCount: highPriority.length,
        mediumPriorityCount: medPriority.length,
        lowPriorityCount: lowPriority.length,
        highPriorityFindings: highPriority.map((f) => ({
          id: f.id,
          title: f.title,
          lens: f.lens,
          locationLabel: f.location.label || `Marker #${f.id}`,
        })),
        strongAreas: current.strongAreas,
        areasNeedingAttention: current.areasNeedingAttention,
        topRecommendedImprovement: current.highestPriorityImprovement,
        summary: current.summary,
      };
    },
  };
}
