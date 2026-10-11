// app/api/admin/session/route.js
import { NextResponse } from 'next/server';
import { estAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: estAdmin() });
}
