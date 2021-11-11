import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export const Input = forwardRef<HTMLInputElement, InputProps>(function C({ className = "", ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={`form-input bg-form-bg-input text-form-text-input border p-1 border-border-neutral rounded-md ${className}`}
    />
  );
});
