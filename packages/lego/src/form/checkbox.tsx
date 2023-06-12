import * as Primitive from "@radix-ui/react-checkbox";
import { GrFormCheckmark } from "react-icons/gr";

type Props = Parameters<typeof Primitive.Root>[0] & {
  id: string;
};

export const Checkbox = (props: Props) => {
  return (
    <label className="flex cursor-pointer items-center gap-x-2">
      <Primitive.Root
        {...props}
        className="flex h-4 w-4 items-center justify-center rounded border bg-white dark:border-zinc-500 dark:bg-zinc-600"
      >
        <Primitive.Indicator className="text-main-500">
          <GrFormCheckmark />
        </Primitive.Indicator>
      </Primitive.Root>
      {props.children}
    </label>
  );
};
