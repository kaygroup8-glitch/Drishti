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
          message: 'No accessibility audit has been run yet. Please analyze a space first.',
        };
      }

      const findings = Array.isArray(current.findings) ? current.findings : [];
      const highPriority = findings.filter((f) => f.severity === 'High');
      const medPriority = findings.filter((f) => f.severity === 'Medium');
      const lowPriority = findings.filter((f) => f.severity === 'Low');

      const score = typeof current.accessibilityScore === 'number' ? current.accessibilityScore : 0;
      const label = current.scoreLabel || 'Accessibility Evaluation';

      return {
        hasActiveAnalysis: true,
        imageName: current.imageName || 'Active Space',
        accessibilityScore: score,
        overallScore: score,
        scoreLabel: label,
        totalFindingsCount: findings.length,
        highPriorityCount: highPriority.length,
        mediumPriorityCount: medPriority.length,
        lowPriorityCount: lowPriority.length,
        highPriorityFindings: highPriority.map((f) => ({
          id: f.id,
          title: f.title,
          lens: f.lens,
          locationLabel: f.location?.label || `Marker #${f.id}`,
        })),
        findings: findings.map((f) => ({
          id: f.id,
          title: f.title,
          lens: f.lens,
          severity: f.severity,
          whatDetected: f.whatDetected,
          whyItMatters: f.whyItMatters,
          suggestedImprovement: f.suggestedImprovement,
          confidence: f.confidence,
          location: {
            xPercent: f.location?.xPercent ?? 50,
            yPercent: f.location?.yPercent ?? 50,
            label: f.location?.label || f.title,
          },
        })),
        selectedLenses: Array.isArray(current.selectedLenses) ? current.selectedLenses : ['all'],
        strongAreas: Array.isArray(current.strongAreas) ? current.strongAreas : [],
        areasNeedingAttention: Array.isArray(current.areasNeedingAttention) ? current.areasNeedingAttention : [],
        topRecommendedImprovement: current.highestPriorityImprovement || '',
        highestPriorityImprovement: current.highestPriorityImprovement || '',
        summary: current.summary || '',
        message: `Accessibility summary for "${current.imageName || 'Active Space'}": Score ${score}/100 (${label}). ${findings.length} findings detected.`,
      };
    },
  };
}
