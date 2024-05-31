import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
}

const Button = ({ label, ...props }: ButtonProps) => {
  return (
    <>
      <button
        type='button'
        className={`text-white font-semibold rounded-full text-sm px-7 py-2.5 me-2 mb-2 ${
          props.disabled
            ? ' bg-gray-200 cursor-not-allowed'
            : 'bg-primaryColor hover:opacity-90'
        }`}
        {...props}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
