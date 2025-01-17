export const feedback_single_person =
  'stands for a single person, and so translates into a small letter.';

export const HINT_AMBIGUOUS = `This statement isn't ambiguous. These are the four ambiguous forms:
1) If A, then it's necessary that B.
2) If A, then it must be that B.
3) If A, then it's impossible that B.
4) If A, then it couldn't be that B.`;

export const HINT_ONLY_SECOND_PART_IMPOSSIBLE = `Here the impossibility just applies to the second part by itself.`;

export const HINT_ONLY_SECOND_PART_NECESSARY = `Here the necessity just applies to the second part by itself.`;

export const HINT_TRANSLATE_SELF_CONTRADICTORY = `Your translation means "It's possible that X is false." 
Translate "self-contradictory" as "~\\lozenge" ("not possible").`;

export const HINT_TRANSLATE_NECESSARY_NOT = `Your translation means "not necessary." 
Translate "necessary not" as "\\square \\sim ...".`;

export const HINT_DOESNT_ENTAIL = `"... doesn't entail ..." means "It isn't necessary that if ... then ..."`;
