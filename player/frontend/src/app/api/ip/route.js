// app/api/ip/route.ts
import { NextRequest } from 'next/server';

export async function GET(req) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = forwardedFor?.split(',')[0]?.trim(); // first IP in the list
  const fallbackIp = req.ip || '127.0.0.1';

  const ip = realIp || fallbackIp || 'IP not found';

  return new Response(JSON.stringify({ ip }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
