import { cn } from '@/lib/utils';

type ButtonProps = React.HTMLProps<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      type='button'
      className={cn(
        'mb-2 me-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200',
        props.className
      )}
    />
  );
};

export default Button;
