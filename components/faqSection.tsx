import type { CSSProperties } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { spriteClip } from '@/lib/pixel';

/**
 * The homepage FAQ, ported from docs/faq-lab.html — the lab's default
 * composition after Malik's two feedback rounds (2026-08-15, FQ-cards
 * in the file): white ground · split rail · open-fill items (the OPEN
 * answer paints a cream figure plate; clip always on, visible only
 * when the fill paints — the nav lab's hover-fill construction) ·
 * display heading with NO eyebrow (FQ11: an eyebrow may not repeat its
 * heading) · numbered · six entries · edited copy.
 *
 * Deliberately NOT ported (Malik, 2026-08-15): the FOR INSTRUCTORS
 * booking section — "needs more thought and structure". It stays
 * lab-only (FQ10) until the next round, and the classroom entry ships
 * without its "book a short call" tail for the same reason.
 */

// Scheme tokens, measured (WCAG ratios against the ground each sits
// on). The display ink deliberately does NOT echo a footer scheme:
// FQ9 (echo) and D11 (scheme) are open, and echoing the unshipped
// Set L over today's provisional cream footer would tie the heading
// to a decision that hasn't been made. When D11 lands, this block is
// the swap. — Malik's lab, 2026-08-15
const FAQ_TYPE = '#02302C'; // 14.37:1 on white · 12.19:1 on the plate
const FAQ_BODY = '#3A5E5A'; // 7.17:1 on white — intro + rail
const FAQ_BODY_PLATE = '#365A54'; // 6.49:1 on the open plate
const FAQ_PLATE = '#EDEDE3'; // the figure ground — a card inverts (cream on white)
const FAQ_HAIRLINE = '#D7DEDD'; // decorative, no contrast floor
const FAQ_INDEX = '#BD00AD'; // 5.57:1 on white; re-derive on any scheme ground

// TODO(Malik): confirm the public contact address before this leaves
// the preview branch — the old copy promised "email me" with no link.
const CONTACT_MAILTO = 'mailto:malik@hey.com';

// The edited copy pass (lab FQ7): fixes the stale age claim, the
// comma splice and Logiskor/LogiSkor, keeps the first-person voice.
// Entries 5–6 are the mission/classroom story (FQ6) — the donate case
// in words, without duplicating the header's Donate gem.
export const faqData = [
  {
    q: 'What is LogiCola?',
    a: 'LogiCola is the practice companion to Harry Gensler’s Introduction to Logic (Routledge). After Gensler — the original creator — passed away, I rebuilt it for the web to keep an important learning resource alive and to honour his legacy.',
  },
  {
    q: 'Do I have to pay anything to use it?',
    a: 'No. LogiCola is open source, and the exercises are free — and will stay free. If it helps you, a contribution keeps the platform running and speeds up new content and exercises.',
  },
  {
    q: 'How is this different from the original software?',
    a: 'It’s a remake of the 2008 program, rebuilt for the browser — it runs on any device with an internet connection, whatever the operating system. Some chapters and exercises from the original are still missing; they’re being added set by set.',
  },
  {
    q: 'Is there also a new version of LogiSkor?',
    a: 'LogiSkor keeps track of student scores from LogiCola. I’m working on a way for teachers to see how their students are doing. Email me if you’d like to try an early version.',
  },
  {
    q: 'How can I support the project?',
    a: 'LogiCola is free, open source, and run by one person. A donation pays for hosting and buys development time — that’s the fastest way to help. Telling a logic teacher or student about it helps nearly as much.',
  },
  {
    q: 'Can I use LogiCola in my classroom?',
    a: 'Yes — that’s exactly what it’s for. The drills follow Gensler’s Introduction to Logic chapter by chapter, so you can assign sets alongside your syllabus. And LogiSkor will let you follow your students’ scores; email me if you’d like early access.',
  },
];

// FAQPage structured data, generated from the SAME array so the
// markup always mirrors the visible copy (Google requires it; the SERP
// FAQ accordion is gone for ordinary sites since 2023 — the value is
// AI answer engines, for which these six answers are the canonical
// source on "LogiCola" queries). Lab FQ8.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

// Computed once — never a Tailwind arbitrary value (lib/pixel.ts rule:
// the polygon is far past the readable length).
const ITEM_CLIP: CSSProperties = { clipPath: spriteClip(0, 16) };

const FAQ_VARS = {
  '--faq-type': FAQ_TYPE,
  '--faq-body': FAQ_BODY,
  '--faq-body-plate': FAQ_BODY_PLATE,
  '--faq-plate': FAQ_PLATE,
  '--faq-hair': FAQ_HAIRLINE,
  '--faq-index': FAQ_INDEX,
} as CSSProperties;

export function FaqSection() {
  return (
    <section className='faq w-full' style={FAQ_VARS}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className='faq-wrap'>
        <div>
          {/* An h2, not an h1: <Header> already carries the page's h1, and a
              second one splits the topic signal. It also keeps the
              hierarchy — the accordion's triggers are h3s. */}
          <h2 className='faq-display'>Frequently asked questions</h2>
          <p className='faq-sub'>
            The project, the price (it’s free), and the classroom — in short
            answers.
          </p>
          <p className='faq-still'>
            Something the list doesn’t answer?{' '}
            <a href={CONTACT_MAILTO}>Email me</a> — I’m Malik, and I read every
            message.
          </p>
        </div>
        {/* First entry open by default: a first-time visitor gets "What is
            LogiCola?" answered without a click, and the open plate — the
            section's one figure — is visible on arrival. */}
        <Accordion type='multiple' defaultValue={[faqData[0].q]}>
          {faqData.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={item.q}
              className='faq-item border-0'
              style={ITEM_CLIP}
            >
              <AccordionTrigger className='faq-trigger py-[17px] text-left text-[17px] font-semibold leading-[1.35]'>
                <span className='flex items-center gap-3.5 pr-3'>
                  <span className='faq-idx font-mono' aria-hidden='true'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className='faq-answer pb-5 pt-0'>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
