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
      <div className="min-h-[70dvh] flex flex-col justify-center gap-4">
        <div className="text-black bg-stone-50 rounded-2xl w-xl h-xl p-8">
          <div className="text-3xl font-special">Sign in</div>
          <LoginButton icon={<FaGoogle size={28} />} name={"google"} />
          <LoginButton icon={<FaGithub size={28} />} name={"github"} />
        </div>
      </div>
    </>
  );
}
export default AdminLogin;
