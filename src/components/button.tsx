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

export const Button = ({ theme = "primary", ...props }: Props) => {
  const disabled = props.disabled || props.loading;
  return (
    <button {...props} data-theme={theme} disabled={disabled} className={`button ${props.className ?? ""}`}></button>
  );
};
