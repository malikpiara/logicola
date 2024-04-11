import { cn } from '@/lib/utils';

type ButtonProps = React.HTMLProps<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      type='button'
      className={cn(
        'text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-green-600 hover:opacity-90 disabled:bg-gray-200 disabled:cursor-not-allowed',
        props.className
      )}
    />
  );
};

export default Button;
