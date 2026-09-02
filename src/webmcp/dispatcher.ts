/**
 * Client-Side Deterministic Prompt Dispatcher for Drishti WebMCP Agent
 * Provides immediate, zero-latency tool routing and arguments parsing.
 */

export interface DispatchResult {
  toolName: string;
  toolArgs: Record<string, any>;
  intent: string;
}

export function dispatchPromptLocally(
  prompt: string,
  context: {
    hasActiveScan: boolean;
    availableBarrierIds: number[];
  }
): DispatchResult {
  const lower = prompt.toLowerCase();

  // 1. Report / PDF Generation
  if (
    lower.includes('report') ||
    lower.includes('pdf') ||
    lower.includes('export') ||
    lower.includes('document') ||
    lower.includes('download')
  ) {
    return {
      toolName: 'generate_accessibility_report',
      toolArgs: { format: 'pdf', includeEvidenceAssessment: true },
      intent: 'Generate downloadable PDF accessibility audit report',
    };
  }

  // 2. Specific Barrier Deep Dive (e.g. "barrier 2", "barrier #1", "issue 3", "finding 2")
  const barrierNumberMatch =
    lower.match(/(?:barrier|issue|finding|item|number|observation|#)\s*([0-9]+)/i) ||
    lower.match(/\b([1-9])\b/);

  const isBarrierSpecific =
    (lower.includes('barrier') ||
      lower.includes('issue') ||
      lower.includes('finding') ||
      lower.includes('obstacle') ||
      lower.includes('explain') ||
      lower.includes('how to fix') ||
      lower.includes('observation')) &&
    barrierNumberMatch !== null &&
    !lower.includes('most serious') &&
    !lower.includes('top issues') &&
    !lower.includes('all barriers') &&
    !lower.includes('serious accessibility');

  if (isBarrierSpecific && barrierNumberMatch) {
    const parsedId = parseInt(barrierNumberMatch[1], 10);
    const barrierId = context.availableBarrierIds.includes(parsedId)
      ? parsedId
      : (context.availableBarrierIds[0] || parsedId || 1);

    return {
      toolName: 'get_barrier_details',
      toolArgs: { barrier_id: barrierId },
      intent: `Inspect Barrier #${barrierId} and provide remediation guidance`,
    };
  }

  // 3. Prioritized Recommendations / Most Serious Issues
  if (
    lower.includes('most serious') ||
    lower.includes('top issues') ||
    lower.includes('highest priority') ||
    lower.includes('serious accessibility') ||
    lower.includes('all barriers') ||
    lower.includes('recommend') ||
    lower.includes('priorit') ||
    lower.includes('action') ||
    lower.includes('roadmap') ||
    lower.includes('solution') ||
    lower.includes('remediat')
  ) {
    return {
      toolName: 'get_recommendations',
      toolArgs: { prioritizeBySeverity: true },
      intent: 'Retrieve prioritized accessibility remediation actions',
    };
  }

  // 4. Space Analysis / Scan
  if (
    lower.includes('analyze') ||
    lower.includes('scan') ||
    lower.includes('evaluate') ||
    lower.includes('audit') ||
    lower.includes('check this space')
  ) {
    const detectedLenses: string[] = [];
    if (lower.includes('wheelchair') || lower.includes('mobility') || lower.includes('ramp') || lower.includes('step')) {
      detectedLenses.push('mobility');
    }
    if (lower.includes('vision') || lower.includes('contrast') || lower.includes('blind') || lower.includes('sight')) {
      detectedLenses.push('low_vision');
    }
    if (lower.includes('hearing') || lower.includes('deaf') || lower.includes('sound')) {
      detectedLenses.push('hearing');
    }
    if (lower.includes('cognitive') || lower.includes('neurodiverse') || lower.includes('wayfinding')) {
      detectedLenses.push('cognitive');
    }
    if (lower.includes('elderly') || lower.includes('senior') || lower.includes('aging')) {
      detectedLenses.push('elderly');
    }
    if (lower.includes('stroller') || lower.includes('child')) {
      detectedLenses.push('stroller');
    }

    return {
      toolName: 'analyze_space',
      toolArgs: {
        lenses: detectedLenses.length > 0 ? detectedLenses : ['all'],
      },
      intent: `Analyze space using ${detectedLenses.length > 0 ? detectedLenses.join(', ') : 'all'} accessibility lenses`,
    };
  }

  // 5. Default Overview / Summary
  return {
    toolName: 'get_accessibility_summary',
    toolArgs: {},
    intent: 'Review overall space accessibility scorecard',
  };
}
