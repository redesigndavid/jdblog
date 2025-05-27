import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight from "react-highlight";
import rehypeRaw from "rehype-raw";
import { AA } from "../Tracker";
import "../hljs.css";

const FlattenPre = (props) => {
  const pretype = (<WrapHighlight />).type;
  const { children, restProps } = props;

  if (React.isValidElement(children) && children.type === pretype) {
    return <>{children}</>;
  }

  // Default fallback
  return <pre>{children}</pre>;
};
const BigP = ({ children }) => {
  return <div>{children}</div>;
};

const WrapHighlight = (props) => {
  if (props.node.children[0].position) {
    return <code className="bg-amber-200 dark:bg-amber-800 before:ml-0.5 before:text-red-500 before:content-['`'] after:ml-0.5 after:text-red-500 after:content-['`'] rounded-xl p-1">{props.children}</code>;
  }
  return <Highlight {...props} />;
};

function MD({ children }) {
  return (
    <>
      <div className="leading-8 prose prose-xl prose-pre:font-[Victor_Mono] prose-pre:text-md font-normal dark:prose-invert prose-a:text-emerald-500 xl:px-0 px-4">
        <Markdown
          components={{ code: WrapHighlight, pre: FlattenPre, a: AA, p: BigP }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {children}
        </Markdown>
      </div>
    </>
  );
}
export default MD;
