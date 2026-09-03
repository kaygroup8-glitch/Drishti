import type { VercelRequest, VercelResponse } from '@vercel/node';
import { activeAuditState, updateActiveAuditState } from '../src/mcp/openaiMcpServer';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    if (req.body && typeof req.body === 'object') {
      updateActiveAuditState(req.body);
    }
    return res.status(200).json({ status: 'ok', activeAuditState });
  }

  return res.status(200).json(activeAuditState);
}
