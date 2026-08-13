import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import { z } from 'zod';

// Marketing content lives beside the quiz sets under content/, but the
// import graphs never touch: the builder reads these files at build time
// and the app only imports the generated output via the
// `content-collections` alias, so the (quiz) bundle contract in CLAUDE.md
// is unaffected. Bodies compile to HTML strings (not MDX components) on
// purpose — the same HTML feeds the pages *and* the RSS feeds, and a
// full-content feed is the acquisition/AEO lever here. (Malik, 2026-08-13)

const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    // One-line subtitle: shown on cards, used as the meta description.
    dek: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    author: z.string().default('Malik Piara'),
    category: z.enum(['announcements', 'product', 'essays']),
    draft: z.boolean().default(false),
    // Site-relative path to the post's cover image (card + hero art).
    // Posts without one get generated pattern art instead.
    cover: z.string().optional(),
    // The raw markdown body (explicit per content-collections >= 0.15).
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const html = await compileMarkdown(ctx, doc);
    const slug = doc._meta.path;
    return { ...doc, html, slug, url: `/blog/${slug}` };
  },
});

const releaseNotes = defineCollection({
  name: 'releaseNotes',
  directory: 'content/releases',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    // User-meaningful categories only (decided 2026-08-14): the kind of
    // change plus the platforms it lands on — never internal subsystem
    // names like 'scoring'.
    kind: z.enum(['new-feature', 'improvement', 'fix']),
    platforms: z.array(z.enum(['web', 'mobile'])).default([]),
    // The raw markdown body (explicit per content-collections >= 0.15).
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const html = await compileMarkdown(ctx, doc);
    // Stable fragment id so /release-notes#<anchor> survives reordering.
    const anchor = doc._meta.path;
    return { ...doc, html, anchor };
  },
});

export default defineConfig({
  content: [posts, releaseNotes],
});
