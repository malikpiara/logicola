import { describe, expect, it } from 'vitest';
import {
  adjectives,
  lexicons,
  names,
  nounsProfessions,
  praiseStrings,
  relations,
  verbsA,
  verbsB,
  verbsTransitive,
} from './lexicons';

describe('lexicons', () => {
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

  // Pin the 2008-source counts. These are extracted from
  // LCEXE_2008.exe's data section and should not change unless we
  // intentionally update the lexicons (e.g., when 2008→post-2008
  // additions ship).
  it('counts match the 2008 binary', () => {
    expect(nounsProfessions.length).toBe(52);
    expect(adjectives.length).toBe(87);
    expect(names.length).toBe(8);
    expect(verbsA.length).toBe(22);
    expect(praiseStrings.length).toBe(30);
    expect(relations.length).toBe(13);
    expect(verbsB.length).toBe(25);
    expect(verbsTransitive.length).toBe(21);
  });

  // Spot-checks: 2008-only additions confirm we're using the post-2003
  // expanded lexicon, not the older documented 2003 set.
  it('contains 2008 noun additions absent from 2003', () => {
    expect(nounsProfessions).toContain('backpacker');
    expect(nounsProfessions).toContain('poet');
    expect(nounsProfessions).toContain('lawyer');
    expect(nounsProfessions).toContain('pharmacist');
    expect(nounsProfessions).toContain('politician');
    expect(nounsProfessions).toContain('republican');
    expect(nounsProfessions).toContain('pickpocket');
  });

  it('contains 2008 adjective additions absent from 2003', () => {
    expect(adjectives).toContain('strong');
    expect(adjectives).toContain('bright');
    expect(adjectives).toContain('frightened');
    expect(adjectives).toContain('disgusting');
  });

  it('contains 2008 verb additions across pools', () => {
    expect(verbsA).toContain('love');
    expect(verbsA).toContain('hate');
    expect(verbsB).toContain('complain');
    expect(verbsB).toContain('flirt');
    expect(verbsTransitive).toContain('disappoint');
  });

  it('does not contain 2003-only entries removed in 2008', () => {
    // The 2008 source dropped `dictator` from the noun list;
    // this guards against accidentally re-adding a 2003-only entry.
    expect(nounsProfessions).not.toContain('dictator');
  });

  it('contains the canonical 8 names in 2008 source order', () => {
    expect(names).toEqual([
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
    expect(relations).toContain('classmate');
    expect(relations).toContain('friend');
    expect(relations).toContain('neighbor');
    expect(relations).toContain('roommate');
  });

  it('contains 2008-added praise strings', () => {
    expect(praiseStrings).toContain('A logic brain');
    expect(praiseStrings).toContain('I am impressed');
    expect(praiseStrings).toContain('Sharp student');
    expect(praiseStrings).toContain('Yes! Yes');
    expect(praiseStrings).toContain('Totally cool');
    expect(praiseStrings).toContain('Good response');
  });

  // Some entries exist in both verbsA and verbsTransitive in the
  // 2008 source. Document this rather than treating it as a bug.
  it('cross-pool overlaps reflect the 2008 source', () => {
    // `hurt` and `help` appear in both verbsA and verbsTransitive
    // in the 2008 binary. Generators may draw from either pool.
    expect(verbsA).toContain('hurt');
    expect(verbsTransitive).toContain('hurt');
    expect(verbsA).toContain('help');
    expect(verbsTransitive).toContain('help');
  });
});
