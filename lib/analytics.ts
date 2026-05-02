let postHogClientPromise: Promise<
  typeof import('posthog-js')['default'] | null
> | null = null;

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
      });

      return posthog;
    });
  }

  return postHogClientPromise;
}

export async function captureAnalyticsEvent(
  eventName: string,
  properties?: Record<string, string | number>
) {
  const posthog = await getPostHogClient();

  posthog?.capture(eventName, properties);
}
