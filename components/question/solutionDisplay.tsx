type SolutionDisplayProps = {
  selectedOptionIndices: Set<number>;
  correctIndices: number[];
  answer?: string;
};

export const SolutionDisplay = ({
  selectedOptionIndices,
  correctIndices,
  answer,
}: SolutionDisplayProps) => {
  const selectedOptionsArray = Array.from(selectedOptionIndices);

  return (
    <>
      {correctIndices.length === 1 ? (
        <div className='p-2 mb-3 text-gray-800'>
          You selected option {selectedOptionsArray[0] + 1}. The correct answer
          is {correctIndices[0] + 1}
        </div>
      ) : (
        <div className='p-2 mb-3 text-gray-800'>
          You selected options{' '}
          {selectedOptionsArray
            .toSorted()
            .map((index) => index + 1)
            .join(', ')}
          . The correct answers are{' '}
          {correctIndices.map((index) => index + 1).join(', ')}
        </div>
      )}
      {answer && <div className='p-2 mb-3 text-gray-800'>{answer}</div>}
    </>
  );
};
