import { autocompletion, Completion, CompletionContext } from "@codemirror/autocomplete";

type AutoCompleteAction = (context: CompletionContext) => Promise<Completion[]>;

export const autoComplete = (fn?: AutoCompleteAction) =>
  autocompletion({
    closeOnBlur: true,
    selectOnOpen: true,
    icons: true,
    override: [
      async (context: CompletionContext) => {
        let word = context.matchBefore(/[:@](\w+)?/);
        if (!word) return null;
        if (word.from === word.to && !context.explicit) {
          return null;
        }
        const options: Completion[] = (await fn?.(context)) ?? [];
        return {
          from: word.from,
          options: [{ label: "@Writeme", type: "css" }].concat(options as never),
        };
      },
    ],
  });
