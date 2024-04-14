const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

class sshKeyConfigEditor {
  constructor() {
    this.targetPath = path.join(os.homedir(), ".ssh", "config"); // 目标路径
  }
  checkConfigFileExists() {
    const exists = fs.pathExistsSync(this.targetPath); // 判断项目是否存在
    console.log(`配置文件：${chalk.cyan(this.targetPath)} ${chalk.greenBright(exists ? "已存在" : "不存在")}`);
    if (!exists) {
      fs.ensureFileSync(this.targetPath);
      fs.writeFileSync(
        this.targetPath,
        `Host *
          HostKeyAlgorithms +ssh-dss
          PubkeyAcceptedKeyTypes +ssh-rsa`,
        "utf8"
      );
      console.log(chalk.greenBright("配置文件已创建"));
    }
  }
  /**
   * 添加ssh key配置
   * @param {object} config 配置内容
   * @param {string} config.host 主机名
   * @param {string} config.hostname 托管网站域名
   * @param {string} config.port 端口
   * @param {string} config.user 用户名
   * @param {string} config.identityfile 私钥文件路径
   * @example
   * const sshKeyConfigEditor = new sshKeyConfigEditor();
   * sshKeyConfigEditor.addSshKeyConfig({
   *   host: 'github.com',
   *   port: '22',
   *   user: 'git',
   *   identityfile: '/Users/lushuiyu/.ssh/id_rsa'
   */
  addSshKeyConfig(config) {
    const configStr = `
      # ${config.hostname} - ${config.user} - config
      Host ${config.host}
        HostName ${config.hostname}
        ${config?.port ? `Port ${config.port}` : ""}
        User ${config.user}
        IdentityFile ${config.identityfile}\n\n
    `;
    const data = fs.readFileSync(this.targetPath, "utf8");
    fs.writeFileSync(this.targetPath, data + "\n" + configStr, "utf8");
    console.log(chalk.greenBright("ssh key配置添加成功!"));
    console.log(configStr);
  }
}

module.exports = sshKeyConfigEditor;