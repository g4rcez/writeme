import React, { PropsWithChildren } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

function Content({ children, ...props }: PropsWithChildren<any>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="bg-black/50 fixed inset-0 z-10" />
      <DialogPrimitive.Content
        {...props}
        className="bg-white dark:bg-zinc-800 fixed rounded-xl left-1/2 top-1/2 translate-1/2 p-8 shadow-xl isolate z-20"
      >
        <DialogPrimitive.Close
          asChild
          className="top-2 right-3 w-6 h-6 inline-flex items-center justify-center absolute link:bg-red-300 link:text-red-600 rounded-full transition-colors"
        >
          <button className="">
            <IoMdClose />
          </button>
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const Dialog = {
  Root: DialogPrimitive.Root,
  Content,
  Title: (props: PropsWithChildren) => (
    <DialogPrimitive.Title className="m-0 font-bold text-main-500 text-3xl leading-loose">
      {props.children}
    </DialogPrimitive.Title>
  ),
  Description: (props: PropsWithChildren) => (
    <DialogPrimitive.Description className="my-2 mb-4 text-sm">{props.children}</DialogPrimitive.Description>
  ),
  Trigger: DialogPrimitive.Trigger,
};
