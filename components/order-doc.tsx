import Link from "next/link";
import React from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";

export type Metadata = {
  title: string;
  description: string;
  section: string;
  repository: string;
  order: number;
  sidebar: number;
  tags: string[];
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

export const OrderDoc: React.FC<Metadata & Extra> = (props) => (
  <aside className="order-doc previous-doc w-full max-w-sm break-words whitespace-pre-wrap justify-between items-end gap-x-4 gap-y-4">
    <Link href={props.link} passHref>
      <a href="">
        <div className={`w-full block mb-2 ${props.direction === "next" ? "text-right" : ""}`}>
          <h3 className="font-extrabold">{props.title}</h3>
        </div>
        {props.direction === "prev" && (
          <p className="w-full text-left font-extrabold text-blue-400">
            <BsChevronDoubleLeft className="inline-block text mb-1 mr-1" />
            Previous
          </p>
        )}
        {props.direction === "next" && (
          <p className="w-full text-right font-extrabold text-blue-400">
            Next
            <BsChevronDoubleRight className="inline-block mb-1 ml-1" />
          </p>
        )}
      </a>
    </Link>
  </aside>
);
