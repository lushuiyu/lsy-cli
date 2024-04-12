const fs = require("fs-extra");
const path = require("path");
const unzipper = require("unzipper");


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
          console.log("压缩包已解压到 " + targetPath);
          fs.removeSync(zipPath); // 删除压缩包
          resolve();
        });
    });
    writer.on("error", (err) => {
      console.error("压缩包写入失败:", err);
      reject(err);
    });
  });
};

module.exports = {
  zipStream2File,
};