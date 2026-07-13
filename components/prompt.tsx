import KatexSpan from './katexSpan';

interface PromptProps {
  value: string;
}

const Prompt: React.FC<PromptProps> = ({
  value = 'Replace this with a question.',
}) => {
  return (
    <div className='flex flex-col sm:gap-72 self-center mb-6 text-xl leading-8'>
      <div className='text-gray-900'>
        <KatexSpan text={value} />
      </div>
    </div>
  );
};

export default Prompt;
