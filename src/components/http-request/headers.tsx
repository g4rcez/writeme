import { Input } from "src/components/form/input";
import { Helpers } from "../../lib/helpers";
import React, { useCallback } from "react";
import { Header } from "./curl-parser";

type Props = {
  headers: Header[];
  onChange: (newHeaders: Header[]) => void;
};

export const Headers: React.FC<Props> = ({ headers, onChange }) => {
  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const dataIndex = Number.parseInt(event.target.dataset.index!);
      const path = [dataIndex, "value"];
      onChange(Helpers.set(headers, path, value));
    },
    [headers, onChange]
  );

  return (
    <ul className="http-headers">
      {(headers.length > 0 &&
        headers.map((header, index) => (
          <li key={`header-${header.name}`} className="http-headers-item">
            <label>
              <span className="text-text-text-normal mr-1 italic cursor-text">{header.name}: </span>
              <Input
                className="font-bold text-text-paragraph p-1"
                data-index={index}
                style={{ width: `${header.value.length + 3}ch` }}
                value={header.value}
                onChange={onChangeInput}
              />
            </label>
          </li>
        ))) || (
        <li data-empty="true" className="http-headers-item">
          Request without headers
        </li>
      )}
    </ul>
  );
};
