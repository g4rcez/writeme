import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, VFC } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(function C({ className = "", ...props }, ref) {
  return <input {...props} ref={ref} className={`form-input border p-1 border-gray-300 rounded-md ${className}`} />;
});
