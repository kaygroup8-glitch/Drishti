export type LensId = 'all' | 'mobility' | 'vision' | 'hearing' | 'cognitive' | 'elderly' | 'child';

export interface LensInfo {
  id: LensId;
  name: string;
  shortLabel: string;
  iconName: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export type SeverityLevel = 'High' | 'Medium' | 'Low';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface LocationMarker {
  xPercent: number; // 0 - 100% from left
  yPercent: number; // 0 - 100% from top
  label: string;
}

export interface Finding {
  id: number;
  title: string;
  lens: 'Mobility' | 'Low Vision' | 'Hearing' | 'Cognitive' | 'Elderly-Friendly' | 'Child-Friendly' | string;
  severity: SeverityLevel;
  whatDetected: string; // What Drishti sees
  whyItMatters: string; // Why it may matter
  suggestedImprovement: string; // How to improve it
  confidence: ConfidenceLevel;
  location: LocationMarker;
  evidenceAssessment?: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  imageName: string;
  imageUrl: string; // Base64 data URL or sample image URL
  selectedLenses: string[];
  accessibilityScore: number; // 0 to 100
  scoreLabel: string; // e.g. "Needs Significant Improvement", "Moderate Accessibility", "High Accessibility"
  strongAreas: string[];
  areasNeedingAttention: string[];
  highestPriorityImprovement: string;
  summary: string;
  findings: Finding[];
  isDemo?: boolean;
  disclaimer: string;
}

export interface SampleScenario {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  result: AnalysisResult;
}
