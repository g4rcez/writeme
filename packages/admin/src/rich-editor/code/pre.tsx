import dynamic from "next/dynamic";
import { Fragment } from "react";

const map = new Map([["request", dynamic(() => import("./http-request"))]]);
export default function Pre(props: any) {
  const Component = map.get(props.type);
  if (Component === undefined) return <Fragment>null</Fragment>;
  return <Component {...props} />;
}
