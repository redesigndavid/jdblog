import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight from "react-highlight";

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
      <div className="xl:w-3xl w-5xl bb max-w-dvw leading-8 prose prose-xl prose-pre:font-[Victor_Mono] prose-pre:text-md font-normal dark:prose-invert prose-a:text-emerald-500 xl:px-0 px-4">
        <Markdown
          components={{ code: Highlight, pre: FlattenPre }}
          remarkPlugins={[remarkGfm]}
        >
          {children}
        </Markdown>
      </div>
    </>
  );
}
export default MD;
