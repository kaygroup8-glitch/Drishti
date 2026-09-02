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
import { createFocusBarrierTool } from './focusBarrierTool';

export * from './types';
export { createAnalyzeSpaceTool } from './analyzeSpaceTool';
export { createSummaryTool } from './summaryTool';
export { createBarrierTool } from './barrierTool';
export { createRecommendationsTool } from './recommendationsTool';
export { createReportTool } from './reportTool';
export { createFocusBarrierTool } from './focusBarrierTool';

/**
 * Global tool registry map for active session
 */
const registeredToolsMap = new Map<string, WebMCPToolDefinition>();

/**
 * Feature detection for native or polyfilled WebMCP (W3C standard: navigator.modelContext)
 */
export function isNativeWebMCPSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (typeof navigator !== 'undefined' && 'modelContext' in navigator && typeof (navigator as any).modelContext?.registerTool === 'function') ||
    (typeof window !== 'undefined' && 'modelContext' in window && typeof (window as any).modelContext?.registerTool === 'function') ||
    (typeof document !== 'undefined' && 'modelContext' in document && typeof (document as any).modelContext?.registerTool === 'function')
  );
}

/**
 * Initializes and registers all Drishti accessibility tools with navigator.modelContext,
 * window.modelContext, and document.modelContext for 100% compliance across Chrome WebModelContext flag,
 * ChatGPT in-app browser, and standard DevTools.
 */
export function initializeWebMCP(bridge: WebMCPAppBridge): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Instantiate the 6 specialized accessibility tools
  const tools: WebMCPToolDefinition[] = [
    createAnalyzeSpaceTool(bridge),
    createSummaryTool(bridge),
    createBarrierTool(bridge),
    createRecommendationsTool(bridge),
    createReportTool(bridge),
    createFocusBarrierTool(bridge),
  ];

  // Populate memory registry
  registeredToolsMap.clear();
  tools.forEach((tool) => {
    registeredToolsMap.set(tool.name, tool);
  });

  // Standard ModelContext implementation
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

  // Mount/augment across all target scopes (navigator, window, document)
  const targets: Array<{ obj: any; name: string }> = [];
  if (typeof navigator !== 'undefined') targets.push({ obj: navigator, name: 'navigator' });
  if (typeof window !== 'undefined') targets.push({ obj: window, name: 'window' });
  if (typeof document !== 'undefined') targets.push({ obj: document, name: 'document' });

  targets.forEach(({ obj, name }) => {
    try {
      if (!obj.modelContext) {
        Object.defineProperty(obj, 'modelContext', {
          value: modelContextImpl,
          writable: true,
          configurable: true,
        });
      }
    } catch {
      try {
        obj.modelContext = modelContextImpl;
      } catch (e) {
        console.warn(`[WebMCP] Could not attach modelContext to ${name}:`, e);
      }
    }
  });

  // Register each tool into all available modelContext instances
  tools.forEach((tool) => {
    targets.forEach(({ obj, name }) => {
      try {
        if (obj.modelContext && typeof obj.modelContext.registerTool === 'function') {
          obj.modelContext.registerTool(tool);
        }
      } catch (err) {
        console.warn(`[WebMCP] Tool "${tool.name}" failed on ${name}.modelContext:`, err);
      }
    });
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

  console.log(`[WebMCP] Drishti Agent Layer active on navigator.modelContext. ${tools.length} tools registered: [${tools.map((t) => t.name).join(', ')}]`);

  // Return cleanup unregister function
  return () => {
    tools.forEach((tool) => {
      registeredToolsMap.delete(tool.name);
      targets.forEach(({ obj }) => {
        try {
          if (obj.modelContext?.unregisterTool) {
            obj.modelContext.unregisterTool(tool.name);
          }
        } catch {
          // Ignore cleanup errors
        }
      });
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
