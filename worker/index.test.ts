// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './index';

const assets = {
  fetch: vi.fn(async () => new Response('404 page', { status: 404 })),
};

function env(overrides: Record<string, string> = {}) {
  return { ASSETS: assets, LOOPS_API_KEY: 'test-key', ...overrides };
}

function post(body: unknown, path = '/api/newsletter') {
  return new Request(`https://logicola.org${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function stubLoops(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => Response.json(body, { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  assets.fetch.mockClear();
});

describe('POST /api/newsletter', () => {
  it('subscribes through Loops and answers { ok: true }', async () => {
    const loops = stubLoops(200, { success: true });

    const response = await worker.fetch(
      post({ email: 'student@example.edu', source: 'footer' }),
      env({ LOOPS_MAILING_LIST_ID: 'list-1' })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    const [url, init] = loops.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://app.loops.so/api/v1/contacts/update');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'student@example.edu',
      subscribed: true,
      source: 'footer',
      mailingLists: { 'list-1': true },
    });
  });

  it('rejects a body that is not JSON with 400', async () => {
    const response = await worker.fetch(post('not json'), env());
    expect(response.status).toBe(400);
  });

  it('rejects an invalid email with 400', async () => {
    const response = await worker.fetch(post({ email: 'nope' }), env());
    expect(response.status).toBe(400);
  });

  it('answers 503 when the Loops key is not configured', async () => {
    const response = await worker.fetch(
      post({ email: 'student@example.edu' }),
      { ASSETS: assets }
    );
    expect(response.status).toBe(503);
  });

  it('treats a 200 with { success: false } from Loops as a failure', async () => {
    stubLoops(200, { success: false, message: 'Invalid mailing list' });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await worker.fetch(
      post({ email: 'student@example.edu' }),
      env()
    );

    expect(response.status).toBe(500);
  });

  it('answers 405 to anything but POST', async () => {
    const response = await worker.fetch(
      new Request('https://logicola.org/api/newsletter'),
      env()
    );
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });
});

describe('other /api/* paths', () => {
  it('fall through to the static 404 page', async () => {
    const response = await worker.fetch(post({}, '/api/other'), env());
    expect(assets.fetch).toHaveBeenCalledOnce();
    expect(response.status).toBe(404);
  });
});
