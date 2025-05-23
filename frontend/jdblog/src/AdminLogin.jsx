import { FaGoogle, FaGithub } from "react-icons/fa";
import { LoginButton } from "./components/ChooseLogin";
import { LoginContext } from "./context/LoginProvider";
import { useContext } from "react";
import axios from "axios";

import { useForm } from "react-hook-form";

function AdminLogin() {
  const { reset, register, handleSubmit } = useForm();

  const { setLoginInfo, loginInfo, logOut } = useContext(LoginContext);
  const onSubmit = (data) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/login/password`, {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${res.data.access_token}`,
            },
          })
          .then((meres) => {
            console.log("HELLO WORLD");
            setLoginInfo({
              ...meres.data,
              ...{ access_token: res.data.access_token },
            });
          });
        setTimeout(reset, 10);
      });
  };
  console.log(loginInfo.access_token);
  return (
    <>
      <div className="min-h-[80dvh] flex flex-col justify-center gap-4">
        <div className="text-black bg-stone-50 rounded-2xl w-xl h-xl p-8">
          <div className="text-3xl font-special py-4">
            Sign in with password
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <input
              {...register("username", { required: true })}
              placeholder="username"
              className={
                "h-full flex-grow bg-stone-200 dark:bg-stone-800 appearance-none rounded " +
                "w-full p-2 leading-tight focus:outline-none "
              }
            />
            <input
              {...register("password", { required: true })}
              placeholder="password"
              type="password"
              className={
                "h-full flex-grow bg-stone-200 dark:bg-stone-800 appearance-none rounded " +
                "w-full p-2 leading-tight focus:outline-none "
              }
            />

            <input
              type="submit"
              value="login"
              className={
                "bg-amber-300 hover:bg-amber-500 text-black font-sans rounded p-2 mt-2"
              }
            />
          </form>
        </div>
        <div className="text-black bg-stone-50 rounded-2xl w-xl h-xl p-8">
          <div className="text-3xl font-special">Sign with other accounts</div>
          <LoginButton icon={<FaGoogle size={28} />} name={"google"} />
          <LoginButton icon={<FaGithub size={28} />} name={"github"} />
        </div>
      </div>
    </>
  );
}
export default AdminLogin;
