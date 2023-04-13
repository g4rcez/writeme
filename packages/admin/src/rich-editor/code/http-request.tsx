import { curl } from "@writeme/markdown";
import { Fragment, useMemo } from "react";
import { Button, Select } from "@writeme/lego";
import { Strings } from "@writeme/core";
import { SimpleEditor } from "../../editor/simple-editor";
import { Tab, Tabs } from "@writeme/markdown/src";
import { FaTrashAlt } from "react-icons/fa";

type KeyPairProps = {
  items: Array<{ name: string; value: string }>;
  name: string;
  id: string;
};

const KeyPair = ({ items, id, name }: KeyPairProps) => {
  return (
    <Fragment>
      {items.map((x) => (
        <div className="flex flex-nowrap gap-4 mb-2 items-center" key={`${name}-${x.name}-${x.value}-${id}`}>
          <div className="w-1/4">
            <SimpleEditor text={x.name} />
          </div>
          <SimpleEditor text={x.value} />
          <button>
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </Fragment>
  );
};

const httpMethods = ["GET", "POST", "PATCH", "PUT", "DELETE", "HEAD", "OPTIONS"];

type Props = {
  code: string;
  lang: string;
  type: "request";
};

export default function HttpRequest(props: Props) {
  const id = useMemo(() => Strings.uuid(), []);
  const request = useMemo(() => curl(props.code), [props.code]);

  if (request === null) return null;

  return (
    <section className="w-full">
      <header className="flex flex-nowrap gap-2 items-center">
        <Select value={request.method}>
          {httpMethods.map((x) => (
            <option key={`edit-http-method-${x}-${id}`} value={x}>
              {x}
            </option>
          ))}
        </Select>
        <SimpleEditor text={request.url.trim()} />
        <Button className="w-fit">Preview</Button>
      </header>
      <section className="mt-4">
        <Tabs>
          <Tab id="headers" title="Headers">
            <KeyPair items={request.headers} name="headers" id={id} />
          </Tab>
          <Tab id="cookies" title="Cookies">
            <KeyPair items={request.cookies} name="cookies" id={id} />
          </Tab>
        </Tabs>
      </section>
      <section>{request.method !== "GET" && <SimpleEditor text={request.body?.toString() ?? ""} />}</section>
    </section>
  );
}
