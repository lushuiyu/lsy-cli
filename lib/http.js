/** @format */

const { Octokit } = require("@octokit/rest");
const fsExtra = require("fs-extra");
const fs = require("fs");
const tar = require("tar");
const AdmZip = require("adm-zip");
const downloadGitRepo = util.promisify(require("download-git-repo")); // 下载git仓库
// 注入环境变量
const dotenv = require("dotenv");
dotenv.config();

downloadGitRepo("", path.join(process.cwd(), "lsy-admin-test"), { clone: true });


// const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN,
// });
// async function fn() { 
//   // const res = await octokit.rest.repos.listForUser({
//   //   username: "lushuiyu",
//   // })
//   // const res = await octokit.rest.repos.downloadTarballArchive({
//   const res = await octokit.rest.repos.downloadZipballArchive({
//     owner: "lushuiyu",
//     repo: "lsy-admin",
//     ref: "main",
//   });
//   const zip = new AdmZip(res.data);
//   console.log(zip);
//   zip.extractAllTo("./ddd", true);
// }
// fn();


// const decompress = (arrayBuffer) => {
//   return new Promise((resolve, reject) => {
//     let buffer = Buffer.from(arrayBuffer);
//     let parseStream = new tar.Parse();
//     let files = [];

//     parseStream.on("entry", function (entry) {
//       let chunks = [];
//       entry.on("data", (chunk) => chunks.push(chunk));
//       entry.on("end", () => {
//         let content = Buffer.concat(chunks);
//         files.push({ path: entry.path, content });
//       });
//     });

//     parseStream.on("end", () => {
//       resolve(files);
//     });

//     parseStream.on("error", (error) => {
//       reject(error);
//     });

//     let bufferStream = new Readable();

//     bufferStream.pipe(parseStream);

//     bufferStream.push(buffer);
//     bufferStream.push(null);
//   });
// };

