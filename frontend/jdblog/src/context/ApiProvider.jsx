import { createContext, useContext } from "react";

import { LoginContext } from "./LoginProvider";

import axios from "axios";

export const ApiContext = createContext(null);

function ApiProvider({ children }) {
  const { loginInfo, setLoginInfo } = useContext(LoginContext);

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  function refreshAccessToken(callback) {
    axios
      .post(import.meta.env.VITE_API_URL + "/refresh", {
        refresh_token: loginInfo.refresh_token,
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      })
      .then((res) => {
        setLoginInfo(res.data);
        callback(res);
      });
  }

  const requester = (
    method,
    path,
    payload,
    useHeaders,
    callback = (res) => {
      console.log(res.data);
    },
  ) => {
    return API[method](
      path,
      payload,
      useHeaders && {
        headers: { Authorization: `Bearer ${loginInfo.access_token}` },
      },
    )
      .catch((error) => {
        if (error.response.status == 403) {
          refreshAccessToken((newLoginInfo) => {
            API[method](
              path,
              payload,
              useHeaders && {
                headers: {
                  Authorization: `Bearer ${newLoginInfo.data.access_token}`,
                },
              },
            )
              .then((res) => {
                if (res !== undefined) {
                  callback(res);
                }
              })
              .catch((error) => {
                console.log("retry error");
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              });
          });
        } else if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      })
      .then((res) => {
        callback(res);
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
