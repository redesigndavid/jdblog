import { createContext, useContext } from "react";

import { LoginContext } from "./LoginProvider";

import axios from "axios";
export const ApiContext = createContext(null);

document.aaa = axios;
function ApiProvider({ children }) {
  const { loginInfo } = useContext(LoginContext);

  const requester = (method, path, payload, useHeaders) => {

    return axios[method](
      import.meta.env.VITE_API_URL + path,
      payload,
      useHeaders && {
        headers: { Authorization: `Bearer ${loginInfo.access_token}` },
      },
    ).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  };

  return (
    <>
      <ApiContext.Provider value={{ requester }}>
        {children}
      </ApiContext.Provider>
    </>
  );
}
export default ApiProvider;
