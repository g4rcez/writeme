import { Input } from "src/components/form/input";
import { Is } from "src/lib/is";
import { Strings } from "src/lib/strings";
import { assocPath } from "ramda";
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";

const getKeys = <T extends object>(obj: T) => Object.entries(obj).map((x) => ({ key: x[0], value: x[1] }));

type FieldProps = {
  item: { key: string; value: string | number };
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Type = ({ children }: PropsWithChildren) => (
  <small className="italic font-thin text-text-slight">{children}</small>
);

const Field: React.FC<FieldProps> = ({ item: x, onChangeInput }) => {
  const firstPrototype = useRef(Is.Prototype(x.value));
  return (
    <section className="http-body-field">
      <label>
        <span className="cursor-text w-fit">
          <span className="font-extrabold">{x.key}</span> <Type>{firstPrototype.current}</Type>
        </span>
        <Input
          style={{ width: `${x.value.toString().length + 3}ch` }}
          type={firstPrototype.current === "Number" ? "number" : "text"}
          value={x.value}
          onChange={onChangeInput}
          className="block"
          name={x.key}
        />
      </label>
    </section>
  );
};

type Props = {
  text?: string;
  onChange: (newRequestObject: any) => void;
  parentPath?: string[];
  parentIsArray?: boolean;
  index?: number;
  originalRef?: any;
};

const BodyRecursive: React.VFC<Props> = ({ parentPath = [], onChange, parentIsArray, ...props }) => {
  const uuid = useRef(Strings.uuid());

  const [body, setBody] = useState(() => {
    const txt = props.text ?? "";
    return Is.Json(txt) ? JSON.parse(txt) : {};
  });

  useEffect(() => {
    setBody(() => {
      const txt = props.text ?? "";
      return Is.Json(txt) ? JSON.parse(txt) : {};
    });
  }, [props.text]);

  const index = useMemo(() => (props.index === undefined ? 0 : props.index + 1), [props.index]);

  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const asNumber = event.target.valueAsNumber;
      const value = Number.isNaN(asNumber) ? event.target.value : asNumber;
      const name = event.target.name;
      const path = [...parentPath, name].map((x) => {
        const n = Number.parseInt(x, 10);
        return Number.isNaN(n) ? x : n;
      });
      const newRequest = assocPath(path, value, props.originalRef);
      onChange(newRequest);
    },
    [parentPath, props.originalRef, onChange]
  );

  const objectKeys = useMemo(() => getKeys(body), [body]);

  return (
    <section className="http-body">
      {objectKeys.map((x) => {
        if (Array.isArray(x.value)) {
          return (
            <div className="w-full my-1 http-body-array" key={`body-section-${x.key}-${uuid.current}`}>
              <b>{x.key} </b>
              <Type>Array</Type>
              <div className="http-body-array-item">
                <BodyRecursive
                  index={index}
                  onChange={onChange}
                  parentIsArray
                  parentPath={[...parentPath, x.key]}
                  text={JSON.stringify(x.value)}
                  originalRef={props.originalRef}
                />
              </div>
            </div>
          );
        }
        if (typeof x.value === "object") {
          return (
            <BodyRecursive
              key={`body-section-${x.key}-${uuid.current}`}
              onChange={onChange}
              parentIsArray={parentIsArray}
              parentPath={[...parentPath, x.key]}
              text={JSON.stringify(x.value)}
              originalRef={props.originalRef}
            />
          );
        }
        return <Field item={x} key={`body-section-${x.key}-${uuid.current}`} onChangeInput={onChangeInput} />;
      })}
    </section>
  );
};

export const Body: React.FC<Props> = (props) => {
  const body = useMemo(() => {
    const txt = props.text ?? "";
    return Is.Json(txt) ? JSON.parse(txt) : {};
  }, [props.text]);

  return <BodyRecursive {...props} originalRef={body} />;
};
