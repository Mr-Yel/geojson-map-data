const fs = require("fs");
const path = require("path");

// 创建 dst 目录（如果不存在）
const dstDir = path.join(__dirname, "dst");
if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir);
}

// 读取 Japan.json 文件
const japanData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "Japan.json"), "utf8")
);

// 验证坐标是否有效
function isValidCoordinate(coord) {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1]) &&
    coord[0] >= -180 &&
    coord[0] <= 180 &&
    coord[1] >= -90 &&
    coord[1] <= 90
  );
}

// 解码坐标函数
function decodePolygon(coordinate, encodeOffsets) {
  const coordinates = [];
  let prevX = encodeOffsets[0];
  let prevY = encodeOffsets[1];

  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64;
    let y = coordinate.charCodeAt(i + 1) - 64;
    x = (x >> 1) ^ -(x & 1);
    y = (y >> 1) ^ -(y & 1);
    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y;
    coordinates.push([x / 1024, y / 1024]);
  }

  return coordinates;
}

// 压缩坐标 - 减少精度
function compressCoordinates(coords, precision = 3) {
  return coords.map((point) => {
    const compressed = point.map((num) => Number(num.toFixed(precision)));
    if (!isValidCoordinate(compressed)) {
      console.warn("Invalid coordinate found:", compressed);
      return point;
    }
    return compressed;
  });
}

// 道格拉斯-普克算法实现
function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;

  const findPerpendicularDistance = (p, p1, p2) => {
    if (p2[0] === p1[0]) return Math.abs(p[0] - p1[0]);
    const slope = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    const intercept = p1[1] - slope * p1[0];
    if (!isFinite(slope)) return Math.abs(p[0] - p1[0]);
    const x = (p[0] + slope * p[1] - slope * intercept) / (slope * slope + 1);
    const y = slope * x + intercept;
    return Math.hypot(x - p[0], y - p[1]);
  };

  let maxDistance = 0;
  let index = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const distance = findPerpendicularDistance(
      points[i],
      points[0],
      points[points.length - 1]
    );
    if (distance > maxDistance) {
      index = i;
      maxDistance = distance;
    }
  }

  if (maxDistance > tolerance) {
    const firstLine = douglasPeucker(points.slice(0, index + 1), tolerance);
    const secondLine = douglasPeucker(points.slice(index), tolerance);
    return [...firstLine.slice(0, -1), ...secondLine];
  }

  return [points[0], points[points.length - 1]];
}

// 简化多边形
function simplifyPolygon(coords, tolerance = 0.02) {
  if (coords.length < 3) return coords;
  const first = coords[0];
  const simplified = douglasPeucker(coords, tolerance);
  if (simplified.length < 3) return coords;
  if (
    JSON.stringify(simplified[simplified.length - 1]) !== JSON.stringify(first)
  ) {
    simplified.push(first);
  }
  return simplified;
}

// 处理每个 Feature 的坐标
function processFeature(feature) {
  try {
    const geometry = feature.geometry;
    const coordinates = geometry.coordinates;
    const encodeOffsets = geometry.encodeOffsets;

    if (geometry.type === "Polygon") {
      const decodedCoordinates = coordinates.map((ring, i) => {
        if (typeof ring === "string") {
          const decoded = decodePolygon(ring, encodeOffsets[i]);
          const compressed = compressCoordinates(decoded);
          return simplifyPolygon(compressed);
        }
        return ring;
      });
      geometry.coordinates = decodedCoordinates;
    } else if (geometry.type === "MultiPolygon") {
      const decodedCoordinates = coordinates.map((polygon, i) => {
        return polygon.map((ring, j) => {
          if (typeof ring === "string") {
            const decoded = decodePolygon(ring, encodeOffsets[i][j]);
            const compressed = compressCoordinates(decoded);
            return simplifyPolygon(compressed);
          }
          return ring;
        });
      });
      geometry.coordinates = decodedCoordinates;
    }

    delete geometry.encodeOffsets;
    return feature;
  } catch (error) {
    console.error("Error processing feature:", feature.properties?.name, error);
    return feature;
  }
}

// 处理所有 features
const processedFeatures = japanData.features.map((feature) =>
  processFeature(feature)
);

// 创建新的 GeoJSON 对象
const newGeoJSON = {
  type: "FeatureCollection",
  features: processedFeatures,
};

delete newGeoJSON.UTF8Encoding;

try {
  // 验证输出
  JSON.stringify(newGeoJSON);

  // 写入新文件
  fs.writeFileSync(
    path.join(dstDir, "JPN.json"),
    JSON.stringify(newGeoJSON),
    "utf8"
  );

  console.log("转换完成！文件已保存到 dst/JPN.json");
} catch (error) {
  console.error("Error saving file:", error);
}

/**
 * 转换地图数据
 * @param {Object} mapConfig - 地图配置对象，key为源文件名，value为目标文件名
 * @param {Object} options - 配置选项
 * @param {string} options.srcDir - 源文件目录，默认为当前目录
 * @param {string} options.dstDir - 目标文件目录，默认为 'dst'
 * @returns {Promise<Object>} - 返回处理结果，key为地图名，value为是否成功
 */
async function convertMaps(mapConfig, options = {}) {
  const srcDir = options.srcDir || __dirname;
  const dstDir = options.dstDir || path.join(__dirname, "dst");

  // 确保输出目录存在
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  const results = {};

  for (const [srcName, dstName] of Object.entries(mapConfig)) {
    try {
      // 读取源文件
      const srcPath = path.join(srcDir, `${srcName}.json`);
      const dstPath = path.join(dstDir, `${dstName}.json`);

      console.log(`Processing ${srcName} -> ${dstName}...`);

      // 检查源文件是否存在
      if (!fs.existsSync(srcPath)) {
        throw new Error(`Source file not found: ${srcPath}`);
      }

      // 读取和解析源文件
      const sourceData = JSON.parse(fs.readFileSync(srcPath, "utf8"));

      // 处理特征
      const processedFeatures = sourceData.features.map((feature) =>
        processFeature(feature)
      );

      // 创建新的 GeoJSON 对象
      const newGeoJSON = {
        type: "FeatureCollection",
        features: processedFeatures,
      };

      // 写入新文件
      fs.writeFileSync(dstPath, JSON.stringify(newGeoJSON), "utf8");

      results[srcName] = true;
      console.log(`Successfully converted ${srcName} to ${dstPath}`);
    } catch (error) {
      results[srcName] = false;
      console.error(`Error converting ${srcName}:`, error);
    }
  }

  return results;
}

// 使用示例：
const mapConfig = {
  // 国家
  Argentina: "ARG",
  Australia: "AUS",
  Austria: "AUT",
  Belgium: "BEL",
  Brazil: "BRA",
  Canada: "CAN",
  Chile: "CHL",
  China: "CHN",
  Colombia: "COL",
  Denmark: "DNK",
  Ecuador: "ECU",
  Egypt: "EGY",
  Finland: "FIN",
  France: "FRA",
  Germany: "DEU",
  Greece: "GRC",
  India: "IND",
  Indonesia: "IDN",
  Iran: "IRN",
  Iraq: "IRQ",
  Ireland: "IRL",
  Israel: "ISR",
  Italy: "ITA",
  Japan: "JPN",
  Malaysia: "MYS",
  Mexico: "MEX",
  Netherlands: "NLD",
  NewZealand: "NZL",
  Norway: "NOR",
  Pakistan: "PAK",
  Philippines: "PHL",
  Poland: "POL",
  Portugal: "PRT",
  Romania: "ROU",
  Russia: "RUS",
  "Saudi Arabia": "SAU",
  Singapore: "SGP",
  "South Africa": "ZAF",
  "South Korea": "KOR",
  Spain: "ESP",
  Sweden: "SWE",
  Switzerland: "CHE",
  Thailand: "THA",
  Turkey: "TUR",
  Ukraine: "UKR",
  "United Kingdom": "GBR",
  "United States": "USA",
  Vietnam: "VNM",
  Algeria: "DZA",
};

convertMaps(mapConfig).then((results) => {
  console.log("Conversion results:", results);
});

module.exports = convertMaps;
