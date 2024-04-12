/** @format */

const { program } = require("commander");
const ProjectCreator = require("./projectCreator");
const useCreateProject = () => {
  program
    .command("create <project-name>") // 增加创建指令
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
}

module.exports = {useCreateProject};
