export const QuestionHeader = ({
  questionIndexToShow,
}: {
  questionIndexToShow: number;
}) => (
  <>
    <h3 className='mb-2 text-xl font-bold tracking-tight text-gray-900'>
      {questionIndexToShow + 1}.
    </h3>
  </>
);
