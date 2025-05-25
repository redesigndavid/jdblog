import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import { NavigationContext } from "../context/NavigationProvider";
import { AA } from "../Tracker";

import profile from "/dmartephoto.png";
import { AiFillGithub, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { AiFillSun, AiFillMoon } from "react-icons/ai";
import { RxRocket } from "react-icons/rx";
import { LoginContext } from "../context/LoginProvider";

function HeaderLink({ link, name, adminColor = false }) {
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
    <div
      className={
        "h-12 justify-items-center flex flex-col py-5 cursor-pointer " +
        (adminColor && " text-red-500 ")
      }
    >
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

  const blog_post_regex = /^\/blog\/\d+$/gm;
  return (
    <>
      <div
        className={
          "flex flex-row w-full py-3 dark:text-white text-dark " +
          (isAdmin && " border-t-4  border-red-500")
        }
      >
        <div className="flex-auto" />
        <div className="w-full xl:w-7xl pl-4 pr-8 xl:px-0 flex-row flex ">
          <div
            onClick={() => {
              nav("/");
            }}
            className="pt-1 flex-1 m-auto flex flex-row gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 justify-items-center">
              <RxRocket size={24} className="m-auto h-12 w-12 p-3 text-white" />
            </div>
            <div className="my-auto text-xl font-special hidden md:inline-block">
              redesigndavid.com
            </div>
          </div>

          <div className="flex flex-row gap-8 justify-around">
            <HeaderLink link="/" name="Home" />
            <HeaderLink link="/blog" name="Blog" />
            {blog_post_regex.test(window.location.pathname) && isAdmin && (
              <HeaderLink
                link={window.location.pathname + "/edit"}
                name="Edit"
                adminColor
              />
            )}
            {isAdmin && (
              <HeaderLink link="/blog/new/edit" name="New Post" adminColor />
            )}
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}
export default Header;
