import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const requester = (
  method,
  path,
  payload,
  callback = (res) => {
    // console.log(res.data);
  },
) => {
  return API[method](path, payload).then((res) => {
    callback(res);
  });
};
