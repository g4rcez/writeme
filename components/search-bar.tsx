import { scrollIfNeeded } from "components";
import { Is } from "lib/is";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState, VFC } from "react";
import { Shortcut } from "./shortcut";
import { useBlockScroll } from "../hooks/use-block-scroll";

export const PolyfillsSearchSelect = () => {
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

const mapItems = (items: ShortcutItem[]): Item[] =>
  items.flatMap((x) => [{ category: x.category }, x.items as never]).flat(1);

export const SearchBar: VFC<SearchBarProps> = ({ show, onChange, onOverlayClick, shortcutList }) => {
  useBlockScroll(show);
  const ul = useRef<HTMLUListElement>(null);
  const input = useRef<HTMLInputElement>(null);
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
                return items.length > 0 ? [...acc, { ...info, items }] : acc;
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

  useEffect(() => {
    try {
      PolyfillsSearchSelect();
    } catch (error) {}
    if (ul.current === null && input.current === null) return;
    let children: HTMLElement | null = null;
    const currentInput = input.current;

    const isGroup = (children: any) => children?.dataset.group === "true";

    const reassing = (element: HTMLElement, mode: "next" | "prev", fn?: () => void): void => {
      if (isGroup(element) && element !== null) {
        const el = mode === "next" ? (element.nextSibling as HTMLElement) : (element.previousSibling as HTMLElement);
        children = el;
        if (isGroup(el)) {
          return reassing(el, mode, fn);
        }
      }
      if (element === null || children === null) fn?.();
    };
    const keyup = (e: KeyboardEvent) => {
      const acts = {
        ArrowUp: () => {
          children =
            children === null ? (ul.current?.lastChild as HTMLElement) : (children?.previousSibling as HTMLElement);
          reassing(children, "prev", () => reassing(ul.current?.lastChild! as HTMLElement, "prev"));
        },
        ArrowDown: () => {
          children =
            children === null ? (ul.current?.firstChild as HTMLElement) : (children?.nextSibling as HTMLElement);
          reassing(children, "next", () => reassing(ul.current?.firstChild! as HTMLElement, "next"));
        },
      };
      if (e.key === "Enter" && children !== null) {
        e.preventDefault();
        if (ul.current?.childElementCount === 1) children = ul.current.firstChild as HTMLElement;
        reassing(children, "next");
        input.current?.blur();
        const sel = children.dataset.select ?? "";
        setActive(sel);
        const currentItem = refs.get(sel);
        if (currentItem) handleEvent(currentItem);
      }
      if (Is.Keyof(acts, e.key)) {
        e.preventDefault();
        acts[e.key as keyof typeof acts]();
        children?.scrollSelectIntoView();
        children?.focus();
        const sel = children?.dataset.select ?? "";
        setActive(sel);
      }
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
          <header className="flex flex-col gap-3 mb-2">
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
              return (
                <li
                  className={`p-2 transition-colors duration-300 cursor-pointer ease-linear hover:bg-gray-100 ${
                    group.name === active ? "bg-gray-100 border-l-4 border-black font-extrabold" : ""
                  }`}
                  key={group.name}
                  data-select={group.name}
                >
                  <button onClick={() => handleEvent(group.target)} className="flex justify-between w-full">
                    {group.name}
                    <Shortcut keys={group.shortcuts} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};
