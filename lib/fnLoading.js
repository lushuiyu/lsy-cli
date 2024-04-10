const chalk = require('chalk');
const ora = require('ora');
let count = 3;
/**
 * 睡觉函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}

async function loading(message, fn, ...args) {
  const spinner = ora(message);
  spinner.start(); // 开启加载
  try {
    let executeRes = await fn(...args);
    spinner.succeed(chalk.green("执行成功"));
    return executeRes;
  } catch (error) {
    console.error(error);
    if (count > 0) {
      count--;
      spinner.fail(chalk.bgRedBright(`执行失败, 1s后重试, 剩余重试次数: ${count}...`));
      await sleep(1000);
      // 重新拉取
      return loading(message, fn, ...args);
    }
  }
}

module.exports = loading;