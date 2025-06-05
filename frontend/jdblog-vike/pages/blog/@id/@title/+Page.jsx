export default Page;
import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useData } from "vike-react/useData";

import Title from "@components/Title";
import Tag from "@components/Tag";
import { clientOnly } from "vike-react/clientOnly";

const CommentClientOnly = clientOnly(() => import("@components/Comment"));

const CommentFormClientOnly = clientOnly(
  () => import("@components/CommentForm"),
);

const MDClientOnly = clientOnly(() => import("@components/MD"));
const TimeAgoClientOnly = clientOnly(() => import("react-timeago"));

function correctTime(datetime) {
  return new Date(
    new Date(datetime).toString().slice(0, 25) + " UTC",
  ).toString();
}

function Page() {
  const pageContext = usePageContext();
  const { tags, post, title } = pageContext.data;
  const [comments, setComments] = useState(pageContext.data.comments);

  const addComment = (comment) => {
    setComments([...comments, ...[comment]]);
  };

  // inside a ui component
  const data = useData();

  return (
    <>
      <div className="pt-20 xl:w-7xl w-5xl  text-stone-900 dark:text-stone-50">
        <Title>{post["title"]}</Title>
        <div className="pt-5 xl:py-15 flex flex-col xl:flex-row">
          <div className="py-4 xl:py-0 xl:w-2xs w-5xl hh max-w-dvw flex flex-col gap-4 xl:px-0 px-4">
            <TimeAgoClientOnly
              className="text-lg font-black font-sans"
              date={correctTime(post.created_date)}
            />

            <div className="flex-row xl:flex-col flex gap-1 flex-wrap">
              {post.tags?.map((tag) => {
                return <Tag tagname={tag.name} key={`tag-${tag.name}`} />;
              })}
            </div>
          </div>

          <div className="xl:w-3xl w-5xl max-w-dvw ">
            <MDClientOnly
              fallback={
                <div className="text-black dark:text-white text-xs">
                  {post.text.split("\n").map((item, idx) => {
                    return (
                      <span key={idx}>
                        {item}
                        <br />
                      </span>
                    );
                  })}
                </div>
              }
            >
              {post.text}
            </MDClientOnly>
          </div>
          <div className="flex-auto" />
        </div>

        <div className="py-15 flex flex-col xl:flex-row ">
          <div className="xl:w-2xs w-5xl" />
          <div className="xl:w-3xl w-5xl max-w-dvw  xl:px-0 px-4">
            <div className="text-4xl py-4">Discussion</div>

            {comments
              .sort((a, b) => {
                return Date.parse(a.created_date) - Date.parse(b.created_date);
              })
              ?.map((comment) => {
                return (
                  <CommentClientOnly
                    key={`comment-${comment.id}`}
                    comment={comment}
                    fallback={<div />}
                  />
                );
              })}

            <CommentFormClientOnly
              kind={"post"}
              articleId={post["id"]}
              addComment={addComment}
              isLoggedIn={pageContext.globalContext.isLoggedIn}
            />
          </div>
          <div className="flex-auto" />
        </div>
      </div>
    </>
  );
}
