import { useEffect, useState, createContext } from "react";
export const LoginContext = createContext(null);
import axios from "axios";


import { useSearchParams } from "react-router-dom";
function LoginProvider({ children }) {
  let [searchParams, setSearchParams] = useSearchParams();
  let [loginInfo, setLoginInfoState] = useState(() => {
    return JSON.parse(localStorage.getItem("loginInfo"))
  });
  let [isAdmin, setIsLogin] = useState(false);

  const logOut = () => {
    // clear login info
    setLoginInfo({});
    setIsLogin(false)
  };

  const setLoginInfo = (loginfo) => {
    // save to state and localstorage
    setLoginInfoState(loginfo);
    localStorage.setItem("loginInfo", JSON.stringify(loginfo))
    setIsLogin(loginfo.user_type == "admin");
  };

  useEffect(() => {
    if (searchParams.get("access_token")) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${searchParams.get("access_token")}`,
          },
        })
        .then((res) => {
          setLoginInfo({...res.data, ...{access_token: searchParams.get("access_token")}});
        });
      setSearchParams({});
    }
  }, []);

  return (
    <LoginContext.Provider value={{ logOut, loginInfo, setLoginInfo, isAdmin }}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
