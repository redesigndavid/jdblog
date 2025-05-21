import React from "react";
import Title from "./Title";
import Tag from "./Tag";
import Moment from "moment";
import { useNavigate } from "react-router";

function GenericPostLayout({ title, tags, posts }) {
  const rest = Object.groupBy(posts, (item) => {
    const date = new Date(item.created_date.slice(0, 23));
    return date.getFullYear();
  });
  const navigate = useNavigate();

  return (
    <>
      <div className="pt-20 xl:w-7xl w-5xl text-stone-900 dark:text-stone-50">
        <Title>{title}</Title>
        <div className="py-5 xl:py-15 min-h-dvh flex flex-col xl:flex-row">
          <div className="py-4 xl:py-0 xl:w-2xs w-5xl hh max-w-dvw flex flex-col gap-4 mx-auto xl:px-0 px-4">
            <div className="flex-row xl:flex-col flex gap-1 flex-wrap">
              <div className="text-lg pb-4 font-black">Top tags</div>
              {tags.slice(0, 10).map((tag) => {
                return <Tag tagname={tag.name} key={`tag-${tag.name}`} />;
              })}
            </div>
          </div>
          <div className="xl:w-3xl w-5xl max-w-dvw leading-8 font-normal xl:px-0 px-4 flex flex-col gap-8 xl:py-0 py-4">
            {Object.keys(rest).map((year) => (
              <div key={`year-${year}`}>
                <div className="xl:px-0 font-extrabold text-2xl line-clamp-1">
                  {year}
                </div>
                <hr className="h-px my-2 border-4 border-slate-400/50 " />
                <div className="flex flex-col gap-0.0 md:gap-0 ">
                  {rest[year].map((post) => (
                    <div
                      key={`post-${post.id}`}
                      onClick={() => {
                        navigate(`/blog/${post.id}`);
                      }}
                      className="xl:flex-nowrap flex flex-col-reverse md:flex-row my-2 text-pretty text-xl cursor-pointer"
                    >
                      {post.title}
                      <div className="flex-auto" />
                      <div className="text-xs md:text-lg ">
                        {Moment(post.created_date.slice(0, 23)).format(
                          "d MMMM, YYYY",
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex-auto" />
        </div>
      </div>
    </>
  );
}

export default GenericPostLayout;
