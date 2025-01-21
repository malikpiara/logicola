'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KatexSpan from '@/components/katexSpan';
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';

/** Shorthand replacements (each gets a trailing space). */
const SHORTHAND_REPLACEMENTS = [
  { find: '~', replaceWith: '\\sim ' },
  { find: ',n', replaceWith: '\\square ' },
  { find: ',p', replaceWith: '\\lozenge ' },
  { find: ',.', replaceWith: '\\cdot ' },
  { find: ',v', replaceWith: '\\vee ' },
  { find: ',i', replaceWith: '\\supset ' },
  { find: ',eq', replaceWith: '\\equiv ' },
  { find: ',ex', replaceWith: '\\exists ' },
];

/** KaTeX button definitions. */
const LATEX_BUTTONS = [
  { command: '\\sim', label: 'NOT', preview: '$ \\sim $' },
  { command: '\\square', label: 'NECESSARY', preview: '$ \\square $' },
  { command: '\\lozenge', label: 'POSSIBLE', preview: '$ \\lozenge $' },
  { command: '\\cdot', label: 'AND', preview: '$ \\cdot $' },
  { command: '\\vee', label: 'OR', preview: '$ \\vee $' },
  { command: '\\supset', label: 'IMPLIES', preview: '$ \\supset $' },
  { command: '\\equiv', label: 'EQUIV', preview: '$ \\equiv $' },
  { command: '\\exists', label: 'EXISTS', preview: '$ \\exists $' },
];

/**
 * Replaces all shorthands in `text` from left to right,
 * adjusting `cursorPos` if a match occurs before the old cursor.
 */
function replaceShorthandsWithCursor(
  text: string,
  cursorPos: number
): { newText: string; newCursor: number } {
  let newText = '';
  let currentIndex = 0;
  let newCursor = cursorPos;

  while (currentIndex < text.length) {
    // Among all shorthand patterns, find the earliest match after currentIndex.
    let earliestMatchIndex = -1;
    let matched = null as (typeof SHORTHAND_REPLACEMENTS)[number] | null;

    for (const s of SHORTHAND_REPLACEMENTS) {
      const foundIndex = text.indexOf(s.find, currentIndex);
      if (foundIndex !== -1) {
        if (earliestMatchIndex === -1 || foundIndex < earliestMatchIndex) {
          earliestMatchIndex = foundIndex;
          matched = s;
        }
      }
    }

    if (earliestMatchIndex === -1 || !matched) {
      // No more matches; append the rest
      newText += text.slice(currentIndex);
      break;
    } else {
      // Copy everything up to earliestMatchIndex
      newText += text.slice(currentIndex, earliestMatchIndex);

      // Insert the replacement text
      const { find, replaceWith } = matched;
      newText += replaceWith;

      // If the match is before the old cursor, shift cursor by the difference
      if (earliestMatchIndex < cursorPos) {
        const diff = replaceWith.length - find.length;
        newCursor += diff;
      }

      // Move currentIndex past the matched text
      currentIndex = earliestMatchIndex + matched.find.length;
    }
  }

  return { newText, newCursor };
}

export default function LabelGeneratorPage() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Auto-closing parentheses. If user presses '(',
   * wrap the selected text or insert "()".
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === '(') {
      e.preventDefault();

      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const oldValue = target.value;
      const selectedText = oldValue.slice(start, end);

      // Insert "(selectedText)"
      const newValue =
        oldValue.slice(0, start) +
        '(' +
        selectedText +
        ')' +
        oldValue.slice(end);

      // Figure out new cursor position
      let newCursorPos = start + 1;
      if (start !== end) {
        // If text was selected, place cursor after ')'
        newCursorPos = end + 2;
      }

      setAndReplaceShorthands(newValue, newCursorPos);
    }
  }

  /**
   * Called onChange for typed text. We replace any
   * typed shorthands while preserving the cursor.
   */
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!textareaRef.current) {
      setInput(e.target.value);
      return;
    }
    const newValue = e.target.value;
    const cursorPos = textareaRef.current.selectionStart;
    setAndReplaceShorthands(newValue, cursorPos);
  }

  /**
   * Insert the LaTeX command at the current cursor or over the selection,
   * then run the same logic that processes shorthands + preserves cursor.
   */
  function insertLatex(latex: string) {
    if (!textareaRef.current) return;

    const oldVal = input;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    // Insert "latex + " " at the cursor/selection
    const newVal = oldVal.slice(0, start) + latex + ' ' + oldVal.slice(end);
    const newCursor = start + latex.length + 1; // after inserted command + 1 space

    setAndReplaceShorthands(newVal, newCursor);
  }

  /**
   * Utility: replace shorthands in the given text, then set input + cursor.
   */
  function setAndReplaceShorthands(newValue: string, cursorPos: number) {
    const { newText, newCursor } = replaceShorthandsWithCursor(
      newValue,
      cursorPos
    );
    setInput(newText);

    // Re-focus and set selection
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newCursor;
        textareaRef.current.selectionEnd = newCursor;
      }
    });
  }

  /**
   * Copy everything to the clipboard (original).
   */
  function copyToClipboard() {
    // Convert every single '\' to a double '\\'
    const doubledBackslashes = input.replace(/\\/g, '\\\\');
    navigator.clipboard.writeText(doubledBackslashes).then(() => {
      toast('Copied to clipboard!');
    });
  }

  /**
   * 2nd copy button: Transform each line into
   * { id: <i>, label: '$ <line> $' },
   * and copy the resulting snippet.
   */
  function copyAsJsonFormat() {
    // 1) Convert single backslashes to double backslashes
    const doubled = input.replace(/\\/g, '\\\\');
    // 2) Split by newlines
    const lines = doubled.split(/\r?\n/);

    // 3) Transform each line into the desired snippet
    const snippet = lines
      .map((line, i) => {
        const trimmed = line.trim();
        return `{ id: ${i}, label: '$ ${trimmed} $' },`;
      })
      .join('\n');

    navigator.clipboard.writeText(snippet).then(() => {
      toast('Copied JSON format!');
    });
  }

  // For preview: split into lines so each line is its own KaTeX block
  const previewLines = input.split(/\r?\n/);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6 text-center font-stretch'>
        LaTeX Keyboard
      </h1>

      {/* Two-column grid */}
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Left card: user input */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Expression</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Textarea
              ref={textareaRef}
              value={input}
              onKeyDown={handleKeyDown} // auto-closing parens
              onChange={handleChange} // typed shorthands
              placeholder="Type text or click buttons. Press '(' to auto-close."
              className='w-full h-40'
            />

            <div className='flex flex-wrap gap-2'>
              {LATEX_BUTTONS.map(({ command, label, preview }) => (
                <Button
                  key={command}
                  variant='secondary'
                  onClick={() => insertLatex(command)}
                >
                  <div className='flex items-center space-x-3'>
                    <KatexSpan text={preview} />
                    <span className='tracking-wide'>{label}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className='flex flex-col gap-2'>
              {/* 1) Original copy button */}
              <Button
                variant='outline'
                onClick={copyToClipboard}
                className='w-full'
              >
                <ClipboardCopy className='mr-2 h-4 w-4' />
                Copy Everything
              </Button>

              {/* 2) New copy button with JSON format */}
              <Button
                variant='outline'
                onClick={copyAsJsonFormat}
                className='w-full'
              >
                <ClipboardCopy className='mr-2 h-4 w-4' />
                Copy JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right card: KaTeX preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto space-y-2'>
              {previewLines.map((line, idx) => (
                <KatexSpan key={idx} text={`$${line}$`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
