import { useEffect } from "react";
import axios from "axios";

export function track(path) {
  var article_type = null;
  var article_id = null;
  if (path.startsWith("/blog/")) {
    article_type = "post";
    article_id = parseInt(path.slice(6));
  }
  const payload = {
    path: path,
    article_type: article_type,
    article_id: article_id,
  };
  console.log(payload);
  axios.post(`${import.meta.env.VITE_API_URL}/visit`, payload).then((res) => {
    console.log(res.data);
  }, []);
}

function Tracker({ children }) {
  useEffect(() => {
    track(window.location.pathname);
  }, []);

  return <>{children}</>;
}
export default Tracker;
