'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { NewBadge } from '@/components/newBadge';
import { TopicIcon } from '@/components/nav/topicIcon';
import { gemClip } from '@/lib/pixel';
import {
  topics,
  topicIsNew,
  topicIsMultiSet,
  drillTitle,
  type Topic,
} from '@/content/topics';

/**
 * The mobile exercises menu as a bottom sheet — the nav lab's decided
 * container (D7, 2026-08-14: "might be the winner"), in the two
 * chrome-branded variants Malik picked on information hierarchy (D13):
 *
 *   - 'f' (3d-f): chip tiles on the cream chrome; level 2 stays in the
 *     cream world — drills as white cards on cream. ONE world per
 *     screen (the three-grounds dissonance Malik caught, fixed).
 *   - 'g' (3d-g): chip rows on the same chrome; level 2 paints the
 *     WHOLE sheet in the set's own triad — grabber and eyebrow
 *     included — previewing the screen the tap opens.
 *
 * vaul supplies the native sheet physics (drag-to-dismiss, scrim tap) —
 * per the lab's port note, never hand-rolled. HIG pass 2026-08-14:
 * ≥44pt targets, safe-area bottom padding, sr-only text beside the
 * colour-only NEW dot.
 */
const TYPE = '#02302C';
const CREAM = '#EDEDE3';
const GREEN = '#05A24B';
const HAIR_CREAM = '#CCD3C9';
const META_CREAM = '#05743E';
const BLURB_CREAM = '#315651';
const BODY_WHITE = '#416461';
const TAG = '#5B7976';

const GEM = gemClip();

export type SheetVariant = 'f' | 'g';

export function ExercisesSheet({
  variant,
  open,
  onOpenChange,
}: {
  variant: SheetVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  // 'g' commits the whole sheet to the set's world on level 2
  const world = variant === 'g' ? activeTopic?.colors : undefined;
  const sheetBg = world ? world.surface : CREAM;
  const grab = world ? world.grab : GREEN;
  const headInk = world ? world.ink : TYPE;

  const close = () => {
    onOpenChange(false);
    setActiveTopic(null);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setActiveTopic(null);
      }}
      shouldScaleBackground={false}
    >
      <DrawerContent
        className='h-[85svh] border-0 rounded-t-[20px] [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[var(--sheet-grab)]'
        style={
          {
            background: sheetBg,
            '--sheet-grab': grab,
          } as React.CSSProperties
        }
        aria-describedby={undefined}
      >
        <DrawerTitle
          className='px-5 pb-3 pt-4 font-mono text-[11px] font-bold uppercase tracking-[0.08em]'
          style={{ color: headInk }}
        >
          Exercises
        </DrawerTitle>

        <div className='flex-1 overflow-hidden'>
          <div
            className={`flex h-full w-[200%] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out ${
              activeTopic ? '-translate-x-1/2' : ''
            }`}
          >
            <div className='flex h-full w-1/2 flex-col overflow-y-auto'>
              {variant === 'f' ? (
                <TileGrid onPick={setActiveTopic} />
              ) : (
                <ChipRows onPick={setActiveTopic} />
              )}
              <SheetFooter />
            </div>
            <div className='h-full w-1/2 overflow-y-auto'>
              {activeTopic &&
                (variant === 'g' ? (
                  <WorldDrills
                    topic={activeTopic}
                    onBack={() => setActiveTopic(null)}
                    onNavigate={close}
                  />
                ) : (
                  <CreamDrills
                    topic={activeTopic}
                    onBack={() => setActiveTopic(null)}
                    onNavigate={close}
                  />
                ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NewDot() {
  return (
    <span
      className='h-1.5 w-1.5 shrink-0 rounded-full bg-[#BD00AD]'
      aria-hidden='true'
    />
  );
}

/** 3d-f level 1 — white chip tiles on the cream chrome */
function TileGrid({ onPick }: { onPick: (t: Topic) => void }) {
  return (
    <div className='grid grid-cols-2 gap-2.5 p-3'>
      {topics.map((topic) => (
        <button
          key={topic.id}
          type='button'
          onClick={() => onPick(topic)}
          className='motion-button flex min-h-[96px] flex-col items-start gap-1.5 rounded-xl border bg-white p-3.5 text-left'
          style={{ borderColor: HAIR_CREAM }}
        >
          <span
            className='inline-flex h-7 w-7 items-center justify-center'
            style={{ clipPath: GEM, background: topic.colors.surface }}
          >
            <TopicIcon topicId={topic.id} color={topic.colors.ink} size={20} />
          </span>
          <span className='flex items-center gap-1.5'>
            <span
              className='text-[15px] font-semibold leading-tight'
              style={{ color: TYPE }}
            >
              {topic.name}
            </span>
            {topicIsNew(topic) && (
              <>
                <NewDot />
                <span className='sr-only'>— new exercises inside</span>
              </>
            )}
          </span>
          <span
            className='mt-auto font-mono text-[11px] font-semibold tracking-[0.04em]'
            style={{ color: TAG }}
          >
            {topic.sets}
          </span>
        </button>
      ))}
    </div>
  );
}

/** 3d-g level 1 — chip rows on the cream chrome */
function ChipRows({ onPick }: { onPick: (t: Topic) => void }) {
  return (
    <div>
      {topics.map((topic) => (
        <button
          key={topic.id}
          type='button'
          onClick={() => onPick(topic)}
          className='flex min-h-[56px] w-full items-center gap-2.5 border-b bg-white px-5 py-3.5 text-left active:bg-[#F6F6F1]'
          style={{ borderColor: HAIR_CREAM }}
        >
          <span
            className='inline-flex h-7 w-7 shrink-0 items-center justify-center'
            style={{ clipPath: GEM, background: topic.colors.surface }}
          >
            <TopicIcon topicId={topic.id} color={topic.colors.ink} size={20} />
          </span>
          <span className='text-[16px] font-semibold' style={{ color: TYPE }}>
            {topic.name}
          </span>
          {topicIsNew(topic) && (
            <>
              <NewDot />
              <span className='sr-only'>— new exercises inside</span>
            </>
          )}
          <span className='grow' />
          <span
            className='font-mono text-[11px] font-semibold tracking-[0.04em]'
            style={{ color: TAG }}
          >
            {topic.sets}
          </span>
          <span aria-hidden='true' className='text-sm' style={{ color: TAG }}>
            ›
          </span>
        </button>
      ))}
    </div>
  );
}

function BackRow({
  color,
  border,
  onBack,
}: {
  color: string;
  border: string;
  onBack: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onBack}
      className='flex min-h-[44px] w-full items-center gap-2 border-b px-5 py-3 text-left font-mono text-[13px] font-semibold'
      style={{ color, borderColor: border }}
    >
      ‹ All topics
    </button>
  );
}

function DrillHead({
  topic,
  meta,
  title,
  blurb,
  border,
}: {
  topic: Topic;
  meta: string;
  title: string;
  blurb: string;
  border: string;
}) {
  return (
    <div className='border-b px-5 pb-3.5 pt-5' style={{ borderColor: border }}>
      <div
        className='mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em]'
        style={{ color: meta }}
      >
        {topic.sets}
      </div>
      <div
        className='font-stretch text-xl font-extrabold'
        style={{ color: title }}
      >
        {topic.name}
      </div>
      <div className='mt-1 text-sm leading-normal' style={{ color: blurb }}>
        {topic.blurb}
      </div>
    </div>
  );
}

/** 3d-f level 2 — stays in the cream world: white cards on cream */
function CreamDrills({
  topic,
  onBack,
  onNavigate,
}: {
  topic: Topic;
  onBack: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className='pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
      <BackRow color={TYPE} border={HAIR_CREAM} onBack={onBack} />
      <DrillHead
        topic={topic}
        meta={META_CREAM}
        title={TYPE}
        blurb={BLURB_CREAM}
        border={HAIR_CREAM}
      />
      {topic.drills.map((drill) => (
        <Link
          key={drill.quizPath}
          href={drill.quizPath}
          onClick={onNavigate}
          className='motion-button mx-3 mt-2.5 block rounded-xl border bg-white p-3.5'
          style={{ borderColor: HAIR_CREAM }}
        >
          <span className='flex items-center gap-2.5'>
            <span
              className='text-[15.5px] font-semibold'
              style={{ color: TYPE }}
            >
              {drillTitle(drill)}
            </span>
            {drill.isNew && <NewBadge />}
            {topicIsMultiSet(topic) && (
              <span
                className='ml-auto font-mono text-[11px] font-semibold'
                style={{ color: TAG }}
              >
                {drill.chapter}
              </span>
            )}
          </span>
          <span
            className='mt-0.5 block text-[13px] leading-normal'
            style={{ color: BODY_WHITE }}
          >
            {drill.description}
          </span>
        </Link>
      ))}
    </div>
  );
}

/** 3d-g level 2 — the whole sheet becomes the set's screen */
function WorldDrills({
  topic,
  onBack,
  onNavigate,
}: {
  topic: Topic;
  onBack: () => void;
  onNavigate: () => void;
}) {
  const c = topic.colors;
  return (
    <div className='pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
      <BackRow color={c.ink} border={c.hair} onBack={onBack} />
      <DrillHead
        topic={topic}
        meta={c.meta}
        title={c.ink}
        blurb={c.ink}
        border={c.hair}
      />
      {topic.drills.map((drill) => (
        <Link
          key={drill.quizPath}
          href={drill.quizPath}
          onClick={onNavigate}
          className='block border-b px-5 py-3.5'
          style={{ borderColor: c.hair }}
        >
          <span className='flex items-center gap-2.5'>
            <span
              className='text-[15.5px] font-semibold'
              style={{ color: c.ink }}
            >
              {drillTitle(drill)}
            </span>
            {drill.isNew && <NewBadge />}
            {topicIsMultiSet(topic) && (
              <span
                className='ml-auto font-mono text-[11px] font-semibold'
                style={{ color: c.ink }}
              >
                {drill.chapter}
              </span>
            )}
          </span>
          <span
            className='mt-0.5 block text-[13px] leading-normal'
            style={{ color: c.body }}
          >
            {drill.description}
          </span>
        </Link>
      ))}
    </div>
  );
}

function SheetFooter() {
  return (
    <div
      className='mt-auto flex items-center gap-5 border-t px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'
      style={{ borderColor: HAIR_CREAM }}
    >
      <Link
        href='/blog'
        className='flex min-h-[44px] items-center font-mono text-[13.5px] font-semibold'
        style={{ color: TYPE }}
      >
        Blog
      </Link>
      <Link
        href='https://github.com/sponsors/malikpiara'
        className='motion-button ml-auto inline-flex min-h-[40px] items-center px-4 font-mono text-xs font-bold tracking-[0.04em]'
        style={{ clipPath: GEM, background: TYPE, color: CREAM }}
      >
        Donate
      </Link>
    </div>
  );
}
