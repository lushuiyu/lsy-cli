/** @format */
const { axios, myGithub } = require("./axios")

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
async function downloadRepo(templateUrl) {
  templateUrl = templateUrl.replace("https://github.com/", "");
  const [user, repoName] = templateUrl.split("/");
  return myGithub.get(`/repos/${user}/${repoName}/zipball`, {
    responseType: "stream",
  });
}
/**
 * 获取lsy-cli项目的Read.me文件内容, 用于解析项目模板下载地址
 * @returns Promise 项目模板选项列表
*/
async function getTemplatesFromReadme() {
  return new Promise(async (resolve, reject) => { 
    try {
      const response = await myGithub.get(`/repos/lushuiyu/lsy-cli/readme`);
      if (response.content) {
        // 解码 base64 编码的内容
        const decodedContent = Buffer.from(response.content, "base64")
          .toString("utf-8")
          .split("---")
          .filter((item) => item.includes("### Template List"));
        const templateOptions = [
          {
            type: "list",
            name: "template",
            message: "请选择项目模板",
            choices: [
              // {
              //   name: "lsy-admin",
              //   value: "lsy-admin",
              // },
            ],
          },
        ];
        decodedContent[0].split("\n").forEach((item) => {
          let re = new RegExp("\\[(.*?)\\]\\((.*?)\\)");
          let data = item.match(re);
          if (data) {
            templateOptions[0].choices.push({ name: data[1], value: data[2] });
          }
        });
        // console.log(JSON.stringify(templateOptions));
        resolve(templateOptions)
      } else {
        console.error("无法获取 README 文件内容。");
        reject("无法获取 README 文件内容。");
      }
    } catch (error) {
      console.error("请求失败：", error.message);
      reject(error);
    }
  })
}

module.exports = {
  getMyRepos,
  downloadRepo,
  getTemplatesFromReadme,
};
