import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// First API route in the repo. Subscriptions land in the existing
// Supabase `email_subscriptions` table (the one the never-shipped
// emailForm.tsx targeted) so addresses are captured from day one; a
// dedicated newsletter provider can drain that table later without a
// frontend change. (Malik, 2026-08-13)

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Subscriptions are not configured.' },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase
    .from('email_subscriptions')
    .insert({ email: parsed.data.email });

  // 23505 = unique violation: already subscribed, which is a success
  // from the subscriber's point of view (and avoids address probing).
  if (error && error.code !== '23505') {
    return NextResponse.json(
      { error: 'Could not subscribe right now.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
