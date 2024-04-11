/** @format */
const { Readable } = require("stream");
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");
const unzipper = require('unzipper'); // 安装并引入 unzipper 模块
const { pipeline } = require('stream'); // 引入 pipeline 方法
// 注入环境变量
const dotenv = require("dotenv");
dotenv.config();
// 你的 GitHub 个人访问令牌
const personalAccessToken = process.env.GITHUB_TOKEN; // 请替换为你的实际令牌
const octokit = new Octokit({
  auth: personalAccessToken,
  headers: {
    Accept: 'application/octet-stream', // 设置响应类型为 'stream'
  },
});

// GitHub 仓库信息
const owner = "lushuiyu"; // 请替换为实际的仓库所有者
const repo = "lsy-admin"; // 请替换为实际的仓库名

// 保存下载的 zip 文件的本地路径
const savePath = path.join(__dirname, "my-repo.zip"); // 根据需要更改文件名和保存路径

// 下载 zip 文件
octokit.repos.git({
    owner,
    repo,
  })
  .then((response) => {
    // 将压缩包写入文件
    const filePath = './downloaded-repo.zip'; // 替换为实际的文件路径
    const fileStream = fs.createWriteStream(filePath);

    // 使用 pipeline 方法将响应流传递给文件流
    pipeline(new Blob([response.data]), fileStream, (error) => {
      if (error) {
        console.error("下载压缩包时出错：", error.message);
      } else {
        console.log("压缩包已下载到", filePath);

        // 解压压缩包
        fs.createReadStream(filePath)
          .pipe(unzipper.Extract({ path: "./extracted-folder" }))
          .on("close", () => {
            console.log("压缩包已解压到 ./extracted-folder");
          });
      }
    });
  })
  .catch((err) => {
    console.error("下载 zip 文件时出错：", err);
  });
