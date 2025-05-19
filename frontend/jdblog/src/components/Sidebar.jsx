import { useContext } from "react";
import { SidebarShowContext } from "../context/SidebarShowProvider";

function Sidebar() {
  const { showSidebar } = useContext(SidebarShowContext);
  return (
    <>
      <div
        className={
          (showSidebar ? "" : "max-xl:hidden max-xl:opacity-0") +
          " xl:h-[600px] xl:h-dvh xl:flex flex-col "
        }
      >
        <div className="flex-auto"></div>
        <div className="w-full xl:w-[342px] xl:h-[600px] bg-green-300 text-black dark:text-white ">
          <div className="p-[10px] relative w-full h-full flex-none rounded-xl text-center grid place-items-center  ">
            SIDEBAR
          </div>
        </div>
        <div className="flex-auto"></div>
      </div>
    </>
  );
}
export default Sidebar;
