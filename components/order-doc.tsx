import React, { Fragment } from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";

export type Metadata = {
  title: string;
  description: string;
  project: string;
  repository: string;
  order: number;
  sidebar: number;
  tags: string[];
  section: string;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
  link: string;
  next: Metadata | null;
  prev: Metadata | null;
};

type Extra = {
  direction: "next" | "prev";
};

export const OrderDoc: React.FC<Metadata & Extra> = (props) => {
  return (
    <aside className="order-doc previous-doc w-full max-w-sm break-words whitespace-pre-wrap flex flex-row justify-between items-end gap-x-4 gap-y-4">
      {props.direction === "prev" && <BsChevronDoubleLeft />}
      <div className="w-full block">
        <h3 className="font-extrabold">{props.title}</h3>
        <p>{props.description}</p>
      </div>
      {props.direction === "next" && <BsChevronDoubleRight />}
    </aside>
  );
};
