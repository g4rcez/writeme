import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function __Input({ className = "", ...props }, externalRef) {
  return (
    <fieldset
      form={props.form}
      disabled={props.disabled}
      className={`relative ${props.placeholder ? "h-16" : "h-8"} isolate w-full`}
    >
      <input
        {...props}
        ref={externalRef}
        id={props.id ?? props.name}
        className={`input w-full bg-form-bg-input text-form-text-input border p-1 dark:border-zinc-600 border-border-neutral rounded-md absolute bottom-0 ${className}`}
      />
      <label htmlFor={props.id || props.name} aria-disabled={props.disabled} className="absolute top-2 cursor-text text-sm">
        {props.placeholder}
      </label>
    </fieldset>
  );
});
