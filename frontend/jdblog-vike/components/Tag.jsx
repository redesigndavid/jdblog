import { usePageContext } from "vike-react/usePageContext";

export function TagDiv(props) {
  const {
    tagname,
    className = "bg-amber-200 line-clamp-1 rounded-full p-3 pr-4 flex flex-row ",
    ...rest
  } = props;
  return (
    <>
      <div {...rest} className={className}>
        <span className="text-emerald-400 p-0">#</span>
        <div className="">{tagname}</div>
      </div>
    </>
  );
}

function Tag({ tagname }) {
  const pageContext = usePageContext();
  const { track } = pageContext.globalContext;

  return (
    <>
      <a
        href={`/tag/${tagname}`}
        className="flex flex-row text-black cursor-pointer"
      >
        <TagDiv tagname={tagname} />
        <div className="flex-auto" />
      </a>
    </>
  );
}

export default Tag;
