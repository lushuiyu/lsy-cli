const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const loading = require('../../lib/fnLoading');
const downloadGitRepo = require('download-git-repo'); // 下载git仓库
const util = require('util');
const { downloadRepo, getTemplatesFromReadme } = require("../../lib/api"); // 获取仓库描述
const { zipStream2File } = require("../../lib/utils"); // 压缩文件流


// 覆盖选项列表
const coverOptions = [
  {
    type: "list",
    name: "cover",
    message: "请选择是否覆盖当前项目",
    choices: [
      {
        name: "覆盖",
        value: true,
      },
      {
        name: "取消",
        value: false,
      },
    ],
  },
];

class ProjectCreator {
  constructor(projectName, cmd) {
    this.projectName = projectName;
    this.cmd = cmd;
    this.targetPath = path.join(process.cwd(), this.projectName); // 拼接项目路径
    this.downloadGitRepo = util.promisify(downloadGitRepo); // 下载函数promise化
  }
  // 创建项目
  async create() {
    const exists = await fs.pathExists(this.targetPath); // 判断项目是否存在
    if (exists) {
      if (!this.cmd?.force) {
        console.log(chalk.bgRed.bold("项目已存在")); // 项目已存在提示
        const answers = await inquirer.prompt(coverOptions); // 覆盖选项列表
        if (!answers.cover) {
          console.log(chalk.bgRed.bold("任务已终止"));
          return; // 终止任务
        }
      }
      await loading("正在覆盖项目...", fs.remove, this.targetPath); // 删除已存在的项目
    }

    const templateOptions = await loading("正在获取模板列表...", getTemplatesFromReadme); // 获取模板列表
    const answers = await inquirer.prompt(templateOptions);
    const templateStream = await loading("正在下载模板项目...", downloadRepo, answers.template); // 下载项目
    await loading("正在解压项目...", zipStream2File, this.targetPath, templateStream); // 解压项目
    console.log(chalk.bgGreen.bold("项目创建成功")); // 项目创建成功提示
    // 本地项目创建
    // const template = answers.template;
    // const templatePath = path.join(__dirname, `../templates/${template}`); // 拼接模板路径
    // await fs.copy(templatePath, this.targetPath); // 复制模板到项目路径
    // createLoading.succeed("项目创建成功");
  }
  // 下载项目
  async download(repoName, tag) {
    const templateUrl = `direct:${repoName}#${tag}`; // 拼接下载链接
    await loading("正在下载项目...", this.downloadGitRepo, templateUrl, this.targetPath, { clone: true }); // 下载项目
  }
}

module.exports = ProjectCreator;