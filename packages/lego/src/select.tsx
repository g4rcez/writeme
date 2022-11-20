import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

type Props = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export const Select = ({ className = "", ...props }: Props) => (
  <select
    {...props}
    className={`select bg-form-bg-input text-form-text-input block form-select mt-1 rounded-md border-border-neutral shadow-sm focus:border-main-dim focus:ring focus:ring-main-dim focus:ring-opacity-50 ${className}`}
  />
);
