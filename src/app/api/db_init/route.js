import { NextResponse } from 'next/server';

export async function POST() {
  // This endpoint is a placeholder to show DB init flow.
  // Run locally: npx prisma migrate dev --name init
  return NextResponse.json({ ok: true, note: 'Run `npx prisma migrate dev --name init` locally to create schema.' });
}
