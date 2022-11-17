import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

type Props = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export const Select = ({ className = "", ...props }: Props) => (
  <select {...props} className={`select bg-form-bg-input text-form-text-input ${className}`} />
);
