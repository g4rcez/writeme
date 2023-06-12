import { TableOfContent } from "@writeme/markdown/src";

export const SideToc = () => (
  <aside className="min-x-[192px] relative hidden w-64 lg:block">
    <div className="min-x-[192px] fixed right-0 top-24 h-screen max-h-screen w-64 overflow-y-auto px-8">
      <h3 className="text-sm font-semibold">Content of page</h3>
      <TableOfContent observeHash className="text-sm" />
    </div>
  </aside>
);
