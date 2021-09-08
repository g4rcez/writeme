import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export const Select: React.FC<DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>> = ({
  className = "",
  ...props
}) => (
  <select
    {...props}
    className={`block form-select mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}
  />
);
