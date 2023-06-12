import { forwardRef, useRef } from "react";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  platform,
  size,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useListNavigation,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { usePrevious } from "../hooks/use-previous";
import fzf from "fuzzy-search";
import { Types } from "@writeme/core";
import useReducer from "use-typed-reducer";

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
}

const Item = forwardRef<HTMLLIElement, ItemProps & React.HTMLProps<HTMLLIElement>>(
  ({ children, active, ...rest }, ref) => {
    const id = useId();
    return (
      <li
        {...rest}
        ref={ref}
        role="option"
        id={id}
        aria-selected={active}
        data-active={active}
        style={rest.style}
        className="data-[active=true]:bg-primary-subtle p-2 data-[active=true]:text-white"
      >
        {children}
      </li>
    );
  }
);

export type Option = string;

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  options: string[];
  onChangeOption?: (name: string, option: Option) => void;
};

const transitionStyles = {
  duration: 250,
  open: { transform: "scaleY(1)", opacity: 1 },
  close: { transform: "scaleY(0)", opacity: 0 },
  initial: { transform: "scaleY(0)", opacity: 0.2 },
} as const;

const initialState = {
  value: "",
  shadow: "",
  open: false,
  index: null as Types.Nullable<number>,
};

type State = typeof initialState;

const reducers = {
  toggleOpen: (open: boolean) => (state: State) => ({ ...state, open }),
  close: () => (state: State) => ({ ...state, open: false, index: null }),
  shadow: (shadow: string) => (state: State) => ({ ...state, shadow }),
  value: (value: string) => (state: State) => ({ ...state, value }),
  navigate: (n: Types.Nullable<number>, previousIndex: Types.Nullable<number>, options: Option[]) => (state: State) => {
    const lastIndex = options.length - 1;
    if (n === null && previousIndex === 0) return { ...state, index: lastIndex };
    if (n === null && previousIndex === lastIndex) return { ...state, index: 0 };
    const i = n ?? previousIndex ?? null;
    return { ...state, index: i === null ? state.index : i };
  },
};

const fuzzyOptions = { caseSensitive: false, sort: false };

export const Select = ({ options, onChangeOption, ...props }: Props) => {
  const [state, dispatch] = useReducer(initialState, reducers);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, x, y, strategy, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open: state.open,
    placement: "bottom",
    platform: platform,
    onOpenChange: dispatch.toggleOpen,
    middleware: [
      size({
        padding: 10,
        apply: (x) =>
          void Object.assign(x.elements.floating.style, {
            width: `${x.rects.reference.width}px`,
            maxHeight: `${Math.min(360, x.availableHeight)}px`,
          }),
      }),
    ],
  });
  const transitions = useTransitionStyles(context, transitionStyles);
  const previousIndex = usePrevious(state.index);

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    activeIndex: state.index,
    allowEscape: true,
    focusItemOnOpen: "auto",
    listRef,
    loop: true,
    openOnArrowKeyDown: true,
    scrollItemIntoView: true,
    selectedIndex: state.index,
    virtual: true,
    onNavigate: (n) => dispatch.navigate(n, previousIndex, items),
  });

  const id = props.name ?? props.id!;

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav]);

  const onChangeValue = (value: string) => {
    dispatch.value(value);
    onChangeOption?.(id, value);
  };

  const items = new fzf(options, ["value"], fuzzyOptions).search(state.shadow);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => dispatch.shadow(event.target.value);

  return (
    <fieldset className="inline-flex w-auto flex-col gap-1" disabled={props.disabled} aria-disabled={props.disabled}>
      <label className="cursor-text text-sm" htmlFor={id}>
        {props.placeholder}
      </label>
      <input
        {...getReferenceProps({
          ...props,
          id,
          name: id,
          ref: refs.setReference,
          onChange,
          onFocus: () => dispatch.toggleOpen(true),
          value: state.value,
          onKeyDown(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              if (state.index !== null && items[state.index]) {
                onChangeValue(items[state.index]);
                dispatch.close();
              } else if (items.length === 1) {
                onChangeValue(items[0]);
                dispatch.close();
              }
            }
          },
        })}
        className="rounded-lg border p-2"
      />
      <FloatingPortal>
        {state.open ? (
          <FloatingFocusManager
            closeOnFocusOut
            modal
            returnFocus
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
            guards
          >
            <ul
              {...getFloatingProps({
                ref: refs.setFloating,
                style: { ...transitions.styles, position: strategy, left: x, top: y, ...floatingStyles },
              })}
              className="bg-display text-title w-full origin-[top_center] overflow-auto overflow-y-auto rounded-xl border font-medium shadow-2xl [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl"
            >
              {items.map((item, i) => (
                <Item
                  {...getItemProps({
                    key: item,
                    ref: (node) => void (listRef.current[i] = node),
                    onClick() {
                      dispatch.close();
                      onChangeValue(item);
                    },
                  })}
                  active={i === state.index}
                >
                  {item}
                </Item>
              ))}
            </ul>
          </FloatingFocusManager>
        ) : null}
      </FloatingPortal>
    </fieldset>
  );
};
