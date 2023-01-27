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
      className={`button px-3 py-2.5 my-0 leading-3 text-sm rounded-lg transition-colors duration-500 ease-in-out font-medium min-w-[150px] border text-base ${
        props.className ?? ""
      }`}
    ></button>
  );
};
