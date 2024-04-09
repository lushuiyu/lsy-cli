const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const loading = require('./fnLoading');

const createProject = async (projectName, cmd) => {
  const cwd = process.cwd(); // 返回 Node.js 进程的当前工作目录
  const targetPath = path.join(cwd, projectName); // 拼接项目路径
  const exists = await fs.pathExists(targetPath); // 判断项目是否存在
  if (exists) {
    console.log(chalk.bgRed.bold("项目已存在"));
    const answers = await inquirer.prompt([
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
          }
        ],
      },
    ]);
    if (answers.cover) {
      await loading("正在覆盖项目...", fs.remove, targetPath); // 删除已存在的项目
    } else {
      return;
    }
  }
  const createLoading = ora("正在创建项目...");
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: [
        {
          name: 'React',
          value:'react'
        },
        {
          name: 'Vue',
          value: 'vue'
        },
        {
          name: 'Vite',
          value: 'Vite'
        }
      ]
    }
  ]);
  const template = answers.template;
  const templatePath = path.join(__dirname, `../templates/${template}`); // 拼接模板路径
  await fs.copy(templatePath, targetPath); // 复制模板到项目路径
  console.log(projectName, cmd, cwd);
  createLoading.succeed("项目创建成功");
};


module.exports = createProject;