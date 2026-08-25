let postHogClientPromise: Promise<
  (typeof import('posthog-js'))['default'] | null
> | null = null;

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

async function getPostHogClient() {
  if (typeof window === 'undefined') {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) {
    return null;
  }

  if (!postHogClientPromise) {
    postHogClientPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(apiKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        autocapture: true,
        capture_pageview: false,
      });

      return posthog;
    });
  }

  return postHogClientPromise;
}

export async function capturePageview(url?: string) {
  const posthog = await getPostHogClient();

  // `url` lets a DEFERRED capture pin the page it was scheduled on:
  // flushed during a route change, window.location already names the
  // next page (2026-08-24).
  posthog?.capture('$pageview', {
    $current_url: url ?? window.location.href,
  });
}

export async function captureAnalyticsEvent(
  eventName: string,
  properties?: AnalyticsProperties
) {
  const posthog = await getPostHogClient();

  posthog?.capture(eventName, properties);
}

// Super-properties: attached to EVERY subsequent event, not one of
// them. The offline work registers storage_persisted / offline_ready
// here so any later event can be sliced by whether that visitor
// actually had a warm cache (Malik, 2026-08-15).
export async function registerAnalyticsProperties(
  properties: AnalyticsProperties
) {
  const posthog = await getPostHogClient();

  posthog?.register(properties);
}
