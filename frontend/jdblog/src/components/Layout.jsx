import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      <div className="w-dvw flex flex-row">
        <div className="flex-auto" />
        <Outlet />
        <div className="flex-auto" />
      </div>
      <Footer />
    </>
  );
}
export default Layout;
