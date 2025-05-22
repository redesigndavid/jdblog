import { useForm } from "react-hook-form";
import { useState, useContext } from "react";

import { LoginContext } from "../context/LoginProvider";
import axios from "axios";
function CommentForm({ postId, addComment }) {
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { loginInfo } = useContext(LoginContext);
  const onSubmit = (data) => {
    console.log("SUBMITTED");
    console.log(data);
    console.log(loginInfo);
    axios
      .post(`${import.meta.env.VITE_API_URL}/post/${postId}/comment`,
        { text: data.comment, },
        {headers: { Authorization: `Bearer ${loginInfo.access_token}`}})
      .then((res) => {
        setFocus(false);
        addComment(res.data);
        setTimeout(reset, 10);
      });
  };
  const [isFocus, setFocus] = useState(false);

  console.log(watch()); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div className="p-4 bg-stone-200 dark:bg-stone-800 rounded-xl mt-8">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={
        "transition-all  " +
        (isFocus
          ? "h-42 "
          : "h-18")
      }
    >
      <div
        onClick={() => setFocus(true)}
        className={
          "p-2 text-stone-400/50 " +
          (!isFocus ? " opacity-100 " : " opacity-0 hidden")
        }
      >
        What do you think?
      </div>
      <textarea
        {...register("comment", { required: true })}
        onFocus={() => {
          setFocus(true);
        }}
        className={
          "h-full flex-grow bg-stone-200 dark:bg-stone-800 appearance-none rounded " +
          "w-full p-2 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none " +
          "resize-none" +
          (isFocus ? " opacity-100 " : " opacity-0 ")
        }
      />

      <input
        type="submit"
        className={
          "bg-amber-300 hover:bg-amber-500 text-black font-sans rounded " +
          "focus:outline-none focus:shadow-outline float-right relative -top-16 right-4 p-3 border-4 border-amber-200" +
          (isFocus ? " opacity-100 " : " opacity-0 pointer-events-none")
        }
      />
    </form>
    </div>
  );
}
export default CommentForm;
