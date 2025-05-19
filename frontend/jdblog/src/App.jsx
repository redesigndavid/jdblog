import profile from "/dmartephoto.png";
import "./App.css";

function App() {

  return (
    <>
      <div className="w-dvw pt-26">
        <div className="flex flex-col xl:flex-row m-auto gap-14 xl:h-dvh">
          <div className="flex-1" />
          <img
            src={profile}
            className="mx-auto rounded-full max-w-[calc(80dvw)] max-h-[calc(80dvw)] h-96 w-96 border border-16 border-slate-500/50 shadow-[0_0px_10px_rgba(0,0,0,0.15)] sepia-50 hue-rotate-0"
          />
          <div className="mx-auto max-w-dvw w-[48rem] gap-4 h-64 dark:text-slate-50 text-slate-700 flex flex-col px-2 py-8 ">
            <div className="text-md font-extralight tracking-wide opacity-80">
              Software Engineer
            </div>
            <h1 className="text-5xl font-extrabold ">David Marte</h1>
            <div className="leading-8">
              Multi-disciplinary software engineer with over a decade of
              experience in Python application development, visual eﬀects
              workflow automation, and cross-platform systems.
            </div>
            <div className="flex flex-row pt-4 gap-4">
              <div className="bg-blue-500 rounded-full px-12 py-3.5 text-sm text-white">
                Download CV
              </div>
              <div className="bg-blue-500 rounded-full px-12 py-3.5 text-sm text-white">
                Contact
              </div>
              <div className="flex-auto" />
            </div>
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </>
  );
}

export default App;
