import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
}

const Button = ({ label, ...props }: ButtonProps) => {
  return (
    <>
      <button
        type='button'
        className={`motion-button text-white w-full font-semibold rounded-md text-base md:text-sm px-7 py-2.5 mb-2 disabled:transform-none disabled:cursor-not-allowed ${
          props.disabled
            ? ' bg-gray-200'
            : 'bg-primaryColor hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primaryColor focus-visible:ring-offset-2'
        }`}
        {...props}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
