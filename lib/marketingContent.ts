import { allPosts, allReleaseNotes } from 'content-collections';
export type { Post, ReleaseNote } from 'content-collections';

// Newest first. Dates are ISO strings, so lexicographic order is date
// order; title breaks ties to keep the sort stable across builds.
export const publishedPosts = [...allPosts]
  .filter((post) => !post.draft)
  .sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
  );

export const releaseEntries = [...allReleaseNotes].sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
);

// Render '2026-08-13' as 'Aug 13, 2026'. Anchored to UTC so the date a
// post declares is the date every reader sees, regardless of timezone.
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
