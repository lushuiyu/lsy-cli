/** @format */

// generateKeys.js

const { exec } = require("child_process");
const { program } = require("commander");
const SSHKeyCreator = require("./sshKeyCreator");
const chalk = require("chalk");
const loading = require("../../lib/fnLoading");
const { copyKey } = require("../../lib/utils");
const fs = require("fs-extra")
const SSHConfigEditor = require("./sshKeyConfigEditor");
const inquirer = require("inquirer");

const useAddSshKey = () => {
  program
    .command("sshkey <email> <keyname>") // 增加创建指令
    .description("创建SSH密钥对, -f 覆盖已存在的密钥对") // 添加描述信息
    .option("-f, --force", "覆盖已存在的密钥对")
    .action(async (email, keyName, cmd) => {
      const creator = new SSHKeyCreator();
      await creator.createSSHKeys(keyName, email, cmd?.force || false); // 创建密钥对
      await creator.saveSSHKey2Agent(); // 保存密钥对到ssh-agent
      await copyKey(creator.pubpath);
      console.log(`SSH 密钥已复制到剪切板，请粘贴到${chalk.green("GitHub/GitLab/Gitee")}等代码托管平台。`);
      const to_editor = await inquirer.prompt([
        {
          type: "confirm",
          name: "to_editor",
          message: "是否打开SSH配置文件编辑器进行配置？",
          default: true,
        },
      ]);
      if (!to_editor.to_editor) return console.log(chalk.green("已跳过配置."));
      const config = await inquirer.prompt([
        {
          type: "input",
          message: "请输入主机名: ",
          name: "host",
          default: "my-host",
          validate: (value) => {
            if (value.trim() === "") {
              return chalk.red("主机名不能为空!");
            }
            return true;
          },
        },
        {
          type: "input",
          message: "请输入托管网站的域名: ",
          name: "hostname",
          default: "github.com",
          validate: (value) => {
            if (value.trim() === "") {
              return chalk.red("托管网站域名不能为空!");
            }
            return true;
          },
        },
        {
          type: "input",
          message: "请输入用户名: ",
          name: "user",
          default: "your-username",
          validate: (value) => {
            if (value.trim() === "") {
              return chalk.red("用户名不能为空!");
            }
            return true;
          },
        },
        {
          type: "input",
          message: "请输入端口号: ",
          name: "port",
          default: "22",
        },
      ]);

      Object.assign(config, { identityfile: creator.path });
      const configEditor = new SSHConfigEditor();
      configEditor.checkConfigFileExists();
      configEditor.addSshKeyConfig(config);
    });
};

module.exports = { useAddSshKey };
