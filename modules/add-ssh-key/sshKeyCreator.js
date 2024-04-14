/** @format */

const path = require("path");
/**
 * @param {Object} options - Options for ssh-keygen-lite.
 * @param {string} options.location - The location to create the key pair.
 * @param {string} options.type - The type of key to create (rsa, dsa, ecdsa, ed25519).
 * @param {boolean} options.read - Whether to read the private key from the file system.
 * @param {boolean} options.force - Whether to overwrite existing files.
 * @param {boolean} options.destroy - Whether to destroy the private key after creating the public key.
 * @param {string} options.comment - The comment to add to the public key.
 * @param {string} options.password - The password to encrypt the private key with.
 * @param {string} options.size - The size of the key to create (in bits).
 * @param {string} options.format - The format of the key to create (PEM, OpenSSH).
 * @param {function} [callback] - Optional callback function to be called when the keys are created.
 */
const keygen = require("ssh-keygen-lite");
const fs = require("fs-extra");
const os = require("os");
const { exec } = require("child_process");
const inquirer = require("inquirer");
const loading = require("../../lib/fnLoading");
const chalk = require("chalk");

class SSHKeyCreator {
  constructor() {
    this.path = "";
    this.pubpath = "";
  }
  // 检查是否存在同名密钥文件
  checkSSHPathAndKeyName(keyName) {
    const homeDir = os.homedir(); // 获取用户主目录
    try {
      // 检查是否存在.ssh目录
      const sshDir = fs.readdirSync(homeDir).find((file) => {
        const filePath = path.join(homeDir, file);
        const stats = fs.statSync(filePath);
        return file === ".ssh" && stats.isDirectory();
      });
      if (!sshDir) {
        fs.createFileSync(path.join(homeDir, ".ssh"));
      } // 不存在则创建.ssh目录
      // 检查.ssh目录下是否存在同名文件
      const keyFiles = fs.readdirSync(path.join(homeDir, ".ssh")).find((file) => {
        return file === keyName || file === keyName + ".pub";
      });
      if (keyFiles) {
        console.error("同名文件已存在，请更换名称！");
        return false;
      }
      return true; // 不存在同名文件 -> 可以创建密钥
    } catch (err) {
      console.error("读取用户主目录失败:", err);
      return false;
    }
  }
  // 创建密钥
  createSSHKeys(keyName, email, force = false) {
    return new Promise(async (resolve, reject) => {
      //检查有无重名文件
      const license = await loading("正在检查创建条件...", this.checkSSHPathAndKeyName.bind(this), keyName);
      if (!license) {
        if (!force) {
          const answer = await inquirer.prompt([
            {
              type: "list",
              name: "cover",
              message: "同名文件已存在, 是否覆盖？\n\n",
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
          ]);
          if (!answer.cover) { 
            return reject("取消创建密钥！");
          }
        }
        await loading("正在删除同名文件...", fs.remove, path.join(os.homedir(), `.ssh/${keyName}`));
      }
      const command = `ssh-keygen -t rsa -C \"${email}\" -f ${path.join(os.homedir(), `.ssh/${keyName}`)}`;
      await exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 ssh-keygen 命令时出错：${error.message}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`ssh-keygen 错误信息：${stderr}`);
          return reject(error);
        }
        console.log("密钥已创建！", stdout);
        this.path = path.join(os.homedir(), `.ssh/${keyName}`);
        this.pubpath = path.join(os.homedir(), `.ssh/${keyName}.pub`);
        resolve(this.path);
      });
    });
  }
  // 将密钥保存到 ssh-agent 中
  async saveSSHKey2Agent() {
    return new Promise(async (resolve, reject) => { 
      // 执行 ssh-add 命令
      await exec(`ssh-add ${this.path}`, async (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 ssh-add 命令时出错：${error.message}`);
          const osType = os.type(); // 返回操作系统类型，例如 'Windows_NT'
          if (osType === "Windows_NT") {
            console.log(
              "1. 请检查是否已安装 OpenSSH 并已成功添加到环境变量。" +
                chalk.cyan("https://docs.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_install_firstuse")
            );
            console.log(`2. 请检查是否已安装 ssh-agent 并已成功启动(命令行输入：${chalk.cyan("get-service ssh*")})。`);
          } else if (osType === "Darwin") {
            console.log("请检查是否已安装 ssh-agent 并已成功启动。" + chalk.cyan("brew services start ssh-agent"));
          } else {
            console.log("请检查是否已安装 ssh-agent 并已成功启动。" + chalk.cyan("get-service ssh*"));
          }
          return reject(error);;
        }
        if (stderr) {
          console.error(`${stderr}`);
        }
        console.log(`SSH 密钥已成功添加到 ssh-agent。`);
        resolve();
      });
    })
  }
}

module.exports = SSHKeyCreator;
