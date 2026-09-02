import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
  RecommendationsOutput,
} from './types';

export function createRecommendationsTool(bridge: WebMCPAppBridge): WebMCPToolDefinition<Record<string, never>, RecommendationsOutput> {
  const schema = {
    type: 'object',
    description: 'Retrieve prioritized accessibility remediation recommendations ordered by urgency and severity.',
    properties: {},
  };

  return {
    name: 'get_recommendations',
    description: 'Retrieves an ordered action plan of accessibility fixes for the building owner or designer, ranked by severity (High priority fixes first). Directly answers questions like "What should the building owner fix first?".',
    parameters: schema,
    inputSchema: schema,
    execute: async (): Promise<RecommendationsOutput> => {
      const current = bridge.getCurrentResult();

      if (!current) {
        return {
          hasActiveAnalysis: false,
          message: 'No active space analysis found. Please run "analyze_space" or select a space first.',
        };
      }

      // Sort findings by severity order: High -> Medium -> Low
      const severityWeights: Record<string, number> = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      const sorted = [...current.findings].sort((a, b) => {
        const weightA = severityWeights[a.severity] || 0;
        const weightB = severityWeights[b.severity] || 0;
        return weightB - weightA;
      });

      const prioritized = sorted.map((finding, index) => ({
        priorityRank: index + 1,
        barrierId: finding.id,
        title: finding.title,
        lens: finding.lens,
        severity: finding.severity,
        recommendedFix: finding.suggestedImprovement,
        whyItMatters: finding.whyItMatters,
        locationLabel: finding.location.label || `Zone #${finding.id}`,
        confidence: finding.confidence,
      }));

      return {
        hasActiveAnalysis: true,
        overallScore: current.accessibilityScore,
        highestPriorityAction: current.highestPriorityImprovement,
        totalRecommendations: prioritized.length,
        prioritizedRecommendations: prioritized,
      };
    },
  };
}
