import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import { NavigationContext } from "../context/NavigationProvider";

import profile from "/dmartephoto.png";
import { AiFillSun, AiFillMoon } from "react-icons/ai";
import { RxRocket } from "react-icons/rx";
import { LoginContext } from "../context/LoginProvider";

function HeaderLink({ link, name }) {
  const { nav } = useContext(NavigationContext);
  const [currentLink, setCurrentLink] = useState(false);
  useEffect(() => {
    if (link != "/") {
      setCurrentLink(window.location.pathname.startsWith(link));
    } else {
      setCurrentLink(window.location.pathname == "/");
    }
  }, [window.location.pathname]);
  return (
    <div className="h-12  justify-items-center flex flex-col py-5 pr-12 cursor-pointer ">
      <div className="flex-auto" />
      <div
        className={(currentLink && "border-b-4 pb-2") || ""}
        onClick={() => {
          nav(link);
        }}
      >
        {name}
      </div>
      <div className="flex-auto" />
    </div>
  );
}

function Header() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { logOut, loginInfo, isAdmin } = useContext(LoginContext);

  const handleClickDark = () => {
    setIsDarkMode(!isDarkMode);
  };

  const { nav } = useContext(NavigationContext);
  return (
    <>
      <div
        className={
          "flex flex-row w-full py-3 dark:text-white text-dark " +
          (isAdmin && " border-t-4  border-red-500")
        }
      >
        <div className="flex-auto" />
        <div className="flex flex-row w-full xl:w-7xl px-4 xl:px-0">
          <div
            onClick={() => {
              nav("/");
            }}
            className="pt-1 flex-1 m-auto flex flex-row gap-4 cursor-pointer"
          >
            <img className="w-12 h-12 rounded-full hidden" src={profile} />

            <div className="w-12 h-12 rounded-full bg-blue-500 justify-items-center">
              <RxRocket size={24} className="m-auto h-12 w-12 p-3 text-white" />
            </div>
            <div className="my-auto text-xl font-special">
              redesigndavid.com
            </div>
          </div>

          <HeaderLink link="/" name="Home" />
          <HeaderLink link="/blog" name="Blog" />

          <div className="flex flex-row gap-8">
            <div onClick={handleClickDark} className=" py-4 cursor-pointer">
              {isDarkMode ? <AiFillMoon size={28} /> : <AiFillSun size={28} />}
            </div>

            {loginInfo?.access_token && (
              <div onClick={logOut} className=" py-4 cursor-pointer">
                <MdOutlineLogout size={28} />
              </div>
            )}
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}
export default Header;
