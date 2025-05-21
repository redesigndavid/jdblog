import profile from "/dmartephoto.png";
import "./App.css";

function App() {
  return (
    <>
      <div className="pt-32 xl:w-7xl w-5xl flex xl:flex-row min-h-dvh flex-col-reverse max-w-dvw gap-16 xl:gap-0  text-stone-900 dark:text-stone-50">
        <div className="flex flex-col gap-12">
          <div className="px-4 xl:p-0 text-5xl xl:text-8xl font-extrabold font-special">
            Hi, I'm David.
          </div>
          <div className="p-4 xl:p-0 max-w-dvw text-2xl leading-8 w-full xl:w-2xl">
            I'm a design technologist in Atlanta. I like working on the
            front-end of the web. This is my site, Coder's Block, where I blog
            and share whatever side projects I've been working on.
          </div>
        </div>

        <img
          src={profile}
          className="mx-auto rounded-full max-w-[calc(80dvw)] max-h-[calc(80dvw)] h-96 w-96 border border-16 border-slate-500/50 shadow-[0_0px_10px_rgba(0,0,0,0.15)] sepia-50 "
        />
      </div>
    </>
  );
}

export default App;
