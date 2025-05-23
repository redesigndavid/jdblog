import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { LoginContext } from "../context/LoginProvider";
import ChooseLogin from "./ChooseLogin"

import axios from "axios";
function CommentForm({ articleId, addComment, kind }) {
  const { reset, register, handleSubmit } = useForm();

  const { loginInfo } = useContext(LoginContext);
  const onSubmit = (data) => {
    console.log(
        `${import.meta.env.VITE_API_URL}/article/${kind}/${articleId}/comment`
    )
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/article/${kind}/${articleId}/comment`,
        { text: data.comment },
        { headers: { Authorization: `Bearer ${loginInfo.access_token}` } },
      )
      .then((res) => {
        setFocus(false);
        addComment(res.data);
        setTimeout(reset, 10);
      });
  };
  const [isFocus, setFocus] = useState(false);
  const [chooseLogin, setChooseLogin] = useState(false);

  return (
    <>
      {chooseLogin && <ChooseLogin onClick={() => setChooseLogin(false)}/>}
      <div className="p-4 bg-stone-200 dark:bg-stone-800 rounded-xl mt-8 text-gray-700 dark:text-gray-200   ">
        {(loginInfo?.access_token && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={"transition-all  " + (isFocus ? "h-42 " : "h-18")}
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
                "w-full p-2 leading-tight focus:outline-none " +
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
        )) || (
            <div onClick={() => setChooseLogin(true)} className="">
              Want to say something?
            </div>
          )}
      </div>
    </>
  );
}
export default CommentForm;
