/** @format */
const axios = require("axios");

// 拦截全局请求响应
axios.interceptors.response.use((res) => {
  return res.data;
});
// 注入环境变量
const dotenv = require("dotenv");
dotenv.config();
const myGithub = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});
myGithub.interceptors.response.use((res) => {
  return res.data;
});


module.exports = {
  axios,
  myGithub,
};
