import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:58000",
  withCredentials: true,
});

api.interceptors.request.use(
  (response) => response,
  (error) => {
    switch (error.response?.status) {
      case 400:
        console.log("400 Bad Request");
        return Promise.reject(error.response?.data);
      case 401:
        console.log("401 Unauthorized");
        return Promise.reject(error.response?.data);
      case 404:
        console.log("404 Not Found");
        return Promise.reject(error.response?.data);
      case 500:
        console.log("500 Internal Server Error");
        return Promise.reject(error.response?.data);
      default:
        return Promise.reject(error.response?.data);
    }
  },
);
