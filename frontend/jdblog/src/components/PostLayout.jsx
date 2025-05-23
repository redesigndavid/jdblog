"use client";
import TimeAgo from "react-timeago";
import Title from "./Title";
import Tag from "./Tag";
import MD from "./MD";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

import axios from "axios";
import "../hljs.css";

function PostLayout() {
  const { postId } = useParams();
  const [post, setPost] = useState({ text: "" });
  const [comments, setComments] = useState([]);
  const addComment = (comment) => {
    setComments([...comments, ...[comment]]);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/article/post/${postId}`)
      .then((res) => {
        setPost(res.data);
        setComments(res.data.comments);
        document.title = `redesigndavid.com - ${res.data.title}`;
      });
  }, []);

  return (
    <>
      <div className="pt-20 xl:w-7xl w-5xl  text-stone-900 dark:text-stone-50">
        <Title>{post["title"]}</Title>
        <div className="pt-5 xl:py-15 min-h-dvh flex flex-col xl:flex-row">
          <div className="py-4 xl:py-0 xl:w-2xs w-5xl hh max-w-dvw flex flex-col gap-4 xl:px-0 px-4">
            <TimeAgo
              className="text-lg font-black font-sans"
              date={post.created_date}
            />
            <div className="flex-row xl:flex-col flex gap-1">
              {post.tags?.map((tag) => {
                return <Tag tagname={tag.name} key={`tag-${tag.name}`} />;
              })}
            </div>
          </div>
          <MD>{post.text}</MD>
          <div className="flex-auto" />
        </div>

        <div className="py-15 min-h-dvh flex flex-col xl:flex-row ">
          <div className="xl:w-2xs w-5xl" />
          <div className="xl:w-3xl w-5xl max-w-dvw  xl:px-0 px-4">
            <div className="text-4xl py-4">Discussion</div>
            {comments?.map((comment) => {
              return (
                <Comment key={`comment-${comment.id}`} comment={comment} />
              );
            })}
            <CommentForm postId={post["id"]} addComment={addComment} />
          </div>
          <div className="flex-auto" />
        </div>
      </div>
    </>
  );
}

export default PostLayout;
