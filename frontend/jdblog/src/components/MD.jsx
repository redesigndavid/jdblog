import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight from "react-highlight";
import rehypeRaw from "rehype-raw";
import { AA } from "../Tracker";

const FlattenPre = ({ children }) => {
  const pretype = (<Highlight />).type;
  if (React.isValidElement(children) && children.type === pretype) {
    return <>{children}</>;
  }
  // Default fallback
  return <pre>{children}</pre>;
};

function MD({ children }) {
  return (
    <>
      <div className="leading-8 prose prose-xl prose-pre:font-[Victor_Mono] prose-pre:text-md font-normal dark:prose-invert prose-a:text-emerald-500 xl:px-0 px-4">
        <Markdown
          components={{ code: Highlight, pre: FlattenPre, a: AA }}
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
