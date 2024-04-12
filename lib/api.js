/** @format */
const { axios, myGithub } = require("./axios")
const fs = require("fs-extra");
const path = require("path");
const unzipper = require('unzipper'); // 安装并引入 unzipper 模块


/**
 * 获取个人仓库下的全部项目
 * @returns Promise 项目信息list
 */
async function getMyRepos() {
  return myGithub.get("/users/lushuiyu/repos");
}

/**
 * 获取指定项目信息
 * @param {string} user 用户名
 * @param {string} repoName 项目名称
 * @returns Promise 项目zip压缩包文件流
 */
async function downloadRepo(user ,repoName) {
  return myGithub.get(`/repos/${user}/${repoName}/zipball`);
  return new Promise(async (resolve, reject) => { 
    const data = await myGithub.get(`/repos/lushuiyu/${repoName}/zipball`, {
      responseType: "stream",
    });
    const zipPath = path.join(process.cwd(), "download.zip");
    const savePath = path.join(process.cwd(), projectName);
    const writer = fs.createWriteStream(zipPath);
    data.pipe(writer);
    writer.on("finish", () => {
      console.log("压缩包下载完成");
      // 解压压缩包
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: savePath }))
        .on("close", () => {
          console.log("压缩包已解压到 " + savePath);
          fs.removeSync(zipPath); // 删除压缩包
          resolve();
        });
    });
    writer.on("error", (err) => {
      console.error("Error saving zip file:", err);
      reject(err);
    });
  })
}
/**
 * 获取lsy-cli项目的Read.me文件内容, 用于解析项目模板下载地址
 * @returns {Text} Read.me文件内容
*/
async function getTemplatesFromReadme() {
  try {
    const response = await myGithub.get(`https://api.github.com/repos/lushuiyu/lsy-cli/readme`);
    if (response.content) {
      // 解码 base64 编码的内容
      const decodedContent = Buffer.from(response.content, "base64").toString("utf-8");
      const templateList = decodedContent.split("---").filter((item) => item.includes("### Template List"));
      console.log(templateList, decodedContent.split("---"), decodedContent);
    } else {
      console.error("无法获取 README 文件内容。");
    }
  } catch (error) {
    console.error("请求失败：", error.message);
  }
}
getTemplatesFromReadme();
module.exports = {
  getMyRepos,
  downloadRepo,
};
