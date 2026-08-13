import {
  MARKETING_THEME,
  fieldSvg,
  themeButton,
  SPRITE_CLIP,
  RING_BAND,
} from '@/lib/marketingTheme';
import { NewsletterForm } from '@/components/marketing/newsletterForm';

/**
 * The newsletter panel (lab, 2026-08-14): inverts against the content
 * ground so it keeps figure — scheme-ground panel on white content —
 * with the pattern banished to a footer band, quoting the question
 * screen's placement. Server component; passes theme + clips down to
 * the client form.
 */
export function NewsletterCard({ source }: { source: string }) {
  const t = MARKETING_THEME;
  const btn = themeButton();

  return (
    <section
      className='mt-14'
      style={
        {
          background: t.ground,
          clipPath: SPRITE_CLIP,
          '--mk-surface': t.ground,
        } as React.CSSProperties
      }
    >
      <div className='px-6 pb-7 pt-9 sm:px-10'>
        <h2
          className='font-stretch text-[22px] font-extrabold uppercase'
          style={{ color: t.type }}
        >
          Follow the releases
        </h2>
        <p className='mt-2 max-w-xl' style={{ color: t.type, opacity: 0.8 }}>
          New exercise sets, new features, the occasional essay — straight to
          your inbox when they ship.
        </p>
        <NewsletterForm
          source={source}
          theme={{
            ink: t.ink,
            buttonBg: btn.bg,
            buttonFg: btn.fg,
            spriteClip: SPRITE_CLIP,
            ringClip: RING_BAND,
          }}
        />
      </div>
      <div
        className='h-16 overflow-hidden'
        dangerouslySetInnerHTML={{
          __html: fieldSvg(1120, 96, { scaleMul: 0.45, seedOffset: 11 }),
        }}
      />
    </section>
  );
}
