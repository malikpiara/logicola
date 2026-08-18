import { describe, expect, it } from 'vitest';
import { tintedIcon } from './useQuizFavicon';

/** A stand-in for `app/icon.svg`: the same wrapper shape, and the same
 *  `#BD00AD` fill the real mark is drawn in. */
const MARK =
  '<svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M0 0h9v12H0z" fill="#BD00AD"/>' +
  '<path d="M1 1h7v10H1z" fill="#BD00AD"/>' +
  '</svg>';

function decode(uri: string): string {
  return decodeURIComponent(uri.replace('data:image/svg+xml,', ''));
}

describe('tintedIcon', () => {
  it('recolours the mark without changing its shape', () => {
    const svg = decode(tintedIcon(MARK, '#3F0167')!);

    expect(svg).toContain('fill="#3F0167"');
    // The silhouette is the shipped one, untouched: same box, same paths.
    expect(svg).toContain('viewBox="0 0 9 12"');
    expect(svg).toContain('d="M0 0h9v12H0z"');
    expect(svg).toContain('d="M1 1h7v10H1z"');
    // No chip, no backdrop — nothing is added behind the mark.
    expect(svg).not.toContain('<rect');
  });

  it('replaces every occurrence of the source fill, not just the first', () => {
    const svg = decode(tintedIcon(MARK, '#751100')!);
    expect(svg.split('#751100')).toHaveLength(3); // two paths → two fills
    // The shipped fill is the one colour we replace; none may survive,
    // or a set would wear the wrong ink.
    expect(svg).not.toContain('#BD00AD');
  });

  it('emits a data URI that survives decoding', () => {
    const uri = tintedIcon(MARK, '#4A1040')!;
    expect(uri.startsWith('data:image/svg+xml,')).toBe(true);
    // '#' must be escaped or the browser reads the rest as a fragment.
    expect(uri).not.toContain('#');
    expect(decode(uri)).toContain('#4A1040');
  });

  it('gives up rather than guessing when the mark is not the one we know', () => {
    expect(tintedIcon('<html>nope</html>', '#000')).toBeNull();
    expect(tintedIcon('', '#000')).toBeNull();
    // An svg without the fill we expect is a mark that has been
    // redrawn; leave the default favicon up rather than ship it as-is.
    expect(tintedIcon('<svg><path fill="#123456"/></svg>', '#000')).toBeNull();
  });
});
