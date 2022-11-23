import React, { useCallback } from "react";
import { Header } from "./curl-parser";
import { Helpers } from "@writeme/core";
import { Input } from "@writeme/lego";

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
    <ul className="list-inside">
      {(headers.length > 0 &&
        headers.map((header, index) => (
          <li key={`header-${header.name}`} className="my-2 list-none list-item">
            <Input
              className="text-text-paragraph p-1"
              data-index={index}
              placeholder={header.name}
              style={{ width: `${header.value.length + 3}ch` }}
              value={header.value}
              onChange={onChangeInput}
            />
          </li>
        ))) || (
        <li data-empty="true" className="http-headers-item">
          Request without headers
        </li>
      )}
    </ul>
  );
};
