import { createContext } from "react";

import { LoginContext } from "../context/LoginProvider";

export const ApiContext = createContext(null);

function ApiProvider({ children }) {
  const { loginInfo } = useContext(LoginContext);

  function requester(method, path, payload, useHeaders) {
    var methodF = null;
    switch (method) {
      case "get":
        methodF = axios.get;
        break;
      case "post":
        methodF = axios.post;
        break;
    }

    return methodF(
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
  }

  return (
    <>
      <ApiContext.Provider value={{requester}}>{children}</ApiContext.Provider>
    </>
  );
}
export default ApiProvider;
