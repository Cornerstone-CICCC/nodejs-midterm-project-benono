import axios from "axios";

// TODO update baseURL
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3500/api/",
  withCredentials: true, // send cookies
});
