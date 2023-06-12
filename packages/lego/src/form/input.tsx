import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, PropsWithRef, Ref } from "react";
import { Types } from "@writeme/core";

export type InputProps<T extends {}> = Types.Hide<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "name" | "id"
> &
  Partial<{ name: keyof T; id: keyof T; ref: Ref<HTMLInputElement> }>;

export const Input: <T extends {}>(props: PropsWithRef<InputProps<T>>) => JSX.Element = forwardRef<
  HTMLInputElement,
  InputProps<{}>
>(function InnerInput({ className = "", ...props }, externalRef) {
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
        className={`input bg-form-bg-input text-form-text-input border-border absolute bottom-0 w-full rounded-md border p-1 dark:border-zinc-600 ${className}`}
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
