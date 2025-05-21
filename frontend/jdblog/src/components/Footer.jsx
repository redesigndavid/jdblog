import { FaRegCopyright } from "react-icons/fa";
function Footer() {
  return (
    <>
      <div className="flex flex-row w-full rounded-t-xl pt-12 pb-4">
        <div className="flex-auto" />
        <div className="grid place-items-center">
          <div className="flex flex-row align-middle gap-2 dark:text-white text-dark ">
            <FaRegCopyright className="m-auto"/> <div className="m-auto align-middle">2025 David Marte. All Rights Reserved.</div>
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}

export default Footer;
