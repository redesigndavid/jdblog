import { useEffect, useState, useContext } from "react";

import { API } from "/requester";

function Image(props) {
  const { node, src, ...imgprops } = props;
  const [imageUrl, setImageUrl] = useState(src);

  useEffect(() => {
    API.get(`static\?path\=${props.src}`, null, false).then((r) => {
      setImageUrl(r.data);
    });
  }, []);
  return (
    <>
      <img src={imageUrl} {...imgprops} />
    </>
  );
}
export default Image;
