/** @format */
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const savePath = path.join(__dirname, "test.zip");
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
  // return myGithub.get(`/repos/lushuiyu/${repo}/tags`);
  // return await octokit.request("GET /repos/lushuiyu/lsy-admin/zipball/TEST");
}

async function downloadtest() {
  const data = await myGithub.get("/repos/lushuiyu/lsy-admin/zipball", {
    responseType: "stream",
  })
  const writer = fs.createWriteStream(savePath);
  data.pipe(writer);

  writer.on("finish", () => {
    console.log("Zip file downloaded and saved successfully!");
  });

  writer.on("error", (err) => {
    console.error("Error saving zip file:", err);
  });
}
downloadtest();

module.exports = {
  getMyRepos,
  getMyRepoTags,
};
