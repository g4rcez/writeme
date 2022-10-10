import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function C({ className = "", ...props }, ref) {
  return (
    <fieldset disabled={props.disabled} className="relative h-16 isolate">
      <input
        {...props}
        ref={ref}
        id={props.id ?? props.name}
        className={`input bg-form-bg-input text-form-text-input border p-1 dark:border-zinc-600 border-border-neutral rounded-md absolute bottom-0 ${className}`}
      />
      <label htmlFor={props.id || props.name} className="absolute top-0 cursor-text">
        {props.placeholder}
      </label>
    </fieldset>
  );
});
