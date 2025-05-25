import { AiFillGithub, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";

import { LoginContext } from "../context/LoginProvider";
import { MdOutlineLogout } from "react-icons/md";
import { AiFillSun, AiFillMoon } from "react-icons/ai";
import { FaRegCopyright } from "react-icons/fa";
import { AA } from "../Tracker";

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
function Footer() {
  const handleClickDark = () => {
    setIsDarkMode(!isDarkMode);
  };

  const { logOut, isLoggedIn, isAdmin } = useContext(LoginContext);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  return (
    <>
      <div className="flex flex-row w-full rounded-t-xl pt-12 pb-4">
        <div className="flex-auto" />
        <div className="flex flex-col">
          <div className="flex flex-row justify-center items-center gap-2 dark:text-white text-dark pb-8">
            <AA noVisits href="https://github.com/redesigndavid">
              <AiFillGithub size={28} />
            </AA>

            <AA noVisits href="https://linkedin.com/in/redesigndavid">
              <AiFillLinkedin size={28} />
            </AA>

            <AA noVisits href="https://www.instagram.com/redesigndavid">
              <AiFillInstagram size={28} />
            </AA>

            <div className="h-14 border-l-2"/>

            <div onClick={handleClickDark} className=" cursor-pointer">
              {isDarkMode ? <AiFillMoon size={28} /> : <AiFillSun size={28} />}
            </div>
            {isLoggedIn && (
              <div onClick={logOut} className="py-4 cursor-pointer">
                <MdOutlineLogout size={28} />
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center items-center gap-2 dark:text-white text-dark pb-4">
            <FaRegCopyright className="m-auto" />{" "}
            <div className="m-auto align-middle">
              2025 David Marte. All Rights Reserved.
            </div>
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}

export default Footer;
