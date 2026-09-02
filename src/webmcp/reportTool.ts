import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
  GenerateReportOutput,
} from './types';

export function createReportTool(bridge: WebMCPAppBridge): WebMCPToolDefinition<Record<string, never>, GenerateReportOutput> {
  const schema = {
    type: 'object',
    description: 'Generate and trigger download of the official vector PDF Accessibility Audit Report for the current space.',
    properties: {},
  };

  return {
    name: 'generate_accessibility_report',
    description: 'Generates and downloads a comprehensive, print-ready PDF Accessibility Audit Report for the active space, including visual scorecards, barrier summaries, lens-specific observations, and remediation roadmaps.',
    parameters: schema,
    inputSchema: schema,
    execute: async (): Promise<GenerateReportOutput> => {
      const current = bridge.getCurrentResult();

      if (!current) {
        return {
          status: 'failed',
          message: 'No accessibility audit has been run yet. Please analyze a space first.',
        };
      }

      try {
        await bridge.triggerExportPDF(current);

        const cleanName = (current.imageName || 'drishti_audit')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_');
        const reportFileName = `drishti_accessibility_audit_${cleanName}.pdf`;

        return {
          status: 'generated',
          reportFileName,
          generatedAt: new Date().toISOString(),
          scoreSummary: {
            score: current.accessibilityScore,
            scoreLabel: current.scoreLabel,
            totalFindings: current.findings.length,
          },
          message: `Official Drishti Accessibility Audit PDF report "${reportFileName}" has been generated and initiated for download in the client browser.`,
        };
      } catch (err: any) {
        return {
          status: 'failed',
          message: `Failed to generate PDF report: ${err?.message || 'Unknown error occurred.'}`,
        };
      }
    },
  };
}
