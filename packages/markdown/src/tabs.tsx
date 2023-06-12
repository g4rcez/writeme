import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

type fallback = (overTop: number, overBottom: number, parent: HTMLElement, parentBorderTopWidth: number) => void;

declare global {
  interface Element {
    scrollIntoTab: (this: HTMLElement, bool?: boolean, callback?: fallback) => void;
    scrollSelectIntoView: (this: HTMLElement, bool?: boolean) => void;
  }
}

// https://gist.github.com/hsablonniere/2581101
export function scrollIfNeeded(element: HTMLElement, centerIfNeeded?: boolean, scrollTop?: boolean) {
  centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

  var parent = element.parentNode! as HTMLElement,
    parentComputedStyle = window.getComputedStyle(parent, null),
    parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue("border-top-width")),
    parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue("border-left-width")),
    overTop = element.offsetTop - parent.offsetTop < parent.scrollTop,
    overBottom =
      element.offsetTop - parent.offsetTop + element.clientHeight - parentBorderTopWidth >
      parent.scrollTop + parent.clientHeight,
    overLeft = element.offsetLeft - parent.offsetLeft < parent.scrollLeft,
    overRight =
      element.offsetLeft - parent.offsetLeft + element.clientWidth - parentBorderLeftWidth >
      parent.scrollLeft + parent.clientWidth,
    alignWithTop = overTop && !overBottom;

  if (scrollTop) {
    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop =
        element.offsetTop -
        parent.offsetTop -
        parent.clientHeight / 2 -
        parentBorderTopWidth +
        element.clientHeight / 2;
    }
  }

  if ((overLeft || overRight) && centerIfNeeded) {
    parent.scrollLeft =
      element.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + element.clientWidth / 2;
  }

  if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
    element.scrollIntoView(alignWithTop);
  }
}

const PolyfillsTab = () => {
  if (!Element.prototype.scrollIntoTab) {
    Element.prototype.scrollIntoTab = function (this: HTMLElement, centerIfNeeded?: boolean) {
      scrollIfNeeded(this, centerIfNeeded, false);
    };
  }
};

type TabProps = {
  id: string;
  title: React.ReactNode;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  children: any;
};

export const Tab: React.FC<TabProps> = (props) => (
  <li
    role="tab link"
    id={props.id}
    aria-selected={props.isActive ? "true" : "false"}
    onClick={props.onClick}
    className="m-0 flex flex-shrink-0 flex-grow-0 px-4 outline-none focus:outline-none"
  >
    <button
      role="link"
      type="button"
      className={`relative m-0 cursor-pointer bg-transparent px-4 outline-none focus:outline-none ${
        props.isActive ? "text-main-500 font-extrabold tracking-wide" : ""
      }`}
    >
      {props.title ?? props.id}
    </button>
  </li>
);

type TabsProps = {
  default?: string;
};

const calculateWidthSize = (ul: HTMLUListElement, id: string) => {
  let sum = 0;
  let elementIndex = -1;
  const list = ul.querySelectorAll("li");

  list.forEach((x, i) => {
    if (x.id === id) {
      elementIndex = i;
    } else if (elementIndex === -1) {
      sum += x.getBoundingClientRect().width;
    }
  });
  return sum;
};

export const Tabs = (props: PropsWithChildren<TabsProps>) => {
  const inkBar = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLUListElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(
    () => props.default || (React.Children.toArray(props.children)[0] as any)?.props.id
  );

  useEffect(() => {
    try {
      PolyfillsTab();
    } catch (error) {}
    if (inkBar.current === null || header.current === null) return;
    const ul = header.current;
    const div = inkBar.current;
    const current = ul.querySelector(`#${active}`) as HTMLElement;
    if (current && current.scrollIntoTab) {
      current.scrollIntoTab();
      const boundClient = calculateWidthSize(ul, active);
      div.style.width = `${current.getBoundingClientRect().width}px`;
      div.style.left = `${boundClient}px`;
    }
  }, [active]);

  const onTabClick = useCallback((i: string) => () => setActive(i), []);

  const children = (React.Children.toArray(props.children).find((x: any) => x.props.id === active) as any)?.props
    ?.children;

  return (
    <div className="my-4 block w-full">
      <header className="tab-container relative flex w-full flex-nowrap overflow-x-auto border-b border-slate-300 pb-2">
        <ul ref={header} className="tab-container m-0 inline-flex list-none flex-nowrap p-0 text-base" role="tablist">
          {React.Children.map(props.children, (x: any) => {
            if (x === null) return null;
            const tabProps: TabProps = x.props;
            const isActive = active === tabProps.id;
            return <Tab {...tabProps} onClick={onTabClick(tabProps.id)} isActive={isActive} key={`${x}-li-tabs`} />;
          })}
        </ul>
        <div ref={inkBar} className="inkbar" />
      </header>
      <section className="mt-2 block w-full" ref={container}>
        {children}
      </section>
    </div>
  );
};
