/*  用于geojson文件压缩  mapConfig 为压缩配置项 */
const fs = require("fs");
const path = require("path");

const REGION_MAP = {
  Asia: "asia",
  "North America": "northAmerica",
  Europe: "europe",
  Africa: "africa",
  "South America": "southAmerica",
  Antarctica: "antarctica",
  asia: "Asia",
  northAmerica: "North America",
  europe: "Europe",
  africa: "Africa",
  southAmerica: "South America",
  antarctica: "Antarctica",
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
  "New Caledonia": "NCL",
  Kosovo: "CS-KM",
  "French Southern and Antarctic Lands": "ATF",
  "North Korea": "PRK",
  Somalia: "SOM",
  Liechtenstein: "LIE",
  Morocco: "MAR",
  "W. Sahara": "ESH",
  Serbia: "SRB",
  Afghanistan: "AFG",
  Angola: "AGO",
  Albania: "ALB",
  Aland: "ALA",
  Andorra: "AND",
  "United Arab Emirates": "ARE",
  Armenia: "ARM",
  "American Samoa": "ASM",
  "Fr. S. Antarctic Lands": "ATF",
  "Antigua and Barb.": "ATG",
  Azerbaijan: "AZE",
  Burundi: "BDI",
  Benin: "BEN",
  "Burkina Faso": "BFA",
  Bangladesh: "BGD",
  Bulgaria: "BGR",
  Bahrain: "BHR",
  Bahamas: "BHS",
  "Bosnia and Herz.": "BIH",
  Belarus: "BLR",
  Belize: "BLZ",
  Bermuda: "BMU",
  Bolivia: "BOL",
  Barbados: "BRB",
  Brunei: "BRN",
  Bhutan: "BTN",
  Botswana: "BWA",
  "Central African Rep.": "CAF",
  "Côte d'Ivoire": "CIV",
  Cameroon: "CMR",
  "Dem. Rep. Congo": "COD",
  Congo: "COG",
  Comoros: "COM",
  "Cape Verde": "CPV",
  "Costa Rica": "CRI",
  Cuba: "CUB",
  Curaçao: "CUW",
  "Cayman Is.": "CYM",
  "N. Cyprus": "CYN",
  Cyprus: "CYP",
  "Czech Rep.": "CZE",
  Djibouti: "DJI",
  Dominica: "DMA",
  "Dominican Rep.": "DOM",
  Eritrea: "ERI",
  Estonia: "EST",
  Ethiopia: "ETH",
  Fiji: "FJI",
  "Falkland Is.": "FLK",
  "Faeroe Is.": "FRO",
  Micronesia: "FSM",
  Gabon: "GAB",
  Georgia: "GEO",
  Ghana: "GHA",
  Guinea: "GIN",
  Gambia: "GMB",
  "Guinea-Bissau": "GNB",
  "Eq. Guinea": "GNQ",
  Grenada: "GRD",
  Greenland: "GRL",
  Guatemala: "GTM",
  Guam: "GUM",
  Guyana: "GUY",
  "Heard I. and McDonald Is.": "HMD",
  Honduras: "HND",
  Croatia: "HRV",
  Haiti: "HTI",
  Hungary: "HUN",
  "Isle of Man": "IMN",
  "Br. Indian Ocean Ter.": "IOT",
  Iceland: "ISL",
  Jamaica: "JAM",
  Jersey: "JEY",
  Jordan: "JOR",
  "Siachen Glacier": "SIA",
  Kazakhstan: "KAZ",
  Kenya: "KEN",
  Kyrgyzstan: "KGZ",
  Cambodia: "KHM",
  Kiribati: "KIR",
  Korea: "KOR",
  Kuwait: "KWT",
  "Lao PDR": "LAO",
  Lebanon: "LBN",
  Liberia: "LBR",
  Libya: "LBY",
  "Saint Lucia": "LCA",
  "Sri Lanka": "LKA",
  Lesotho: "LSO",
  Lithuania: "LTU",
  Luxembourg: "LUX",
  Latvia: "LVA",
  Moldova: "MDA",
  Madagascar: "MDG",
  Macedonia: "MKD",
  Mali: "MLI",
  Malta: "MLT",
  Myanmar: "MMR",
  Montenegro: "MNE",
  Mongolia: "MNG",
  "N. Mariana Is.": "MNP",
  Mozambique: "MOZ",
  Mauritania: "MRT",
  Montserrat: "MSR",
  Mauritius: "MUS",
  Malawi: "MWI",
  Namibia: "NAM",
  Niger: "NER",
  Nigeria: "NGA",
  Nicaragua: "NIC",
  Niue: "NIU",
  Nepal: "NPL",
  "New Zealand": "NZL",
  Oman: "OMN",
  Panama: "PAN",
  Peru: "PER",
  Palau: "PLW",
  "Papua New Guinea": "PNG",
  "Puerto Rico": "PRI",
  Paraguay: "PRY",
  Palestine: "PSE",
  "Fr. Polynesia": "PYF",
  Qatar: "QAT",
  Rwanda: "RWA",
  Sudan: "SDN",
  "S. Sudan": "SSD",
  Senegal: "SEN",
  "S. Geo. and S. Sandw. Is.": "SGS",
  "Saint Helena": "SHN",
  "Solomon Is.": "SLB",
  "Sierra Leone": "SLE",
  "El Salvador": "SLV",
  "St. Pierre and Miquelon": "SPM",
  "São Tomé and Principe": "STP",
  Suriname: "SUR",
  Slovakia: "SVK",
  Slovenia: "SVN",
  Swaziland: "SWZ",
  Seychelles: "SYC",
  Syria: "SYR",
  "Turks and Caicos Is.": "TCA",
  Chad: "TCD",
  Togo: "TGO",
  Tajikistan: "TJK",
  Turkmenistan: "TKM",
  "Timor-Leste": "TLS",
  Tonga: "TON",
  "Trinidad and Tobago": "TTO",
  Tunisia: "TUN",
  Tanzania: "TZA",
  Uganda: "UGA",
  Uruguay: "URY",
  Uzbekistan: "UZB",
  "St. Vin. and Gren.": "VCT",
  Venezuela: "VEN",
  "U.S. Virgin Is.": "VGB",
  Vanuatu: "VUT",
  Samoa: "WSM",
  Yemen: "YEM",
  Zambia: "ZMB",
  Zimbabwe: "ZWE",
  ARG: "Argentina",
  AUS: "Australia",
  AUT: "Austria",
  DZA: "Algeria",
  BEL: "Belgium",
  BRA: "Brazil",
  CAN: "Canada",
  CHL: "Chile",
  CHN: "China",
  COL: "Colombia",
  DNK: "Denmark",
  ECU: "Ecuador",
  EGY: "Egypt",
  FIN: "Finland",
  FRA: "France",
  DEU: "Germany",
  GRC: "Greece",
  IND: "India",
  IDN: "Indonesia",
  IRN: "Iran",
  IRQ: "Iraq",
  IRL: "Ireland",
  ISR: "Israel",
  ITA: "Italy",
  JPN: "Japan",
  MYS: "Malaysia",
  MEX: "Mexico",
  NLD: "Netherlands",
  NOR: "Norway",
  PAK: "Pakistan",
  PHL: "Philippines",
  POL: "Poland",
  PRT: "Portugal",
  ROU: "Romania",
  RUS: "Russia",
  SAU: "Saudi Arabia",
  SGP: "Singapore",
  ZAF: "South Africa",
  ESP: "Spain",
  SWE: "Sweden",
  CHE: "Switzerland",
  THA: "Thailand",
  TUR: "Turkey",
  UKR: "Ukraine",
  GBR: "United Kingdom",
  USA: "United States",
  VNM: "Vietnam",
  NCL: "New Caledonia",
  "CS-KM": "Kosovo",
  ATF: "Fr. S. Antarctic Lands",
  PRK: "North Korea",
  SOM: "Somalia",
  LIE: "Liechtenstein",
  MAR: "Morocco",
  ESH: "W. Sahara",
  SRB: "Serbia",
  AFG: "Afghanistan",
  AGO: "Angola",
  ALB: "Albania",
  ALA: "Aland",
  AND: "Andorra",
  ARE: "United Arab Emirates",
  ARM: "Armenia",
  ASM: "American Samoa",
  ATG: "Antigua and Barb.",
  AZE: "Azerbaijan",
  BDI: "Burundi",
  BEN: "Benin",
  BFA: "Burkina Faso",
  BGD: "Bangladesh",
  BGR: "Bulgaria",
  BHR: "Bahrain",
  BHS: "Bahamas",
  BIH: "Bosnia and Herz.",
  BLR: "Belarus",
  BLZ: "Belize",
  BMU: "Bermuda",
  BOL: "Bolivia",
  BRB: "Barbados",
  BRN: "Brunei",
  BTN: "Bhutan",
  BWA: "Botswana",
  CAF: "Central African Rep.",
  CIV: "Côte d'Ivoire",
  CMR: "Cameroon",
  COD: "Dem. Rep. Congo",
  COG: "Congo",
  COM: "Comoros",
  CPV: "Cape Verde",
  CRI: "Costa Rica",
  CUB: "Cuba",
  CUW: "Curaçao",
  CYM: "Cayman Is.",
  CYN: "N. Cyprus",
  CYP: "Cyprus",
  CZE: "Czech Rep.",
  DJI: "Djibouti",
  DMA: "Dominica",
  DOM: "Dominican Rep.",
  ERI: "Eritrea",
  EST: "Estonia",
  ETH: "Ethiopia",
  FJI: "Fiji",
  FLK: "Falkland Is.",
  FRO: "Faeroe Is.",
  FSM: "Micronesia",
  GAB: "Gabon",
  GEO: "Georgia",
  GHA: "Ghana",
  GIN: "Guinea",
  GMB: "Gambia",
  GNB: "Guinea-Bissau",
  GNQ: "Eq. Guinea",
  GRD: "Grenada",
  GRL: "Greenland",
  GTM: "Guatemala",
  GUM: "Guam",
  GUY: "Guyana",
  HMD: "Heard I. and McDonald Is.",
  HND: "Honduras",
  HRV: "Croatia",
  HTI: "Haiti",
  HUN: "Hungary",
  IMN: "Isle of Man",
  IOT: "Br. Indian Ocean Ter.",
  ISL: "Iceland",
  JAM: "Jamaica",
  JEY: "Jersey",
  JOR: "Jordan",
  SIA: "Siachen Glacier",
  KAZ: "Kazakhstan",
  KEN: "Kenya",
  KGZ: "Kyrgyzstan",
  KHM: "Cambodia",
  KIR: "Kiribati",
  KOR: "Korea",
  KWT: "Kuwait",
  LAO: "Lao PDR",
  LBN: "Lebanon",
  LBR: "Liberia",
  LBY: "Libya",
  LCA: "Saint Lucia",
  LKA: "Sri Lanka",
  LSO: "Lesotho",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  LVA: "Latvia",
  MDA: "Moldova",
  MDG: "Madagascar",
  MKD: "Macedonia",
  MLI: "Mali",
  MLT: "Malta",
  MMR: "Myanmar",
  MNE: "Montenegro",
  MNG: "Mongolia",
  MNP: "N. Mariana Is.",
  MOZ: "Mozambique",
  MRT: "Mauritania",
  MSR: "Montserrat",
  MUS: "Mauritius",
  MWI: "Malawi",
  NAM: "Namibia",
  NER: "Niger",
  NGA: "Nigeria",
  NIC: "Nicaragua",
  NIU: "Niue",
  NPL: "Nepal",
  NZL: "New Zealand",
  OMN: "Oman",
  PAN: "Panama",
  PER: "Peru",
  PLW: "Palau",
  PNG: "Papua New Guinea",
  PRI: "Puerto Rico",
  PRY: "Paraguay",
  PSE: "Palestine",
  PYF: "Fr. Polynesia",
  QAT: "Qatar",
  RWA: "Rwanda",
  SDN: "Sudan",
  SSD: "S. Sudan",
  SEN: "Senegal",
  SGS: "S. Geo. and S. Sandw. Is.",
  SHN: "Saint Helena",
  SLB: "Solomon Is.",
  SLE: "Sierra Leone",
  SLV: "El Salvador",
  SPM: "St. Pierre and Miquelon",
  STP: "São Tomé and Principe",
  SUR: "Suriname",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SWZ: "Swaziland",
  SYC: "Seychelles",
  SYR: "Syria",
  TCA: "Turks and Caicos Is.",
  TCD: "Chad",
  TGO: "Togo",
  TJK: "Tajikistan",
  TKM: "Turkmenistan",
  TLS: "Timor-Leste",
  TON: "Tonga",
  TTO: "Trinidad and Tobago",
  TUN: "Tunisia",
  TZA: "Tanzania",
  UGA: "Uganda",
  URY: "Uruguay",
  UZB: "Uzbekistan",
  VCT: "St. Vin. and Gren.",
  VEN: "Venezuela",
  VGB: "U.S. Virgin Is.",
  VUT: "Vanuatu",
  WSM: "Samoa",
  YEM: "Yemen",
  ZMB: "Zambia",
  ZWE: "Zimbabwe",
  North_America: "northAmerica",
  South_America: "southAmerica",
  Saudi_Arabia: "SAU",
  South_Africa: "ZAF",
  South_Korea: "KOR",
  United_Kingdom: "GBR",
  United_States: "USA",
  New_Caledonia: "NCL",
  "French_Southern and Antarctic Lands": "ATF",
  North_Korea: "PRK",
  "W._Sahara": "ESH",
  "United_Arab Emirates": "ARE",
  American_Samoa: "ASM",
  "Fr._S. Antarctic Lands": "ATF",
  "Antigua_and Barb.": "ATG",
  Burkina_Faso: "BFA",
  "Bosnia_and Herz.": "BIH",
  "Central_African Rep.": "CAF",
  "Côte_d'Ivoire": "CIV",
  "Dem._Rep. Congo": "COD",
  Cape_Verde: "CPV",
  Costa_Rica: "CRI",
  "Cayman_Is.": "CYM",
  "N._Cyprus": "CYN",
  "Czech_Rep.": "CZE",
  "Dominican_Rep.": "DOM",
  "Falkland_Is.": "FLK",
  "Faeroe_Is.": "FRO",
  "Eq._Guinea": "GNQ",
  "Heard_I. and McDonald Is.": "HMD",
  "Isle_of Man": "IMN",
  "Br._Indian Ocean Ter.": "IOT",
  Siachen_Glacier: "SIA",
  Lao_PDR: "LAO",
  Saint_Lucia: "LCA",
  Sri_Lanka: "LKA",
  "N._Mariana Is.": "MNP",
  New_Zealand: "NZL",
  "Papua_New Guinea": "PNG",
  Puerto_Rico: "PRI",
  "Fr._Polynesia": "PYF",
  "S._Sudan": "SSD",
  "S._Geo. and S. Sandw. Is.": "SGS",
  Saint_Helena: "SHN",
  "Solomon_Is.": "SLB",
  Sierra_Leone: "SLE",
  El_Salvador: "SLV",
  "St._Pierre and Miquelon": "SPM",
  "São_Tomé and Principe": "STP",
  "Turks_and Caicos Is.": "TCA",
  "Trinidad_and Tobago": "TTO",
  "St._Vin. and Gren.": "VCT",
  "U.S._Virgin Is.": "VGB",
};

// 配置对象
const config = {
  precision: 3, // 坐标精度，小数点后位数
  srcDir: path.join(__dirname), // 源文件目录
  dstDir: path.join(__dirname, "res"), // 输出目录
};

// 地图配置
const mapConfig = {
  // Japan: "JPN", // 源文件名: 输出文件名
  // world: "world",
  worldzh: "worldzh",
  // 可以添加更多地图配置
};

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

// 压缩坐标精度
function compressCoordinates(coords, precision = config.precision) {
  if (!Array.isArray(coords)) return coords;

  // 处理多维数组
  if (Array.isArray(coords[0])) {
    return coords.map((coord) => compressCoordinates(coord, precision));
  }

  // 处理单个坐标点
  const compressed = coords.map((num) => Number(num.toFixed(precision)));
  return isValidCoordinate(compressed) ? compressed : coords;
}
const arr = [];
// 压缩 GeoJSON 数据
function compressGeoJSON(geoJSON) {
  console.log(
    "🚀 ~ file: index2.js:202 ~ compressGeoJSON ~ geoJSON:",
    geoJSON?.features
  );
  const compressedGeoJSON = {
    type: geoJSON.type,
    features: geoJSON.features.map((feature) => {
      if (!REGION_MAP[feature.properties.iso_a3]) {
        arr.push(feature.properties.iso_a3);
      }
      return {
        type: feature.type,
        id: feature.properties.iso_a3,
        no_id: REGION_MAP[feature.properties.iso_a3] ? false : true,
        properties: {
          ...feature.properties,
          id: feature.properties.iso_a3,
          iso_a4: REGION_MAP[feature.properties.iso_a3]
            ? REGION_MAP[feature.properties.iso_a3]
            : feature.properties.iso_a3,
        },
        geometry: {
          type: feature.geometry.type,
          coordinates: compressCoordinates(feature.geometry.coordinates),
        },
      };
    }),
  };
  console.log(
    "🚀 ~ file: index2.js:208 ~ features:geoJSON.features.map ~ arr:",
    JSON.stringify(arr)
  );

  return compressedGeoJSON;
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
    path.join(config.dstDir, "JPN.json"),
    JSON.stringify(newGeoJSON),
    "utf8"
  );

  console.log("转换完成！文件已保存到 res/JPN.json");
} catch (error) {
  console.error("Error saving file:", error);
}

// 处理单个地图文件
async function processMapFile(srcName, dstName) {
  try {
    const srcPath = path.join(config.srcDir, `${srcName}.json`);
    const dstPath = path.join(config.dstDir, `${dstName}.json`);

    console.log(`处理文件: ${srcName} -> ${dstName}`);

    // 检查源文件是否存在
    if (!fs.existsSync(srcPath)) {
      throw new Error(`源文件不存在: ${srcPath}`);
    }

    // 读取和解析源文件
    const sourceData = JSON.parse(fs.readFileSync(srcPath, "utf8"));

    // 压缩数据
    const compressedData = compressGeoJSON(sourceData);

    // 确保输出目录存在
    if (!fs.existsSync(config.dstDir)) {
      fs.mkdirSync(config.dstDir, { recursive: true });
    }

    // 写入压缩后的文件
    fs.writeFileSync(dstPath, JSON.stringify(compressedData), "utf8");

    console.log(`成功转换 ${srcName} 到 ${dstPath}`);
    return true;
  } catch (error) {
    console.error(`处理 ${srcName} 时发生错误:`, error);
    return false;
  }
}

// 主函数：处理所有配置的地图
async function processAllMaps() {
  const results = {};

  for (const [srcName, dstName] of Object.entries(mapConfig)) {
    results[srcName] = await processMapFile(srcName, dstName);
  }

  return results;
}

// 执行转换
processAllMaps().then((results) => {
  console.log("转换结果:", results);
});

module.exports = {
  processAllMaps,
  processMapFile,
  config,
};
