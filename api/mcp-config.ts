import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMcpClientConfiguration } from '../src/mcp/openaiMcpServer';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const host = req.headers.host || 'localhost';
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const serverOrigin = `${protocol}://${host}`;

  res.status(200).json(getMcpClientConfiguration(serverOrigin));
}
