import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, PropsWithoutRef } from "react";
import { Types } from "@writeme/core";

export type InputProps<T extends {}> = Types.Hide<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "name" | "id"
> &
  Partial<{ name: keyof T; id: keyof T }>;

<<<<<<< HEAD
export const Input = forwardRef<HTMLInputElement, InputProps>(function __Input({ className = "", ...props }, externalRef) {
=======
export const Input: <T extends {}>(props: PropsWithoutRef<InputProps<T>>) => JSX.Element = forwardRef<
  HTMLInputElement,
  InputProps<{}>
>(function InnerInput({ className = "", ...props }, ref) {
>>>>>>> ae0f519 (wip)
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
      <label
        htmlFor={props.id || props.name}
        aria-disabled={props.disabled}
        className="absolute top-2 cursor-text text-sm"
      >
        {props.placeholder}
      </label>
    </fieldset>
  );
}) as any;
