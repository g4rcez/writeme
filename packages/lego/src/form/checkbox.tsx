import * as Primitive from "@radix-ui/react-checkbox";
import { GrFormCheckmark } from "react-icons/gr";

type Props = Parameters<typeof Primitive.Root>[0] & {
  id: string;
};

export const Checkbox = (props: Props) => {
  return (
    <label className="flex items-center gap-x-2 cursor-pointer">
      <Primitive.Root
        {...props}
        className="bg-white dark:bg-zinc-600 w-4 h-4 rounded flex items-center justify-center border dark:border-zinc-500"
      >
        <Primitive.Indicator className="text-main-500">
          <GrFormCheckmark />
        </Primitive.Indicator>
      </Primitive.Root>
      {props.children}
    </label>
  );
};
