"use client";
import TimeAgo from "react-timeago";
import Title from "./Title";
import Tag from "./Tag";
import MD from "./MD";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

import axios from "axios";
import "../hljs.css";

function PostLayout() {
  const { postId } = useParams();
  const [post, setPost] = useState(() => {
    return { text: "" };
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/post/${postId}`).then((res) => {
      setPost(res.data);
    });
  }, []);

  return (
    <>
      <div className="pt-20 xl:w-7xl w-5xl  text-stone-900 dark:text-stone-50">
        <Title>{post["title"]}</Title>
        <div className="py-5 xl:py-15 min-h-dvh flex flex-col xl:flex-row">
          <div className="py-4 xl:py-0 xl:w-2xs w-5xl hh max-w-dvw flex flex-col gap-4 mx-auto xl:px-0 px-4">
            <TimeAgo
              className="text-lg font-black font-sans"
              date={post.created_date}
            />
            <div className="flex-row xl:flex-col flex gap-1">
              {post.tags?.map((tag) => {
                return <Tag tagname={tag.name} key={`tag-${tag.name}`}/>;
              })}
            </div>
          </div>
          <MD>{post["text"]}</MD>
          <div className="flex-auto" />
        </div>
      </div>
    </>
  );
}

export default PostLayout;
