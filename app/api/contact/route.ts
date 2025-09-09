import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { firstName, lastName, email, subject, message } = await req.json();
  console.log('Contact form submission', { firstName, lastName, email, subject, messageLength: message?.length });
  return NextResponse.json({ success: true });
}
