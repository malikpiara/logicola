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

export async function capturePageview() {
  const posthog = await getPostHogClient();

  posthog?.capture('$pageview', {
    $current_url: window.location.href,
  });
}

export async function captureAnalyticsEvent(
  eventName: string,
  properties?: AnalyticsProperties
) {
  const posthog = await getPostHogClient();

  posthog?.capture(eventName, properties);
}
