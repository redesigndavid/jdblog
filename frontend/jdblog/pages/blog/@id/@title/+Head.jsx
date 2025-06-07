import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
export function Head() {

  const data = useData();
  const pageContext = usePageContext();

  return (
    <>
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={(data.post.excerpt || data.post.text || data.title).slice(0, 159)}/>
      <meta property="og:url" content={pageContext.urlOriginal} />
      <meta property="og:image" content={data.post.image || "http://redesigndavid.com/dmartephoto.jpg"} />
    </>
  );
}
