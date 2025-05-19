import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import SidebarShowProvider from "../context/SidebarShowProvider";

function Layout({sidebar}) {
  return (
    <>
      <SidebarShowProvider>
        <Header sidebar={sidebar}/>
        <div className="w-full min-h-dvh">
        <Outlet />
        </div>
        <Footer />
      </SidebarShowProvider>
    </>
  );
}
export default Layout;
