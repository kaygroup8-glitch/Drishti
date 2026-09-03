import type { VercelRequest, VercelResponse } from '@vercel/node';
import { WEBMCP_MANIFEST } from '../src/webmcp/manifestData';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  res.status(200).json(WEBMCP_MANIFEST);
}
