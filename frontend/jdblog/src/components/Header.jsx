import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";

import { useNavigate } from "react-router";

import profile from "/dmartephoto.png";
import {
  AiFillSun,
  AiFillMoon,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";
import { RxRocket } from "react-icons/rx";
import { LoginContext } from "../context/LoginProvider";

function Header() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { logOut, loginInfo } = useContext(LoginContext);

  const handleClickDark = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-row w-full py-3 dark:text-white text-dark">
        <div className="flex-auto" />
        <div className="flex flex-row w-full xl:w-7xl px-4 xl:px-0">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="pt-1 flex-1 m-auto flex flex-row gap-4 cursor-pointer"
          >
            <img className="w-12 h-12 rounded-full hidden" src={profile} />

            <div className="w-12 h-12 rounded-full bg-blue-500 justify-items-center">
              <RxRocket size={24} className="m-auto h-12 w-12 p-3 text-white" />
            </div>
          </div>

          <div className="h-12  justify-items-center flex flex-col py-5 px-8 cursor-pointer">
            <div className="flex-auto" />
            <div
              onClick={() => {
                navigate("/blog");
              }}
            >
              Blog
            </div>
            <div className="flex-auto" />
          </div>

          <div className="flex flex-row gap-4">
            <div onClick={handleClickDark} className=" py-4 cursor-pointer">
              {isDarkMode ? <AiFillMoon size={28} /> : <AiFillSun size={28} />}
            </div>

            {loginInfo && loginInfo["username"] ? (
              <a onClick={logOut} className="dark:text-white text-dark py-4 cursor-pointer">
                <MdOutlineLogout size={28} />
              </a>
            ) : (
              <a
                href="http://127.0.0.1:8000/login/google?redirect=http://localhost:5173"
                className="dark:text-white text-dark py-4"
              >
                <MdOutlineLogin size={28} />
              </a>
            )}

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
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}
export default Header;
