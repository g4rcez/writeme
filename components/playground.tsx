import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import dracula from "prism-react-renderer/themes/dracula";

type Props = {
  scope: any;
  code?: string;
};

const defaultCode = `function App () {
    return <div><b>Hack the planet</b></div>
}

render(<App />)`;

export const Playground: React.FC<Props> = (props) => {
  return (
    <div className="w-full block p-4">
      <LiveProvider
        noInline
        scope={props.scope}
        theme={dracula}
        code={props.code ?? defaultCode}
      >
        <LiveEditor className="w-full rounded-lg my-4" />
        <LiveError className="mt-4 block w-full p-4 rounded-lg" />
        <LivePreview className="w-full rounded-lg p-5" />
      </LiveProvider>
    </div>
  );
};
