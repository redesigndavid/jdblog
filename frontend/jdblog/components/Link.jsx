import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { API } from "/requester";

export default function Link(props) {
  const [visitCount, setVisitCount] = useState(0);
  const { newTab, noVisits, href, ...new_props } = props;
  const pageContext = usePageContext();
  const { track } = pageContext.globalContext;

  useEffect(() => {
    API.post(`/visit/count?url=${href}`).then((res) => {
      setVisitCount(res.data);
    });
  }, []);

  const aJump = () => {
    if (pageContext.isClientSide) {
      if (href.startsWith(window.location.origin)) {
        track(
          href.slice(window.location.origin.length),
          window.location.href,
          href,
        );
        navigate(href.slice(window.location.origin.length));
      } else if (newTab) {
        track("", window.location.href, href);
        window.open(href, "_blank").focus();
      } else {
        track("", window.location.href, href);
        window.open(href);
      }
      navigate(href);
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <span className="cursor-pointer">
        <a onClick={aJump} {...new_props} />
        {!noVisits && (
          <span className="rounded-xs inline-block ml-1 pb-0.5 mb-1.0 align-text-top text-xs bg-amber-200 text-black px-1 ">
            {visitCount}
          </span>
        )}
      </span>
    </>
  );
}
