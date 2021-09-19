import React, { useCallback, useEffect, useRef, useState } from "react";
import { Shortcut } from "./shortcut";
export type ShortcutItem = {
  category: string;
  items: Array<{ name: string; shortcuts: string[][]; target: () => void }>;
};

type SearchBarProps = {
  show: boolean;
  onChange?: (show: boolean) => void;
  onOverlayClick?: () => void;
  shortcutList: ShortcutItem[];
};

export const SearchBar: React.VFC<SearchBarProps> = ({ show, onChange, onOverlayClick, shortcutList }) => {
  const [search, setSearch] = useState("");
  const [filteredShortcutList, setFilteredShortcutList] = useState<ShortcutItem[]>(shortcutList);
  const unfilteredShortcutList = useRef(shortcutList);

  const handleSearch = useCallback((textToSearch: string) => {
    if (textToSearch) {
      const newList = unfilteredShortcutList.current
        .map((info) => {
          const items = info.items.filter((item) => item.name.toLowerCase().includes(textToSearch));

          if (items.length > 0) {
            return {
              ...info,
              items,
            };
          }

          return undefined!;
        })
        .filter(Boolean);

      setFilteredShortcutList(newList);
    } else {
      clearSearch();
    }
  }, []);

  const handleEvent = (target: Function) => {
    onChange?.(false);
    target();
  };

  useEffect(() => {
    handleSearch(search);
  }, [handleSearch, search]);

  const clearSearch = () => {
    setFilteredShortcutList(unfilteredShortcutList.current);
  };

  if (!show) return null;

  return (
    <div className="wall fixed top-0 left-0 bg-transparent h-screen w-screen z-20">
      <div className="wall-overlay" onClick={onOverlayClick}></div>
      <div className="wall-content-container wall-content-center">
        <header className="flex flex-col gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Shortcut keys={[["Ctrl", "K"]]} />
            <span className="text-xs">to close</span>
          </div>
          <div>
            <input
              className="bg-transparent text-lg outline-none w-full"
              type="text"
              placeholder="What do you need?"
              onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
              autoFocus
            />
          </div>
          <hr className="relative bottom-1" />
        </header>
        <ul className="overflow-y-auto flex flex-col gap-2 h-full">
          {filteredShortcutList.map((info) => (
            <li key={info.category}>
              <span className="text-xs">{info.category}</span>
              <ul>
                {info.items.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-md p-2 transition-colors duration-200 cursor-pointer ease-linear hover:bg-gray-200 hover:bg-opacity-75"
                  >
                    <a onClick={() => handleEvent(item.target)} className="flex justify-between">
                      {item.name}

                      <Shortcut keys={item.shortcuts} />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
