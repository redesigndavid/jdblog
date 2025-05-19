import { useContext } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import SidebarShowProvider from "../context/SidebarShowProvider";

function BlogLayout() {
  return (
    <>
      <div className="w-dvw flex flex-row ">
        <div className="flex-auto" />
        <div className="w-full xl:w-7xl flex flex-col-reverse xl:flex-row ">
          <div className="w-full xl:w-4xl py-10 min-h-dvh px-4 m-0 xl:m-4 rounded-xl">
            <Outlet />
          </div>
          <Sidebar />
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}
export default BlogLayout;
