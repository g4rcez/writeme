import { DetailedHTMLProps, InputHTMLAttributes, VFC } from "react";

export const Input: VFC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`border p-1 border-gray-300 rounded-md ${className}`}
  />
);
