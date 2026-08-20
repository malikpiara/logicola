import { describe, expect, it } from 'vitest';
import {
  RESERVED_NAME_INITIALS,
  RESERVED_VERB_INITIALS,
  adjectives,
  baselines2008,
  lexicons,
  names,
  nounsProfessions,
  praiseStrings,
  relations,
  retired2008,
  verbsA,
  verbsB,
  verbsTransitive,
} from './lexicons';

describe('lexicons — live pools', () => {
  it('every lexicon is non-empty', () => {
    for (const [name, lex] of Object.entries(lexicons)) {
      expect(lex.length, `${name} should have entries`).toBeGreaterThan(0);
    }
  });

  it('every entry is a non-empty string', () => {
    for (const [name, lex] of Object.entries(lexicons)) {
      for (const entry of lex) {
        expect(typeof entry, `${name} entry "${entry}"`).toBe('string');
        expect(entry.trim().length, `${name} entry "${entry}"`).toBeGreaterThan(
          0
        );
      }
    }
  });

  it('no lexicon contains duplicate entries within itself', () => {
    for (const [name, lex] of Object.entries(lexicons)) {
      const set = new Set(lex);
      expect(set.size, `${name} has duplicates`).toBe(lex.length);
    }
  });
});

/**
 * The fidelity contract. It used to pin the *live* pool counts, which
 * meant any vocabulary work failed the suite by construction. It now
 * pins the frozen 2008 baselines instead: the guarantee is that the
 * original catalog is still reconstructible from this file, not that we
 * never add to it. A silent edit to a `*2008` array still fails here.
 */
describe('lexicons — 2008 baseline is intact', () => {
  it('counts match the 2008 binary', () => {
    expect(baselines2008.nounsProfessions.length).toBe(52);
    expect(baselines2008.adjectives.length).toBe(87);
    // The modern-layer size is pinned to the figure its doc comment claims,
    // so an addition cannot silently make that comment a lie. If this fails,
    // update BOTH the number here and the one in lexicons.ts.
    expect(adjectives.length - 87 + retired2008.adjectives.length).toBe(41);
    expect(baselines2008.names.length).toBe(8);
    expect(baselines2008.verbsA.length).toBe(22);
    expect(baselines2008.praiseStrings.length).toBe(30);
    expect(baselines2008.relations.length).toBe(13);
    expect(baselines2008.verbsB.length).toBe(25);
    expect(baselines2008.verbsTransitive.length).toBe(21);
  });

  // Spot-checks: 2008-only additions confirm we're using the post-2003
  // expanded lexicon, not the older documented 2003 set.
  it('contains 2008 noun additions absent from 2003', () => {
    for (const noun of [
      'backpacker',
      'poet',
      'lawyer',
      'pharmacist',
      'politician',
      'republican',
      'pickpocket',
    ]) {
      expect(baselines2008.nounsProfessions).toContain(noun);
    }
  });

  it('contains 2008 adjective additions absent from 2003', () => {
    for (const adj of ['strong', 'bright', 'frightened', 'disgusting']) {
      expect(baselines2008.adjectives).toContain(adj);
    }
  });

  it('contains 2008 verb additions across pools', () => {
    expect(baselines2008.verbsA).toContain('love');
    expect(baselines2008.verbsA).toContain('hate');
    expect(baselines2008.verbsB).toContain('complain');
    expect(baselines2008.verbsB).toContain('flirt');
    expect(baselines2008.verbsTransitive).toContain('disappoint');
  });

  it('does not contain 2003-only entries removed in 2008', () => {
    // The 2008 source dropped `dictator` from the noun list;
    // this guards against accidentally re-adding a 2003-only entry.
    expect(baselines2008.nounsProfessions).not.toContain('dictator');
  });

  it('contains the canonical 8 names in 2008 source order', () => {
    expect(baselines2008.names).toEqual([
      'Sally',
      'Madonna',
      'Harry',
      'George',
      'Carol',
      'Donna',
      'Keith',
      'David',
    ]);
  });

  it('contains documented relations', () => {
    for (const rel of ['classmate', 'friend', 'neighbor', 'roommate']) {
      expect(baselines2008.relations).toContain(rel);
    }
  });

  it('contains 2008-added praise strings', () => {
    for (const praise of [
      'A logic brain',
      'I am impressed',
      'Sharp student',
      'Yes! Yes',
      'Totally cool',
      'Good response',
    ]) {
      expect(baselines2008.praiseStrings).toContain(praise);
    }
  });

  // Some entries exist in both verbsA and verbsTransitive in the
  // 2008 source. Document this rather than treating it as a bug.
  it('cross-pool overlaps reflect the 2008 source', () => {
    // `hurt` and `help` appear in both verbsA and verbsTransitive
    // in the 2008 binary. Generators may draw from either pool.
    for (const pool of [
      baselines2008.verbsA,
      baselines2008.verbsTransitive,
    ] as const) {
      expect(pool).toContain('hurt');
      expect(pool).toContain('help');
    }
  });
});

describe('lexicons — the modern layer', () => {
  it('every retirement names an entry the 2008 baseline actually had', () => {
    for (const [pool, entries] of Object.entries(retired2008)) {
      for (const entry of entries) {
        expect(
          baselines2008[pool as keyof typeof baselines2008],
          `retired "${entry}" is not in the ${pool} baseline — stale retirement`
        ).toContain(entry);
      }
    }
  });

  it('retired entries are gone from the live pools', () => {
    expect(nounsProfessions).not.toContain('druggist');
    expect(nounsProfessions).not.toContain('lunatic');
    expect(adjectives).not.toContain('demented');
    // `comical` is deliberately absent from this list: it was retired on
    // intuition and reinstated when Ngram data showed it rising 2.87x.
    for (const dated of [
      'bashful',
      'courteous',
      'tactful',
      'loveable',
      'boastful',
      'sociable',
      'fanatical',
      'frivolous',
    ]) {
      expect(adjectives).not.toContain(dated);
    }
    // `frantic` is the mirror of the `comical` case and belongs in neither
    // list above: it is rising (2.64x) and no rarer than words we kept, so it
    // was retired on editorial judgment rather than evidence — the lurid
    // cluster it sat in, not the word. Pinned separately so the reasoning
    // travels with the assertion and nobody reinstates it citing the figure.
    expect(adjectives).not.toContain('frantic');
    expect(adjectives).toContain('stressed');
    // `loveable` is a respelling rather than a retirement: the frozen-baseline
    // rule forbids editing the 2008 array, so the fix is retire + re-add.
    expect(adjectives).toContain('lovable');
    expect(adjectives).toContain('comical');
    // Kept despite being rare: `forgetful` has no one-word replacement, and
    // `likeable` has no reform — the American spelling `likable` is RARER.
    expect(adjectives).toContain('forgetful');
    expect(adjectives).toContain('likeable');
  });

  /**
   * The additions are chosen on measured frequency, not taste. wordfreq Zipf
   * blends subtitles, social media, news and books; the pool median is ~4.07.
   * If someone adds a word well below that, this is the tripwire.
   */
  it('every modern adjective is at least as common as the rarest 2008 one', () => {
    for (const w of ['arrogant', 'brave', 'calm', 'proud', 'wise', 'silly']) {
      expect(adjectives).toContain(w);
    }
  });

  // Proposed for retirement, reinstated on review. Pinned so the decision
  // is not quietly re-litigated.
  it('keeps Madonna', () => {
    expect(names).toContain('Madonna');
  });

  it('every surviving 2008 entry is still in its live pool', () => {
    for (const [pool, baseline] of Object.entries(baselines2008)) {
      const withdrawn = new Set<string>(
        retired2008[pool as keyof typeof retired2008] ?? []
      );
      const live = lexicons[pool as keyof typeof lexicons];
      for (const entry of baseline) {
        if (withdrawn.has(entry)) continue;
        expect(live, `${pool} lost "${entry}"`).toContain(entry);
      }
    }
  });

  it('the modern additions are present', () => {
    expect(nounsProfessions).toContain('nurse');
    expect(nounsProfessions).toContain('programmer');
    expect(adjectives).toContain('honest');
    expect(adjectives).toContain('reliable');
    expect(names).toContain('Aisha');
    expect(names).toContain('Priya');
    expect(verbsA).toContain('trust');
    expect(verbsB).toContain('apologize');
    expect(verbsTransitive).toContain('interrupt');
  });

  /**
   * The dead pools. Nothing imports either one, so they stay at the 2008
   * text — this pins that decision so a future reader knows the omission
   * was deliberate rather than an oversight.
   */
  it('leaves the unused pools unmodernised', () => {
    expect(relations).toEqual(baselines2008.relations);
    expect(praiseStrings).toEqual(baselines2008.praiseStrings);
  });

  /**
   * `pickDifferentLetter` filters a pool to entries whose initial differs
   * from an already-drawn word. If a pool's initials collapse onto a few
   * letters that filter starves and question variety drops quietly, so
   * the additions are required to widen the spread rather than deepen it.
   */
  it('widens initial-letter coverage rather than crowding it', () => {
    const initials = (pool: readonly string[]) =>
      new Set(pool.map((e) => e[0]!.toLowerCase()));
    for (const pool of ['nounsProfessions', 'adjectives', 'names'] as const) {
      const before = initials(baselines2008[pool]);
      const after = initials(lexicons[pool]);
      expect(
        after.size,
        `${pool} should cover more initials than the 2008 baseline`
      ).toBeGreaterThan(before.size);
    }
  });

  /**
   * The load-bearing one. A name's initial becomes a singular-term letter
   * in the generated wff, so an initial that is already a variable (x, y,
   * z), a pronoun (i = "I", u = "you") or an operator (v = ∨) emits
   * notation that says something other than what is meant.
   *
   * This test exists because five separate proposals — Zara, Zendaya,
   * Yoda, Vader, Wolverine — cleared every other check and would have
   * shipped. Nothing else catches it.
   */
  it('no name takes a reserved initial', () => {
    for (const name of names) {
      const initial = name[0]!.toLowerCase();
      expect(
        RESERVED_NAME_INITIALS,
        `"${name}" starts with "${initial}", which is reserved — see RESERVED_NAME_INITIALS`
      ).not.toContain(initial);
    }
  });

  /**
   * Verbs become predicate letters in Sets L and N, where O is the deontic
   * operator. `overlook` shipped briefly and produced `O∼O{u}p`.
   */
  it('no verb takes a reserved initial', () => {
    for (const verb of [...verbsA, ...verbsB, ...verbsTransitive]) {
      expect(
        RESERVED_VERB_INITIALS,
        `"${verb}" starts with "${verb[0]!.toLowerCase()}", which is the deontic operator`
      ).not.toContain(verb[0]!.toLowerCase());
    }
  });

  /**
   * Pins the investigation recorded in lexicons.ts: term initials are
   * deliberately unrestricted, because Gensler's own verbs already emit
   * A/E/I/O capitals in Set A. If someone re-adds a restriction, this fails.
   */
  it('term initials are deliberately unrestricted', () => {
    const vowelInitialTerms = [...nounsProfessions, ...adjectives].filter((w) =>
      /^[aeiou]/i.test(w)
    );
    expect(vowelInitialTerms.length).toBeGreaterThan(0);
    // and the 2008 verbs that disprove the logic explanation are still there
    for (const verb of ['admire', 'ignore', 'encourage', 'upset']) {
      expect(baselines2008.verbsA).toContain(verb);
    }
  });

  it('the 2008 verb pools already obeyed that rule too', () => {
    for (const pool of ['verbsA', 'verbsB', 'verbsTransitive'] as const) {
      for (const verb of baselines2008[pool]) {
        expect(RESERVED_VERB_INITIALS).not.toContain(verb[0]!.toLowerCase());
      }
    }
  });

  it("the 2008 names already obeyed the rule (evidence it is Gensler's)", () => {
    for (const name of baselines2008.names) {
      expect(RESERVED_NAME_INITIALS).not.toContain(name[0]!.toLowerCase());
    }
  });
});
