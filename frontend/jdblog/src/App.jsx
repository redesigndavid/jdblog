import profile from "/dmartephoto.png";
import axios from "axios";
import Tag from "./components/Tag";
import PostSections from "./components/PostSections";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState(() => {
    return [];
  });

  const [tags, setTags] = useState(() => {
    return [];
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/post`).then((res) => {
      setPosts(res.data);
      console.log(res.data);
    }, []);
    axios.get(`${import.meta.env.VITE_API_URL}/tag`).then((tags) => {
      setTags(tags.data);
      console.log(tags.data);
    }, []);
  }, []);

  return (
    <>
      <div className="flex flex-col xl:w-7xl w-5xl  text-stone-900 dark:text-stone-50">
        <div className="flex xl:flex-row flex-col-reverse max-w-dvw gap-16 xl:gap-0 ">
          <div className="flex flex-col gap-12 pt-0 xl:pt-32 ">
            <div className="px-4 xl:p-0 text-5xl xl:text-8xl font-extrabold font-special">
              Hi, I'm David.
            </div>
            <div className="p-4 xl:p-0 max-w-dvw text-2xl leading-8 w-full xl:w-2xl">
              I'm an x-ILM Senior Software Engineer. The last 13+ years, I've been working on
              software that artists use while producing your favorite hollywood blockbusters.
              This is my blog, my posts and my thoughts.
            </div>
          </div>
          <img
            src={profile}
            className="mt-5 xl:mt-22 mx-auto rounded-full max-w-[calc(80dvw)] max-h-[calc(80dvw)] h-96 w-96 border border-16 border-slate-500/50 shadow-[0_0px_10px_rgba(0,0,0,0.15)] sepia-50 "
          />
        </div>
        <div className="flex-col flex py-8 xl:flex-row">
          <div className="py-4 xl:py-0 xl:w-2xs w-5xl hh max-w-dvw flex flex-col gap-4 mx-auto xl:px-0 px-4">
            <div className="flex-row xl:flex-col flex gap-1 flex-wrap">
              <div className="text-lg pb-4 font-black">Top tags</div>
              {tags &&
                tags.slice(0, 5).map((tag) => {
                  return <Tag tagname={tag.name} key={`tag-${tag.name}`} />;
                })}
            </div>
          </div>
          <div className="xl:w-3xl w-5xl max-w-dvw leading-8 font-normal xl:px-0 px-4 flex flex-col gap-8 xl:py-0 py-4">
            <PostSections title="Latest posts" posts={posts.slice(0, 5)} />
            <PostSections title="Popular posts" posts={posts.slice(0, 5)} />
          </div>
          <div className="flex-auto" />
        </div>
      </div>
    </>
  );
}

export default App;
