import { Outlet } from "react-router";
function BlogLayout() {
  return (
    <>
      <div className="w-dvw flex flex-row bg-blue-100/30">
        <div className="flex-auto" />
        <div className="w-8xl flex flex-col">
          <div className="flex flex-row w-8xl rounded-b-xl bg-white/30 py-4">
            <div className="flex-auto" />
            <div className="place-items-center grid">HELLO WORLD</div>
            <div className="flex-auto" />
          </div>
          <div className="flex flex-col-reverse lg:flex-row ">
            <div className="flex ">
              <div className="w-dvw lg:w-[650px] py-10 min-h-dvh px-4 m-0 lg:m-4 bg-white/30 rounded-xl">
                <Outlet />
              </div>
            </div>
            <div className="h-[600px] lg:h-dvh flex lg:flex-col flow-row">
              <div className="flex-auto"></div>
              <div className="w-dvw max-w-[500px] lg:w-[342px] h-[600px] p-[10px] bg-white/30 flex-none rounded-xl text-center grid place-items-center">
                SIDEBAR
              </div>
              <div className="flex-auto"></div>
            </div>
          </div>
          <div className="flex flex-row w-8xl rounded-t-xl bg-white/30 py-4">
            <div className="flex-auto" />
            <div className="grid place-items-center">FOOTER</div>
            <div className="flex-auto" />
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}
export default BlogLayout;
