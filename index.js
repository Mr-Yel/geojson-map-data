const { pinyin } = require("pinyin-pro");
console.log("🚀 ~ file: index.js:3 ~ pinyin:", pinyin);
// console.log("🚀 ~ file: index.js:3 ~ pinyin:", pinyin.pinyin);

pinyin.STYLE_TONE = 2;

console.log(pinyin("汉语拼音", { toneType: "none", type: "array" }));
