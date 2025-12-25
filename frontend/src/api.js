import axios from "axios";

const api = axios.create({
  baseURL: "https://codeshare-qiiv.onrender.com/api",
});

export default api;
