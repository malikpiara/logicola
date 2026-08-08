import KatexSpan from './katexSpan';

interface PromptProps {
  value: string;
}

/**
 * The question prompt. Sized in `cqw`, not `vw` — the card's width is
 * what the guide pane resizes and what phones narrow, so the container
 * is the only honest reference (`.qcontainer` in the quiz shell sets
 * `container-type: inline-size`). The measure cap (~65ch) keeps long
 * prose passages (Set R) legible while short logic-formula prompts
 * never reach it.
 */
const Prompt: React.FC<PromptProps> = ({
  value = 'Replace this with a question.',
}) => {
  return (
    <div className='qprompt self-center max-w-prose'>
      <KatexSpan text={value} />
    </div>
  );
};

export default Prompt;
