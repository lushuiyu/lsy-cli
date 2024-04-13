/** @format */

// generateKeys.js

const { exec } = require("child_process");
const { program } = require("commander");

const email = "xxx@xx.xom"; // 替换为你的电子邮件地址

// 执行ssh-keygen命令
exec(`ssh-keygen -t rsa -C "${email}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行ssh-keygen时出错：${error.message}`);
    return;
  }
  console.log(`生成的密钥对：\n${stdout}`);
});

const useAddSshKey = () => {
  program
    .command("sshkey <shh-key-name>") // 增加创建指令
    .description("创建新项目") // 添加描述信息
    .option("-f, --force", "强制覆盖") // 强制覆盖
    .action((projectName, cmd) => {
      // projectName ->项目名称, cmd->命令行参数 {force: true}
      // // 处理用户输入create 指令附加的参数
      if (cmd?.force) console.log(chalk.yellow("强制覆盖已开启"));
      // 创建项目
      const project = new ProjectCreator(projectName, cmd);
      project.create();
    });
};

module.exports = { useAddSshKey };
