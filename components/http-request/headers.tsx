import { Input } from "components/input";
import { assocPath } from "ramda";
import React, { useCallback } from "react";
import { Header } from "./curl-parser";

type Props = {
  headers: Header[];
  onChange: (newHeaders: Header[]) => void;
};

export const Headers: React.VFC<Props> = ({ headers, onChange }) => {
  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const dataIndex = Number.parseInt(event.target.dataset.index!);
      const path = [dataIndex, "value"];
      const newHeaders = assocPath(path, value, headers);
      onChange(newHeaders);
    },
    [headers, onChange]
  );

  return (
    <ul className="list-inside">
      {(headers.length > 0 &&
        headers.map((header, index) => (
          <li
            key={`header-${header.name}`}
            className="my-2 list-none list-item"
          >
            <label>
              <span className="text-gray-500 mr-1 italic cursor-text">
                {header.name}:{" "}
              </span>
              <Input
                className="font-bold text-gray-600 p-1"
                data-index={index}
                style={{ width: `${header.value.length + 3}ch` }}
                value={header.value}
                onChange={onChangeInput}
              />
            </label>
          </li>
        ))) || (
        <li className="font-bold text-gray-200 text-sm">
          Request without headers
        </li>
      )}
    </ul>
  );
};
