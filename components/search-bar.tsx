import { scrollIfNeeded } from "components";
import { Is } from "lib/is";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState, VFC } from "react";
import { Shortcut } from "./shortcut";
import { useBlockScroll } from "../hooks/use-block-scroll";
import { head, last } from "ramda";

const PolyfillsSearchSelect = () => {
  if (!Element.prototype.scrollSelectIntoView) {
    Element.prototype.scrollSelectIntoView = function (this: HTMLElement, centerIfNeeded?: boolean) {
      scrollIfNeeded(this, centerIfNeeded, true);
    };
  }
};

type ShortcutItemCategory = { name: string; shortcuts: string[][]; target: () => void };

export type ShortcutItem = {
  category: string;
  items: ShortcutItemCategory[];
};

type CategoryItem = { category: string };

type Item = CategoryItem | ShortcutItemCategory;

const isCategoryItem = (a: any): a is CategoryItem => !!a.category;

type SearchBarProps = {
  show: boolean;
  onChange: (show: boolean) => void;
  onOverlayClick?: () => void;
  shortcutList: ShortcutItem[];
};

const mainShortCut = [["Ctrl", "K"]];

const arrows = ["ArrowDown", "ArrowUp"];

const mapItems = (items: ShortcutItem[]): Item[] =>
  items.flatMap((x) => [{ category: x.category }, x.items as never]).flat(1);

const getNodes = (ul: HTMLElement | null) => Array.from(ul?.childNodes ?? []) as HTMLElement[];

const getFirstItemSelect = (ul: HTMLElement[]) => ul.find((li) => !!li.dataset?.select) ?? null;

const isGroup = (children: HTMLElement) => children?.dataset.group === "true";

const getWhileNotGroup = (
  fallback: HTMLElement,
  element: HTMLElement | null,
  mode: "nextSibling" | "previousSibling"
): HTMLElement => {
  if (element === null) return fallback;
  return isGroup(element) ? getWhileNotGroup(fallback, (element[mode] as HTMLElement) ?? null, mode) : element;
};

const modes = (
  ul: HTMLElement[],
  element: HTMLElement | null,
  mode: "previousSibling" | "nextSibling",
  getter: (list: HTMLElement[]) => HTMLElement
): HTMLElement => {
  const indexedItem = getter(ul)!;
  return element === null ? indexedItem : getWhileNotGroup(indexedItem, element[mode] as HTMLElement, mode);
};

const keyEffect = (
  keys: string[],
  pressedKey: string,
  ulNoGroup: HTMLElement[],
  setActive: (s: string) => void,
  current: HTMLElement | null
) => {
  if (!keys.some((x) => x === pressedKey)) {
    return;
  }
  const children =
    pressedKey === "ArrowUp"
      ? modes(ulNoGroup, current, "previousSibling", last)
      : modes(ulNoGroup, current, "nextSibling", head);
  if (children) {
    children.scrollSelectIntoView();
    children.focus();
    const sel = children?.dataset.select ?? "";
    setActive(sel);
  }
};

export const SearchBar: VFC<SearchBarProps> = ({ show, onChange, onOverlayClick, shortcutList }) => {
  useBlockScroll(show);
  const ul = useRef<HTMLUListElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");

  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>(() => mapItems(shortcutList));
  const refs = useMemo(
    () =>
      new Map(
        (mapItems(shortcutList).filter((x) => !isCategoryItem(x)) as ShortcutItemCategory[]).map((x) => [
          x.name,
          x.target,
        ])
      ),
    [shortcutList]
  );
  const unfilteredShortcutList = useRef(shortcutList);

  const searchFromText = useCallback(
    (textToSearch: string) =>
      Is.Empty(textToSearch)
        ? clearSearch()
        : setItems(
            mapItems(
              unfilteredShortcutList.current.reduce<ShortcutItem[]>((acc, info) => {
                const items = info.items.filter((item) => item.name.toLowerCase().includes(textToSearch));
                return Is.Empty(items) ? [...acc, { ...info, items }] : acc;
              }, [])
            )
          ),
    []
  );

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const textToSearch = val.toLowerCase().trim();
      setSearch(val);
      searchFromText(textToSearch);
    },
    [searchFromText]
  );

  const handleEvent = useCallback(
    (target: () => void) => {
      onChange(false);
      target();
    },
    [onChange]
  );

  const clearSearch = () => setItems(mapItems(unfilteredShortcutList.current));

  useEffect(() => {
    if (input.current === null) return;
    if (show) input.current.focus();
  }, [show]);

  const onNextKeyUp = useCallback((e: React.KeyboardEvent) => {
    const pressedKey = e.key;
    const ulNoGroup = getNodes(ul.current).filter((x) => !isGroup(x));
    const children = e.currentTarget as HTMLElement;
    keyEffect(arrows, pressedKey, ulNoGroup, setActive, children);
    if (e.key === "Enter" || e.key === " ") {
      (document.activeElement as HTMLButtonElement).click();
    }
  }, []);

  useEffect(() => {
    try {
      PolyfillsSearchSelect();
    } catch (error) {}
    if (ul.current === null && header.current === null) return;
    let children: HTMLElement | null = null;
    const currentInput = header.current;

    const ulNoGroup = getNodes(ul.current).filter((x) => !isGroup(x));

    const keyup = (e: KeyboardEvent) => {
      const pressedKey = e.key;
      if (pressedKey === "Enter") {
        e.preventDefault();
        children = children ?? getFirstItemSelect(ulNoGroup);
        if (children === null) return;
        const sel = children?.dataset.select ?? "";
        setActive(sel);
        const currentItem = refs.get(sel);
        if (currentItem) handleEvent(currentItem);
      }
      keyEffect(arrows, pressedKey, ulNoGroup, setActive, children);
    };
    const setNullChild = () => (children = null);
    currentInput?.addEventListener("focus", setNullChild);
    currentInput?.addEventListener("keyup", keyup);
    return () => {
      currentInput?.removeEventListener("keyup", keyup);
      currentInput?.removeEventListener("focus", setNullChild);
    };
  }, [handleEvent, items, refs]);

  return (
    <aside hidden={!show} className="wall fixed top-0 left-0 bg-transparent h-screen w-screen z-20">
      <div className="relative flex flex-col items-center">
        <div className="wall-overlay" onClick={onOverlayClick}></div>
        <div className="wall-content-container wall-content-center">
          <header ref={header} className="flex flex-col gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Shortcut keys={mainShortCut} />
              or
              <Shortcut keys={[["ESC"]]} />
              <span className="text-xs">to close</span>
            </div>
            <input
              autoFocus
              className="bg-transparent text-lg outline-none w-full"
              onChange={handleSearch}
              placeholder="What do you need?"
              ref={input}
              value={search}
            />
            <hr className="relative bottom-1" />
          </header>
          <ul className="overflow-y-auto flex flex-col gap-2 h-full" ref={ul}>
            {items.map((item) => {
              if (isCategoryItem(item)) {
                return (
                  <li key={item.category} data-group="true" className="text-xs">
                    {item.category}
                  </li>
                );
              }
              const group = item as ShortcutItemCategory;
              const isActive = group.name === active;
              return (
                <li
                  className={`p-2 ring-transparent outline-none transition-colors duration-300 cursor-pointer ease-linear ${
                    isActive ? "bg-gray-100 border-l-4 border-black font-extrabold" : ""
                  } focus:bg-gray-100 focus:border-l-4 focus:border-black focus:font-extrabold
                  hover:bg-gray-100 hover:bg-border-l-4 hover:border-black hover:font-extrabold`}
                  role="button"
                  tabIndex={0}
                  key={group.name}
                  onKeyUp={onNextKeyUp}
                  data-select={group.name}
                  onClick={() => handleEvent(group.target)}
                >
                  <div className="flex justify-between w-full">
                    {group.name}
                    <Shortcut keys={group.shortcuts} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};
