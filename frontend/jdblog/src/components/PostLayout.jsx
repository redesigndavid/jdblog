"use client";

import { useForm } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginProvider";
import TimeAgo from "react-timeago";
import Title from "./Title";
import Tag from "./Tag";
import MD from "./MD";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useParams } from "react-router";

import axios from "axios";
import "../hljs.css";

function EditPost() {
  const { watch, getValues, register, handleSubmit, setValue } = useForm();


  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const { postId } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/article/post/${postId}`, {text, title})
      .then((res) => {
        setValue("text", res.data.text);
        setValue("title", res.data.title);
      });
  }, []);

  const update = () => {
    setText(getValues("text"));
    setTitle(getValues("title"));
  };

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
    setTimeout(update, 100);
    });
    return () => unsubscribe();
  }, [watch]);

  const { loginInfo } = useContext(LoginContext);

  const onSubmit = (data) => {
    console.log(data);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/article/post/${postId}`,
        {
          text: text,
          title: title,
        },
        { headers: { Authorization: `Bearer ${loginInfo.access_token}` } },
      )

  };

  return (
    <>
      <div className="w-dvw flex flex-row ">
        <div className="p-4 bg-stone-900 w-full">
          <div className="pt-20 w-3xl  text-stone-900 dark:text-stone-50 ">
            <Title>{title}</Title>
            <div className="pt-5  flex flex-col">
              <div className="w-2xl max-w-3xl">
                <MD>{text}</MD>
              </div>
              <div className="flex-auto" />
            </div>
          </div>
        </div>
        <div className="p-4 bg-yellow-50 w-[50dvw] fixed top-0 right-0 h-dvh">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-black pt-4 pb-2">Title</div>
            <input
              {...register("title", { required: true })}
              placeholder="Title"
              className={
                "flex-grow text-white bg-stone-800 appearance-none rounded " +
                "w-full p-2 leading-tight focus:outline-none "
              }
            />

            <div className="text-black pt-4 pb-2">Body</div>
            <textarea
              {...register("text", { required: true })}
              placeholder="Post Text"
              className={
                "h-full flex-grow text-white bg-stone-800 appearance-none rounded " +
                "w-full p-2 leading-tight focus:outline-none min-h-[30rem]"
              }
            />
            <input type="submit" value="Save" className="p-4 bg-stone-950 text-white"/>
          </form>
        </div>
      </div>
    </>
  );
}

function PostEditTab({ children }) {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      <div
        className="w-full h-4 bg-green-400 fixed top-0 z-50"
        onClick={() => {
          setShowEdit(!showEdit);
        }}
      />
      {(showEdit && (
        <div className="absolute w-dvw top-0">
          <EditPost />
        </div>
      )) ||
        children}
    </>
  );
}
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
      <PostEditTab>
        <div className="pt-20 xl:w-7xl w-5xl  text-stone-900 dark:text-stone-50">
          <Title>{post["title"]}</Title>
          <div className="pt-5 xl:py-15 flex flex-col xl:flex-row">
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

            <div className="xl:w-3xl w-5xl max-w-dvw ">
              <MD>{post.text}</MD>
            </div>
            <div className="flex-auto" />
          </div>

          <div className="py-15 flex flex-col xl:flex-row ">
            <div className="xl:w-2xs w-5xl" />
            <div className="xl:w-3xl w-5xl max-w-dvw  xl:px-0 px-4">
              <div className="text-4xl py-4">Discussion</div>
              {comments?.map((comment) => {
                return (
                  <Comment key={`comment-${comment.id}`} comment={comment} />
                );
              })}
              <CommentForm
                kind={"post"}
                articleId={post["id"]}
                addComment={addComment}
              />
            </div>
            <div className="flex-auto" />
          </div>
        </div>
      </PostEditTab>
    </>
  );
}

export default PostLayout;
