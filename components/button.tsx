const Button = ({ label, onClick, handleDisabled, disabled }: any) => {
  return (
    <>
      <button
        type='button'
        disabled={handleDisabled}
        onClick={onClick}
        className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
          disabled
            ? ' bg-gray-200 cursor-not-allowed'
            : 'bg-green-600 hover:opacity-90'
        }`}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
