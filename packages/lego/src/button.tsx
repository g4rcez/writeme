import { ButtonHTMLAttributes } from "react";

const themes = {
  primary: "primary",
  secondary: "secondary",
  loading: "loading",
} as const;

type Props = React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  loading?: boolean;
  theme?: keyof typeof themes;
};

export const Button = ({ theme = "primary", loading, ...props }: Props) => {
  const disabled = props.disabled || loading;
  return (
    <button
      {...props}
      data-theme={theme}
      disabled={disabled}
      className={`bg-primary link:bg-primary-subtle min-w-[100px] rounded-lg border px-4 py-1.5 text-sm text-white transition-colors duration-300 ease-in-out ${
        props.className ?? ""
      }`}
    ></button>
  );
};
