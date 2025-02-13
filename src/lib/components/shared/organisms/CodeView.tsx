import SyntaxHighlighter from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeView: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="border rounded-none text-white text-sm border border-gray-200">
      <SyntaxHighlighter language="typescript" style={vs} wrapLongLines>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeView;
