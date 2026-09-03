import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleMcpJsonRpc,
  getOpenAiToolsFormat,
  getMcpClientConfiguration,
  activeAuditState,
} from '../src/mcp/openaiMcpServer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id, baggage, traceparent');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const host = req.headers.host || 'localhost';
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const serverOrigin = `${protocol}://${host}`;

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      protocol: 'mcp',
      specification: 'https://developers.openai.com/api/docs/mcp',
      name: 'Drishti Universal AI Accessibility Lens',
      version: '1.0.0',
      transports: {
        httpPost: `${serverOrigin}/api/mcp`,
        sse: `${serverOrigin}/api/mcp/sse`,
      },
      toolsCount: 6,
      endpoints: {
        openaiTools: `${serverOrigin}/api/openai-tools`,
        clientConfig: `${serverOrigin}/api/mcp-config.json`,
        activeState: `${serverOrigin}/api/active-state`,
      },
    });
  }

  if (req.method === 'POST') {
    try {
      const response = await handleMcpJsonRpc(req.body);
      return res.status(200).json(response);
    } catch (err: any) {
      return res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: err?.message || 'Internal MCP handler error' },
        id: req.body?.id ?? null,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
