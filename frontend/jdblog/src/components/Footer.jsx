import { AiFillGithub, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { FaRegCopyright } from "react-icons/fa";
import { AA } from "../Tracker";

function Footer() {
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
