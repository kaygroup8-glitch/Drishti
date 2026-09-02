import { AnalysisResult, Finding } from '../types';

/**
 * WebMCP Tool JSON Schema definition
 */
export interface WebMCPJSONSchema {
  type: string;
  description?: string;
  properties?: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    items?: {
      type: string;
      enum?: string[];
    };
  }>;
  required?: string[];
}

/**
 * WebMCP Tool Registration Interface as per W3C Web Model Context Protocol
 */
export interface WebMCPToolDefinition<TArgs = any, TResult = any> {
  name: string;
  description: string;
  parameters: WebMCPJSONSchema;
  inputSchema?: WebMCPJSONSchema; // Alias for backward/forward compatibility
  execute: (args: TArgs) => Promise<TResult> | TResult;
}

/**
 * Model Context interface on document / window / navigator
 */
export interface ModelContext {
  registerTool: (tool: WebMCPToolDefinition) => void;
  unregisterTool?: (toolName: string) => void;
  getRegisteredTools?: () => WebMCPToolDefinition[];
  executeTool?: (name: string, args: any) => Promise<any>;
}

// Augment DOM interfaces so TypeScript compiles cleanly with document.modelContext
declare global {
  interface Document {
    modelContext?: ModelContext;
  }
  interface Window {
    modelContext?: ModelContext;
    drishtiWebMCP?: {
      tools: Map<string, WebMCPToolDefinition>;
      executeTool: (name: string, args: any) => Promise<any>;
      getTools: () => WebMCPToolDefinition[];
      status: 'active' | 'ready';
      registeredAt: string;
    };
  }
}

/**
 * Application Bridge connecting WebMCP tools with React state & API services
 */
export interface WebMCPAppBridge {
  getCurrentResult: () => AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult) => void;
  triggerAnalysis: (imageData: {
    base64: string;
    mimeType: string;
    fileName: string;
    lenses: string[];
  }) => Promise<AnalysisResult>;
  triggerExportPDF: (result: AnalysisResult) => Promise<void>;
  saveToHistory: (result: AnalysisResult) => void;
}

/**
 * Tool 1: analyze_space Inputs & Outputs
 */
export interface AnalyzeSpaceArgs {
  image_data: string; // Base64 or Data URL
  lenses?: string[] | string; // Supported: mobility, low_vision, hearing, cognitive, elderly, stroller / child, all
  file_name?: string;
}

export interface AnalyzeSpaceOutput {
  status: 'success' | 'error';
  accessibilityScore: number;
  scoreLabel: string;
  summary: string;
  selectedLenses: string[];
  strongAreas: string[];
  areasNeedingAttention: string[];
  highestPriorityImprovement: string;
  totalFindings: number;
  findings: Array<{
    id: number;
    title: string;
    lens: string;
    severity: string;
    whatDetected: string;
    whyItMatters: string;
    suggestedImprovement: string;
    confidence: string;
    location: {
      xPercent: number;
      yPercent: number;
      label: string;
    };
    evidenceAssessment?: string;
  }>;
  disclaimer: string;
}

/**
 * Tool 2: get_accessibility_summary Output
 */
export interface AccessibilitySummaryOutput {
  hasActiveAnalysis: boolean;
  imageName?: string;
  accessibilityScore?: number;
  overallScore?: number;
  scoreLabel?: string;
  totalFindingsCount?: number;
  highPriorityCount?: number;
  mediumPriorityCount?: number;
  lowPriorityCount?: number;
  highPriorityFindings?: Array<{
    id: number;
    title: string;
    lens: string;
    locationLabel: string;
  }>;
  findings?: Array<{
    id: number;
    title: string;
    lens: string;
    severity: string;
    whatDetected: string;
    whyItMatters: string;
    suggestedImprovement: string;
    confidence: string;
    location: {
      xPercent: number;
      yPercent: number;
      label: string;
    };
  }>;
  selectedLenses?: string[];
  strongAreas?: string[];
  areasNeedingAttention?: string[];
  topRecommendedImprovement?: string;
  highestPriorityImprovement?: string;
  summary?: string;
  message?: string;
}

/**
 * Tool 3: get_barrier_details Input & Output
 */
export interface GetBarrierDetailsArgs {
  barrier_id: number | string;
}

export interface BarrierDetailsOutput {
  status: 'found' | 'not_found' | 'no_active_scan';
  barrier?: {
    id: number;
    title: string;
    lens: string;
    severity: string;
    whatDetected: string;
    whyItMatters: string;
    suggestedImprovement: string;
    confidence: string;
    location: {
      xPercent: number;
      yPercent: number;
      label: string;
    };
    evidenceAssessment?: string;
  };
  availableBarrierIds?: number[];
  message?: string;
}

/**
 * Tool 4: get_recommendations Output
 */
export interface RecommendationsOutput {
  hasActiveAnalysis: boolean;
  accessibilityScore?: number;
  overallScore?: number;
  scoreLabel?: string;
  highestPriorityAction?: string;
  highestPriorityImprovement?: string;
  totalRecommendations?: number;
  recommendations?: Array<{
    id: number;
    barrierId: number;
    title: string;
    lens: string;
    severity: string;
    recommendation: string;
    recommendedFix: string;
    suggestedImprovement: string;
    whyItMatters: string;
    locationLabel: string;
    confidence: string;
  }>;
  prioritizedRecommendations?: Array<{
    priorityRank: number;
    barrierId: number;
    title: string;
    lens: string;
    severity: string;
    recommendedFix: string;
    suggestedImprovement: string;
    whyItMatters: string;
    locationLabel: string;
    confidence: string;
  }>;
  message?: string;
}

/**
 * Tool 5: generate_accessibility_report Output
 */
export interface GenerateReportOutput {
  status: 'generated' | 'failed';
  reportFileName?: string;
  generatedAt?: string;
  scoreSummary?: {
    score: number;
    scoreLabel: string;
    totalFindings: number;
  };
  message: string;
}
