interface PromptProps {
  value: string;
}

const Prompt: React.FC<PromptProps> = ({
  value = 'Replace this with a question.',
}) => {
  return (
    <div className='mb-6 flex flex-col self-center text-lg sm:gap-72'>
      <div className='text-gray-800'>{value}</div>
    </div>
  );
};

export default Prompt;
