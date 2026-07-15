import KatexSpan from './katexSpan';

interface PromptProps {
  value: string;
}

const Prompt: React.FC<PromptProps> = ({
  value = 'Replace this with a question.',
}) => {
  return (
    <div className='flex flex-col sm:gap-72 self-center mb-6 text-xl leading-8'>
      {/* Centered like every other set's prompt; the measure cap (~65ch)
          keeps long prose passages (Set R) legible while short
          logic-formula prompts never reach it. */}
      <div className='max-w-prose text-gray-900'>
        <KatexSpan text={value} />
      </div>
    </div>
  );
};

export default Prompt;
