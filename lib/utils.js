const fs = require("fs-extra");
const path = require("path");
const unzipper = require("unzipper");
const ncp = require("copy-paste");
const os = require("os");
const { exec } = require("child_process");
/**
 * 将流数据写入到文件
 * @param {string} targetPath 目标路径
 * @param {stream} stream 流数据
 * @returns {Promise}
*/
const zipStream2File = (targetPath, stream) => {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(process.cwd(), `download-${new Date().getTime()}.zip`);
    const writer = fs.createWriteStream(zipPath);
    stream.pipe(writer);
    writer.on("finish", () => {
      console.log("压缩包写入完成");
      // 解压压缩包
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: targetPath }))
        .on("close", () => {
          const files = fs.readdirSync(targetPath);
          const filePath = path.join(targetPath, files[0]);
          // 复制目录
          fs.copySync(filePath, targetPath);
          fs.removeSync(zipPath); // 删除压缩包
          fs.removeSync(filePath); // 删除原始文件夹
          console.log("压缩包已解压到 " + targetPath);
          resolve();
        });
    });
    writer.on("error", (err) => {
      console.error("压缩包写入失败:", err);
      reject(err);
    });
  });
};
/**
 * 复制密钥到剪切板
 * @param {string} path 要复制的密钥路径
*/
async function copyKey(path) {
  const command = os.type() === "Windows_NT" ? `clip < ${path}` : `pbcopy < ${path}`;
  await exec(command, (err, stdout, stderr) => { 
    if (err) {
      console.error("Error copying key to clipboard:", err);
    } else {
      console.log("Key copied to clipboard successfully!");
    }
  });
}

/**
 * 复制文本到剪切板
 * @param {string} text 要复制的文本
*/
async function copyText(text) {
  if (!(text instanceof String)) { 
    return console.error("Text must be a string");
  }
  try {
    await ncp.copy(text, function () {
      // complete...
      console.log("Text copied to clipboard successfully!");
    });
  } catch (error) {
    console.error("Error copying text to clipboard:", error);
  }
}
module.exports = {
  zipStream2File,
  copyText,
  copyKey,
};