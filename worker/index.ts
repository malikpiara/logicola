import { z } from 'zod';

/**
 * The site's only server code (Cloudflare migration, 2026-09-24).
 *
 * Everything else on logicola.org is the static export in out/, served
 * straight from Workers static assets without ever invoking this script
 * (wrangler.jsonc: `run_worker_first` is `["/api/*"]`, and asset
 * requests are free and unmetered). The newsletter endpoint moved here
 * from app/api/newsletter/route.ts, because a static export cannot
 * contain a route that answers POST.
 *
 * The status codes are the old route's, unchanged: the newsletter form
 * reads `response.ok`, and its failure event reports `status_code`.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  LOOPS_API_KEY?: string;
  LOOPS_MAILING_LIST_ID?: string;
}

// Loops.so is the newsletter backend (decided 2026-08-24, replacing the
// 2026-08-13 Supabase stopgap outright — the Supabase project had
// auto-paused, so that path was already dead). contacts/update is an
// upsert: resubscribing is idempotent and never leaks whether an
// address was already on the list. (Malik, 2026-08-24)

const bodySchema = z.object({
  email: z.email().max(320),
  source: z.string().max(80).optional(),
});

async function subscribe(request: Request, env: Env): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  const apiKey = env.LOOPS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Subscriptions are not configured.' },
      { status: 503 }
    );
  }

  const { email, source } = parsed.data;
  const mailingListId = env.LOOPS_MAILING_LIST_ID;

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

    // Always read the body: Loops can answer 200 with
    // { success: false, message } (e.g. a stale LOOPS_MAILING_LIST_ID),
    // which response.ok alone would wave through — the form would show
    // success while every signup silently dropped. Reading it also
    // releases the connection.
    const body: unknown = await response.json().catch(() => null);
    const succeeded =
      response.ok && (body as { success?: boolean } | null)?.success !== false;
    if (!succeeded) {
      throw new Error(
        `Loops ${response.status}: ${JSON.stringify(body).slice(0, 300)}`
      );
    }
  } catch (error) {
    // The one place newsletter failures become visible server-side
    // (Workers Logs; wrangler.jsonc turns observability on).
    console.error('newsletter subscribe failed:', error);
    return Response.json(
      { error: 'Could not subscribe right now.' },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/newsletter') {
      if (request.method !== 'POST') {
        return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      }
      return subscribe(request, env);
    }

    // Any other /api/* path: hand back to the assets, which answer with
    // the export's 404 page.
    return env.ASSETS.fetch(request);
  },
};

export default worker;
