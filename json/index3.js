const fs = require("fs");
const path = require("path");

// 配置对象
const config = {
  precision: 3, // 坐标精度，小数点后位数
  srcDir: path.join(__dirname), // 源文件目录
  dstDir: path.join(__dirname, "res2"), // 输出目录
};
// 读取 Japan.json 文件
const japanData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "Japan.json"), "utf8")
);

const srcPath = path.join(config.srcDir, `world.json`);
const dstPath = path.join(config.dstDir, `world.json`);

console.log("🚀 ~ file: index3.js:10 ~ srcPath:", srcPath);
console.log("🚀 ~ file: index3.js:10 ~ dstPath:", dstPath);

// 检查源文件是否存在
if (!fs.existsSync(srcPath)) {
  throw new Error(`源文件不存在: ${srcPath}`);
}

// 读取和解析源文件
const sourceData = JSON.parse(fs.readFileSync(srcPath, "utf8"));

sourceData.features.forEach((element) => {
  element.type = "Feature";
  element.id = element.properties.name;
});

// console.log(
//   "🚀 ~ file: index3.js:27 ~ sourceData:",
//   JSON.parse(JSON.stringify(sourceData.features))
// );

// 确保输出目录存在
if (!fs.existsSync(config.dstDir)) {
  fs.mkdirSync(config.dstDir, { recursive: true });
}

// 写入压缩后的文件
fs.writeFileSync(dstPath, JSON.stringify(sourceData), "utf8");

console.log(`成功转换 ${srcPath} 到 ${dstPath}`);
