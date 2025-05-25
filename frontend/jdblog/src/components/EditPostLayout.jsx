"use client";

import { useForm } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginProvider";
import { NavigationContext } from "../context/NavigationProvider";
import { TagDiv } from "./Tag";
import Title from "./Title";
import MD from "./MD";
import { useParams } from "react-router";

import { ApiContext } from "../context/ApiProvider";

function EditPostLayout() {
  const { requester } = useContext(ApiContext);
  const { watch, getValues, register, handleSubmit, setValue } = useForm();

  const [published, setPublished] = useState(false);
  const [postTags, setPostTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const { postId } = useParams();

  useEffect(() => {
    requester("get", `/article/post/${postId}`, {
      text,
      title,
    }).then((res) => {
      setValue("text", res.data.text);
      setValue("title", res.data.title);
      setPublished(res.data.status == "published");
      setPostTags(
        res.data.tags.map((tag) => {
          return tag.name;
        }),
      );
      console.log(res.data.tags);
    });

    requester("get", "/tag").then((tags) => {
      setTags(tags.data);
    }, []);
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

  const { nav } = useContext(NavigationContext);
  const toggle = (tag) => {
    if (postTags.includes(tag)) {
      setPostTags(postTags.filter((item) => item !== tag));
    } else {
      setPostTags([...postTags, ...[tag]]);
    }
  };

  const onSubmit = (data) => {
    requester(
      "post",
      `/article/post/${postId}`,
      {
        excerpt: "",
        text: text,
        title: title,
        status: (published && "published") || "draft",
        created_date: null,
      },
      true,
    ).then(() => {
      requester("post", `/article/post/${postId}/tags`, postTags, true)
        .then(() => {
          if (postId == "new") {
            nav("/");
          } else {
            nav(`/blog/${postId}`);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    });
  };

  return (
    <>
      <div className="h-dvh" />
      <div className="absolute w-dvw top-0 ">
        <div className="w-dvw flex flex-row ">
          <div className="p-4 text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-stone-900 w-full">
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
          <div className="p-4 bg-yellow-50 w-[50dvw] fixed top-0 right-0 h-dvh overflow-scroll">
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
              <div className="text-black pt-4 pb-2">Status</div>
              <div
                onClick={() => {
                  setPublished(!published);
                }}
                className={
                  "group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out " +
                  " focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden has-checked:bg-indigo-600"
                }
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-has-checked:translate-x-5"
                />
                <input
                  type="radio"
                  checked={published}
                  readOnly
                  className="checked:border-indigo-500 hidden"
                />
              </div>

              <div className="text-black pt-4 pb-2">Tags</div>
              <div className="flex flex-row flex-wrap gap-2 p-2">
                {tags.map((tag) => {
                  return (
                    <TagDiv
                      className={
                        ((postTags.includes(tag.name) &&
                          "bg-amber-200 text-stone-900 ") ||
                          " bg-stone-800 text-amber-50 ") +
                        " line-clamp-1 rounded-full p-3 pr-4 flex flex-row "
                      }
                      onClick={() => {
                        toggle(tag.name);
                      }}
                      tagname={tag.name}
                      key={`tag-${tag.name}`}
                    />
                  );
                })}
              </div>

              <div className="text-black pt-4 pb-2">Body</div>
              <textarea
                {...register("text", { required: true })}
                placeholder="Post Text"
                className={
                  "h-full flex-grow text-white bg-stone-800 appearance-none rounded " +
                  "w-full p-2 leading-tight focus:outline-none resize-none min-h-[30rem]"
                }
              />

              <div className="flex flex-auto justify-center py-4">
                <input
                  type="submit"
                  value="Save"
                  className="p-4 bg-stone-950 text-white w-full rounded-xl"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPostLayout;
