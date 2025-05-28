import { ApiContext } from "../context/ApiProvider";
import { useEffect, useState, useContext } from "react";
function Image(props) {
  const { src, ...imgprops } = props;
  const [imageUrl, setImageUrl] = useState(src);
  const { requester } = useContext(ApiContext);
  useEffect(() => {
    requester("get", `image\?path\=${props.src}`, null, false, (r) => {
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
