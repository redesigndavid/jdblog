import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { NavigationContext } from "./context/NavigationProvider";

export function track(path, referrer, url) {

  var article_type = null;
  var article_id = null;
  if (path && path.startsWith("/blog/")) {
    article_type = "post";
    article_id = parseInt(path.slice(6));
  }
  const payload = {
    path: path,
    referrer: referrer,
    url: url,
    article_type: article_type,
    article_id: article_id,
  };

  axios.post(`${import.meta.env.VITE_API_URL}/visit`, payload)
}

export function AA(props) {
  const [visitCount, setVisitCount] = useState(0);
  const { noVisits, href, ...new_props } = props;
  const { jump, nav } = useContext(NavigationContext);

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/visit/count?url=${href}`)
      .then((res) => {
        setVisitCount(res.data);
      }, []);
  }, []);
  const aJump = () => {
    if (href.startsWith(window.location.origin)) {
      nav(href.slice(window.location.origin.length));
    } else {
      jump(href);
    }
  };

  return (
    <>
      <span className="cursor-pointer">
        <a onClick={aJump} {...new_props} />
        {!noVisits && (
          <span className="rounded-xs inline-block ml-1 pb-1 align-text-top text-xs bg-amber-200 text-black px-1 ">
            {visitCount}
          </span>
        )}
      </span>
    </>
  );
}

function Tracker({ children }) {
  useEffect(() => {
    track(window.location.pathname, document.referrer, window.location.href);
  }, []);

  return <>{children}</>;
}
export default Tracker;
