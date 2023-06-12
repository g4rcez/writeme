import React, { PropsWithChildren } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

function Content({ children, ...props }: PropsWithChildren<any>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-10 bg-black/50" />
      <DialogPrimitive.Content
        {...props}
        className="translate-1/2 fixed left-1/2 top-1/2 isolate z-20 rounded-xl bg-white p-8 shadow-xl dark:bg-zinc-800"
      >
        <DialogPrimitive.Close
          asChild
          className="link:bg-red-300 link:text-red-600 absolute right-3 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors"
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
    <DialogPrimitive.Title className="text-main-500 m-0 text-3xl font-bold leading-loose">
      {props.children}
    </DialogPrimitive.Title>
  ),
  Description: (props: PropsWithChildren) => (
    <DialogPrimitive.Description className="my-2 mb-4 text-sm">{props.children}</DialogPrimitive.Description>
  ),
  Trigger: DialogPrimitive.Trigger,
};
