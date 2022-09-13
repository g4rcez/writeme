import { Fragment } from "react";

type ShortcutProps = {
  keys: string[][];
};

export const Shortcut = ({ keys }: ShortcutProps) => (
  <Fragment>
    {keys.map((key, index) => (
      <span key={index} className="shortcut-group">
        {key.map((item, itemIndex) => (
          <span key={itemIndex} className="shortcut">
            {item}
          </span>
        ))}
      </span>
    ))}
  </Fragment>
);
