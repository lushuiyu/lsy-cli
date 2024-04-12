const fs = require("fs-extra");
const path = require("path");
const unzipper = require("unzipper");


const zipStream2File = (projectName, stream) => {
  return new Promise((resolve, reject) => { 
    const zipPath = path.join(process.cwd(), "download.zip");
    const savePath = path.join(process.cwd(), projectName);
    const writer = fs.createWriteStream(zipPath);
    stream.pipe(writer);
    writer.on("finish", () => {
      console.log("压缩包写入完成");
      // 解压压缩包
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: savePath }))
        .on("close", () => {
          console.log("压缩包已解压到 " + savePath);
          fs.removeSync(zipPath); // 删除压缩包
          resolve();
        });
    });
    writer.on("error", (err) => {
      console.error("压缩包写入失败:", err);
      reject(err);
    });
  })
};

module.exports = {
  zipStream2File,
};