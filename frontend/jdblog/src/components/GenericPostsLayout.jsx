import React from "react";
import Title from "./Title";
import Tag from "./Tag";
import PostSections from "./PostSections";

function GenericPostLayout({ title, tags, posts }) {
  const rest = Object.groupBy(posts, (item) => {
    const date = new Date(item.created_date.slice(0, 23));
    return date.getFullYear();
  });

  return (
    <>
      <div className={(title && "pt-20 ") + "xl:w-7xl w-5xl text-stone-900 dark:text-stone-50"}>
        {title && <Title>{title}</Title>} 
        <div className="py-5 xl:py-15 min-h-dvh flex flex-col xl:flex-row">
          <div className="py-4 xl:py-0 xl:w-2xs w-5xl hh max-w-dvw flex flex-col gap-4 mx-auto xl:px-0 px-4">
            <div className="flex-row xl:flex-col flex gap-1 flex-wrap">
              <div className="text-lg xl:pb-4 xl:pr-0 pr-2 pb-0 my-auto font-black items-center justify-center ">Tags</div>
              {tags && tags.slice(0, 10).map((tag) => {
                return <Tag tagname={tag.name} key={`tag-${tag.name}`} />;
              })}
            </div>
          </div>
          <div className="xl:w-3xl w-5xl max-w-dvw leading-8 font-normal xl:px-0 px-4 flex flex-col gap-8 xl:py-0 py-4">
            {Object.keys(rest).map((year) => (
              <PostSections key={`year-${year}`} title={year} posts={rest[year]}/>
            ))}
          </div>
          <div className="flex-auto" />
        </div>
      </div>
    </>
  );
}

export default GenericPostLayout;
