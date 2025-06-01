import React, { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight from "react-highlight";
import rehypeRaw from "rehype-raw";
import { AA } from "../Tracker";
import Image from "./Image";
import mermaid from "mermaid";

import "../hljs.css";

function Mermaid(props) {

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "forest",
      securityLevel: "loose",
      fontFamily: "monospace",
    });

    mermaid.contentLoaded();
  }, []);

  return (
    <div className="mermaid flex flex-row justify-center text-white bg-stone-500 rounded-xl p-4">
      {props.chart.replaceAll("—", "--")}
    </div>
  );
}

const FlattenPre = (props) => {
  const pretype = (<WrapHighlight />).type;
  const { children, restProps } = props;

  if (React.isValidElement(children) && children.type === pretype) {
    return <>{children}</>;
  }

  // Default fallback
  return <pre className="p-1">{children}</pre>;
};

const WrapHighlight = (props) => {
  if (props.node.children[0].position) {
    return (
      <code className="bg-amber-200/40 dark:bg-amber-800/40 before:ml-0.5 before:text-red-500 before:content-[''] after:ml-0.5 after:text-red-500 after:content-[''] rounded-xl p-1">
        {props.children}
      </code>
    );
  }
  if (props.className == "language-mermaid") {
    return <Mermaid chart={props.children} />;
  }

  return <Highlight {...props} />;
};

function MD({ children }) {
  return (
    <>
      <div className="leading-8 prose prose-xl prose-pre:p-2 prose-pre:font-[Victor_Mono] prose-pre:text-md font-normal dark:prose-invert prose-a:text-emerald-500 xl:px-0 px-4">
        <Markdown
          components={{
            code: WrapHighlight,
            pre: FlattenPre,
            a: AA,
            img: Image,
          }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {children.replaceAll("--", "—")}
        </Markdown>
      </div>
    </>
  );
}
export default MD;
