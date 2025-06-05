import { AiFillSun, AiFillMoon } from "react-icons/ai";
import { useState } from "react";

import { usePageContext } from "vike-react/usePageContext";

function LightDarkButton(props) {
  const pageContext = usePageContext();
  const { setDarkMode } = pageContext.globalContext;
  const [isDarkMode, setIsDarkMode] = useState(() =>
    JSON.parse(localStorage.getItem("darkmode")),
  );
  const handleClickDark = () => {
    setDarkMode(!isDarkMode);
    setIsDarkMode(!isDarkMode);
  };
  return (
    <>
      <div onClick={handleClickDark} className=" cursor-pointer">
        {isDarkMode ? <AiFillMoon size={28} /> : <AiFillSun size={28} />}
      </div>
    </>
  );
}
export default LightDarkButton;
