/** @format */

const { Octokit } = require("@octokit/rest");
const fsExtra = require("fs-extra");
const fs = require("fs");
const tar = require("tar");
const AdmZip = require("adm-zip");
// 注入环境变量
const dotenv = require("dotenv");
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
async function fn() { 
  // const res = await octokit.rest.repos.listForUser({
  //   username: "lushuiyu",
  // })
  // const res = await octokit.rest.repos.downloadTarballArchive({
  const res = await octokit.rest.repos.downloadZipballArchive({
    owner: "lushuiyu",
    repo: "lsy-admin",
    ref: "main",
  });
  const zip = new AdmZip(res.data);
  console.log(zip);
  zip.extractAllTo("./ddd", true);
}
fn();

