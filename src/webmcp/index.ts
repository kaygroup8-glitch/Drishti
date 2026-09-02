import {
  WebMCPToolDefinition,
  WebMCPAppBridge,
  ModelContext,
} from './types';
import { createAnalyzeSpaceTool } from './analyzeSpaceTool';
import { createSummaryTool } from './summaryTool';
import { createBarrierTool } from './barrierTool';
import { createRecommendationsTool } from './recommendationsTool';
import { createReportTool } from './reportTool';

export * from './types';
export { createAnalyzeSpaceTool } from './analyzeSpaceTool';
export { createSummaryTool } from './summaryTool';
export { createBarrierTool } from './barrierTool';
export { createRecommendationsTool } from './recommendationsTool';
export { createReportTool } from './reportTool';

/**
 * Global tool registry map for active session
 */
const registeredToolsMap = new Map<string, WebMCPToolDefinition>();

/**
 * Feature detection for native or polyfilled WebMCP
 */
export function isNativeWebMCPSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    (document && 'modelContext' in document && typeof (document as any).modelContext?.registerTool === 'function') ||
    (typeof window !== 'undefined' && 'modelContext' in window && typeof (window as any).modelContext?.registerTool === 'function') ||
    (typeof navigator !== 'undefined' && 'modelContext' in navigator && typeof (navigator as any).modelContext?.registerTool === 'function')
  );
}

/**
 * Initializes and registers all 5 Drishti accessibility tools with document.modelContext
 */
export function initializeWebMCP(bridge: WebMCPAppBridge): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return () => {};
  }

  // Instantiate the 5 specialized accessibility tools
  const tools: WebMCPToolDefinition[] = [
    createAnalyzeSpaceTool(bridge),
    createSummaryTool(bridge),
    createBarrierTool(bridge),
    createRecommendationsTool(bridge),
    createReportTool(bridge),
  ];

  // Populate memory registry
  registeredToolsMap.clear();
  tools.forEach((tool) => {
    registeredToolsMap.set(tool.name, tool);
  });

  // Ensure document.modelContext exists (polyfilled safely if browser does not yet natively support it)
  if (!document.modelContext) {
    const modelContextImpl: ModelContext = {
      registerTool: (toolDef: WebMCPToolDefinition) => {
        if (!toolDef || !toolDef.name) {
          throw new Error('WebMCP Error: tool definition must provide a valid "name".');
        }
        registeredToolsMap.set(toolDef.name, toolDef);
        console.log(`[WebMCP] Tool registered: ${toolDef.name}`);
      },
      unregisterTool: (toolName: string) => {
        registeredToolsMap.delete(toolName);
      },
      getRegisteredTools: () => Array.from(registeredToolsMap.values()),
      executeTool: async (name: string, args: any) => {
        const tool = registeredToolsMap.get(name);
        if (!tool) {
          throw new Error(`WebMCP Tool "${name}" is not registered.`);
        }
        return await tool.execute(args);
      },
    };

    try {
      Object.defineProperty(document, 'modelContext', {
        value: modelContextImpl,
        writable: true,
        configurable: true,
      });
    } catch {
      (document as any).modelContext = modelContextImpl;
    }
  }

  // Register each tool into document.modelContext
  tools.forEach((tool) => {
    try {
      if (document.modelContext && typeof document.modelContext.registerTool === 'function') {
        document.modelContext.registerTool(tool);
      }
    } catch (err) {
      console.warn(`[WebMCP] Failed to register tool "${tool.name}" on document.modelContext:`, err);
    }
  });

  // Also expose window.drishtiWebMCP for DevTools inspection and agent testing
  window.drishtiWebMCP = {
    tools: registeredToolsMap,
    executeTool: async (name: string, args: any) => {
      const tool = registeredToolsMap.get(name);
      if (!tool) {
        throw new Error(`Drishti WebMCP: Tool "${name}" is not registered. Available tools: ${Array.from(registeredToolsMap.keys()).join(', ')}`);
      }
      return await tool.execute(args);
    },
    getTools: () => Array.from(registeredToolsMap.values()),
    status: 'active',
    registeredAt: new Date().toISOString(),
  };

  console.log(`[WebMCP] Drishti Agent Layer active. 5 tools registered: [${tools.map((t) => t.name).join(', ')}]`);

  // Return cleanup unregister function
  return () => {
    tools.forEach((tool) => {
      registeredToolsMap.delete(tool.name);
      try {
        if (document.modelContext?.unregisterTool) {
          document.modelContext.unregisterTool(tool.name);
        }
      } catch {
        // Ignore cleanup errors
      }
    });
  };
}

/**
 * Helper to get currently registered WebMCP tools
 */
export function getRegisteredWebMCPTools(): WebMCPToolDefinition[] {
  return Array.from(registeredToolsMap.values());
}

/**
 * Direct execution helper for UI interactive workbench
 */
export async function executeWebMCPTool(name: string, args: any): Promise<any> {
  const tool = registeredToolsMap.get(name);
  if (!tool) {
    throw new Error(`WebMCP Tool "${name}" not found.`);
  }
  return await tool.execute(args);
}
