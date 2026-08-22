import { FALLACIES } from '@/content/sets/setR.data';
import { trimClause } from '@/content/sets/setR.generator';
import { HintProse } from './hintBlock';

/**
 * Set R's guide section — the full eighteen-fallacy table. Its own
 * module, loaded via `next/dynamic` from wffGuide, because it drags the
 * whole Set R passage corpus (setR.data) with it: imported statically it
 * rode in the shared quiz shell and every set's page paid for it. As a
 * dynamic chunk it loads only when a Set R guide actually mounts — where
 * the same modules are already warm from the set's own generator chunk.
 */
export default function SetRGuide() {
  return (
    <div>
      <h3 className='qguide-h'>The eighteen informal fallacies</h3>
      {/* The chapter-sourcing sentence left with the verbatim text: the
          descriptions are original now (2026-08-22), so the source
          credit moved to the qguide-src line at the end of the list. */}
      <p className='qguide-p'>
        Some passages commit more than one fallacy and so have more than one
        correct answer.
      </p>
      {/* The same hierarchy as a hint — code chip, weighted name, ink
          gloss, hanging-numeral clauses — so the reference and the
          feedback read as one system. The clause "or" tails are
          dropped: the numerals make the disjunction structural. */}
      <table className='qguide-table'>
        <tbody>
          {FALLACIES.map((fallacy) => (
            <tr key={fallacy.code}>
              <td className='qguide-code'>{fallacy.code}</td>
              <td>
                <span className='qguide-name'>{fallacy.name}</span>
                <div className='qguide-p' style={{ margin: '2px 0 0' }}>
                  <HintProse text={fallacy.description} />
                </div>
                {fallacy.clauses && (
                  <ol className='qhint-clauses'>
                    {fallacy.clauses.map((clause, i) => (
                      <li key={i}>
                        <HintProse text={trimClause(clause)} />
                      </li>
                    ))}
                  </ol>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className='qguide-src'>
        Original descriptions; framework after Gensler’s “Fallacies and
        Argumentation” chapter.
      </p>
    </div>
  );
}
