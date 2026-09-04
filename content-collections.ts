import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import smartypants from 'remark-smartypants';
import rehypeSlug from 'rehype-slug';
import { z } from 'zod';
import { imageSize } from 'image-size';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Stamp intrinsic dimensions on local images (2026-08-24, CLS audit
 * #2): markdown compiles to bare <img src alt>, which reserves zero
 * height until the bytes arrive — six ~515px jolts in one post. Build
 * time only; a missing file or foreign URL passes through untouched.
 * `loading=lazy decoding=async` rides along for the below-fold bytes.
 */
function sizeLocalImages(html: string): string {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\bwidth=/.test(tag)) return tag;
    const src = tag.match(/src="([^"]+)"/)?.[1];
    if (!src || !src.startsWith('/')) return tag;
    try {
      const { width, height } = imageSize(
        readFileSync(path.join(process.cwd(), 'public', src))
      );
      if (!width || !height) return tag;
      return tag.replace(
        '<img',
        `<img width="${width}" height="${height}" loading="lazy" decoding="async"`
      );
    } catch {
      return tag;
    }
  });
}

// Marketing content lives beside the quiz sets under content/, but the
// import graphs never touch: the builder reads these files at build time
// and the app only imports the generated output via the
// `content-collections` alias, so the (quiz) bundle contract in the project notes
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
    // allowDangerousHtml (2026-08-24): the quiz-embed markers are raw
    // <div data-quiz-embed> HTML in the markdown, and the default
    // pipeline strips raw HTML. Our own committed content only — no
    // user-generated markdown flows through here.
    // Smart punctuation (2026-08-27): straight quotes, `--` and `...`
    // become curly quotes, dashes and real ellipses at compile time.
    // Inline code is a separate mdast node smartypants never visits, so
    // logic notation in backticks keeps its straight marks.
    const html = sizeLocalImages(
      await compileMarkdown(ctx, doc, {
        allowDangerousHtml: true,
        remarkPlugins: [smartypants],
        // Heading ids (Malik, 2026-09-02): every section is a deep link
        // — the post's section rail writes the hash on jump, and a
        // comment thread can point at one chapter.
        rehypePlugins: [rehypeSlug],
      })
    );
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
    // Same unpublish switch the posts have (2026-08-24, Malik asked to
    // unpublish every note): keeps the writing in the repo instead of
    // deleting it, and `releaseEntries` filters on it.
    draft: z.boolean().default(false),
    // The raw markdown body (explicit per content-collections >= 0.15).
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const html = sizeLocalImages(
      await compileMarkdown(ctx, doc, { remarkPlugins: [smartypants] })
    );
    // Stable fragment id so /release-notes#<anchor> survives reordering.
    const anchor = doc._meta.path;
    return { ...doc, html, anchor };
  },
});

export default defineConfig({
  content: [posts, releaseNotes],
});
