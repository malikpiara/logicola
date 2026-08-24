import { NextResponse } from 'next/server';
import { z } from 'zod';

// Loops.so is the newsletter backend (decided 2026-08-24, replacing the
// 2026-08-13 Supabase stopgap outright — the Supabase project had
// auto-paused, so that path was already dead). contacts/update is an
// upsert: resubscribing is idempotent and never leaks whether an
// address was already on the list. (Malik, 2026-08-24)

const bodySchema = z.object({
  email: z.email().max(320),
  source: z.string().max(80).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Subscriptions are not configured.' },
      { status: 503 }
    );
  }

  const { email, source } = parsed.data;
  const mailingListId = process.env.LOOPS_MAILING_LIST_ID;

  try {
    const response = await fetch(
      'https://app.loops.so/api/v1/contacts/update',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subscribed: true,
          source: source ?? 'logicola',
          ...(mailingListId ? { mailingLists: { [mailingListId]: true } } : {}),
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not subscribe right now.' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not subscribe right now.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
