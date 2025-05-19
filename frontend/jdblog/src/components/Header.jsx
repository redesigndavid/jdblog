import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { SidebarShowContext } from "../context/SidebarShowProvider";

import profile from "/dmartephoto.png";
import {
  AiFillSun,
  AiFillMoon,
  AiOutlineMenu,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";
import { RxRocket } from "react-icons/rx";

function Header({sidebar}) {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { showSidebar, setSidebar } = useContext(SidebarShowContext);

  const handleClickDark = () => {
    setIsDarkMode(!isDarkMode);
  };
  const handleClickSidebar = () => {
    setSidebar(!showSidebar);
  };

  return (
    <>
      <div className="flex flex-row w-full py-4 ">
        <div className="flex-auto" />
        <div className="flex flex-row px-5 w-full xl:w-7xl">
          <a href="/" className="pt-1 flex-1 dark:text-slate-300 text-xl text-slate-700  m-auto pl-0 xl:pl-4 flex flex-row gap-4">
            <img className="w-12 h-12 rounded-full hidden" src={profile} />

            <div className="w-12 h-12 rounded-full bg-blue-500 justify-items-center">
              <RxRocket size={24} className="m-auto h-12 w-12 p-3 text-white"/>
            </div>
            <div className="align-middle my-auto text-3xl invisible xs:visible">
              <span className="font-extralight">David Marte</span>
            </div>
          </a>
          <div className="flex flex-row gap-4">
            <a
              onClick={handleClickDark}
              className="dark:text-white text-dark py-4"
            >
              {isDarkMode ? <AiFillMoon size={28} /> : <AiFillSun size={28} />}
            </a>

            <a
              href="https://linkedin.com/in/redesigndavid"
              className="dark:text-white text-dark py-4"
            >
              <AiFillLinkedin size={28} />
            </a>
            <a
              href="https://www.instagram.com/redesigndavid"
              className="dark:text-white text-dark py-4"
            >
              <AiFillInstagram size={28} />
            </a>
            <a
              href="https://github.com/redesigndavid"
              className="dark:text-white text-dark py-4"
            >
              <AiFillGithub size={28} />
            </a>
            <a
              onClick={handleClickSidebar}
              className={"dark:text-white text-dark py-4 xl:hidden " + (sidebar ? "" : "hidden")}
            >
              <AiOutlineMenu size={28} />
            </a>
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}
export default Header;
