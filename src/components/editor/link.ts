import { ViewPlugin, EditorView, Decoration, DecorationSet, WidgetType, ViewUpdate } from "@codemirror/view";
import { Extension, Range } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

const pathStr = `<svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z"/></svg>`;

type HyperLinkState = {
  from: number;
  to: number;
  url: string;
};

class Link extends WidgetType {
  private readonly state: HyperLinkState;

  constructor(from: number, to: number, url: string) {
    super();
    this.state = { from, to, url };
  }

  public eq(other: Link) {
    return (
      this.state.url === other.state.url && this.state.to === other.state.to && this.state.from === other.state.from
    );
  }

  public toDOM() {
    const wrapper = document.createElement("a");
    wrapper.href = this.state.url;
    wrapper.target = "__blank";
    wrapper.innerHTML = pathStr;
    wrapper.className = "cm-hyper-link-icon";
    return wrapper;
  }

  public ignoreEvent() {
    return false;
  }
}

const extension = (view: EditorView) => {
  const widgets: Array<Range<Decoration>> = [];
  const addWidget = (widget: Decoration, to: number) => {
    const exist = widgets.some((x) => {
      const pathDecoration = widget.spec.widget.state.url;
      const pathRange = x.value.spec.widget.state.url;
      return pathRange === pathDecoration;
    });
    if (!exist) widgets.push(widget.range(to));
  };
  for (const range of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from: range.from,
      to: range.to,
      enter: ({ type, node, from, to }) => {
        const text: string = view.state.doc.sliceString(from, to);
        if (type.name === "URL") {
          const link = new Link(from, to, text);
          addWidget(Decoration.widget({ widget: link, side: 1 }), to);
        }
      },
    });
  }
  return Decoration.set(widgets);
};

class HyperLinkView {
  decorations: DecorationSet;

  public constructor(view: EditorView) {
    this.decorations = extension(view);
  }

  public update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = extension(update.view);
    }
  }
}

const hyperLinkExtension = () => ViewPlugin.fromClass(HyperLinkView, { decorations: (v) => v.decorations });

const style = EditorView.baseTheme({
  ".cm-hyper-link-icon": {
    display: "inline-block",
    verticalAlign: "middle",
    marginLeft: "0.2ch",
  },
  ".cm-hyper-link-icon svg": {
    display: "block",
  },
});

export const links: Extension = [hyperLinkExtension(), style];
