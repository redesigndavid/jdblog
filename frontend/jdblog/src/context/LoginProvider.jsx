import { useEffect, useState, createContext } from "react";
export const LoginContext = createContext(null);
import axios from "axios";

import { useSearchParams } from "react-router-dom";

function LoginProvider({ children }) {
  let [searchParams, setSearchParams] = useSearchParams();
  let [loginInfo, setLoginInfoState] = useState(() => {
    return JSON.parse(localStorage.getItem("loginInfo"));
  });
  let [isLoggedIn, setIsLoggedIn] = useState(() => {
    return loginInfo?.access_token === undefined;
  });

  let [isAdmin, setIsAdminLogin] = useState(() => {
    return JSON.parse(localStorage.getItem("loginInfo"))?.user_type == "admin";
  });

  const logOut = () => {
    // clear login info
    setLoginInfo({});
    setIsAdminLogin(false);
    setIsLoggedIn(false)
  };

  const setLoginInfo = (loginfo) => {
    // save to state and localstorage
    setLoginInfoState(loginfo);
    localStorage.setItem("loginInfo", JSON.stringify(loginfo));
    setIsAdminLogin(loginfo.user_type == "admin");
  };
  useEffect(()=>{
    setIsLoggedIn(loginInfo?.access_token !== undefined)
  }, [loginInfo]
  )


  useEffect(() => {
    if (searchParams.get("access_token")) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${searchParams.get("access_token")}`,
          },
        })
        .then((res) => {
          setLoginInfo({
            ...res.data,
            ...{ access_token: searchParams.get("access_token"), refresh_token: searchParams.get("refresh_token") },
          });
        });
      setSearchParams({});
    }
  }, []);

  return (
    <LoginContext.Provider value={{ logOut, loginInfo, isAdmin, isLoggedIn, setLoginInfo }}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
