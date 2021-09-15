import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
//@ts-ignore
import theme from "@g4rcez/prism-react-renderer/themes/dracula";

type Props = {
  scope: any;
  code?: string;
};

const defaultCode = `const App = () => (
    <div><b>Hack the planet</b></div>
);

render(<App />)`;

export const Playground: React.FC<Props> = (props) => {
  return (
    <div className="w-full block my-4">
      <LiveProvider noInline scope={props.scope} theme={theme} code={props.code ?? defaultCode}>
        <LiveEditor className="w-full rounded-lg mb-2" />
        <LiveError className="mt-2 mb-4 block w-full p-1 rounded-lg text-red-500" />
        <LivePreview className="w-full rounded-lg border p-1" />
      </LiveProvider>
    </div>
  );
};
