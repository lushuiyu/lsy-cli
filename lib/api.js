/** @format */

const axios = require("axios");
// 拦截全局请求响应
axios.interceptors.response.use((res) => {
  return res.data;
});
// 注入环境变量
const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env.GITHUB_TOKEN);
const myGithub = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});
myGithub.interceptors.response.use((res) => {
  return res.data;
});
/**
 * 获取个人仓库下的全部项目
 * @returns Promise 项目信息list
 */
async function getMyRepos() {
  return myGithub.get("/users/lushuiyu/repos");
}

/**
 * 获取制定项目信息
 * @param {string} repo 项目名称
 * @returns Promise 版本信息
 */
async function getMyRepoTags(repo) {
  return myGithub.get(`/repos/lushuiyu/${repo}/tags`);
}

module.exports = {
  getMyRepos,
  getMyRepoTags,
};
