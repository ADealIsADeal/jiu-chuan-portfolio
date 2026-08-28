import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";
import { chinaProvinceGeojson } from "./china-provinces-data.js";
import { chinaCityMaps } from "./china-city-maps-data.js";

const canvas = document.querySelector("#ambient-canvas");
const pageLoader = document.querySelector("#page-loader");
const heroVideo = document.querySelector(".hero-cg");
const ctx = canvas.getContext("2d");
const points = [];

function hidePageLoader() {
  pageLoader?.classList.add("is-hidden");
}

window.addEventListener("load", hidePageLoader, { once: true });
heroVideo?.addEventListener("canplay", hidePageLoader, { once: true });
setTimeout(hidePageLoader, 4200);

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function seedParticles() {
  points.length = 0;
  const count = Math.min(72, Math.floor(window.innerWidth / 18));
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      hue: Math.random() > 0.72 ? "233,196,106" : "105,230,255",
    });
  }
}

function drawAmbient() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;
    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${point.hue},0.56)`;
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = index + 1; j < points.length; j += 1) {
      const other = points[j];
      const dx = point.x - other.x;
      const dy = point.y - other.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 118) {
        ctx.strokeStyle = `rgba(210,235,246,${(1 - dist / 118) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawAmbient);
}

resizeCanvas();
seedParticles();
drawAmbient();
window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((section) => observer.observe(section));

const visitedProvinceDetails = {
  北京: {
    region: "华北",
    note: "胡同、展馆和傍晚的风，把高密度城市拉回到更慢的尺度。",
    cities: [{ name: "北京", tag: "胡同 / 展馆" }],
  },
  上海: {
    region: "华东",
    note: "适合观察商业、设计和城市效率，很多灵感会从街角、橱窗和地铁站冒出来。",
    cities: [{ name: "上海", tag: "城市效率" }],
  },
  重庆: { region: "西南", note: "山城的坡度、江面的雾和夜色里的灯，把城市变成一场持续发生的体验。", cities: [{ name: "重庆", tag: "山城 / 江景" }] },
  香港: { region: "华南", note: "高密度、快节奏，也有藏在街巷和海风里的松弛感。", cities: [{ name: "香港", tag: "城市 / 海风" }] },
  安徽: { region: "华东", note: "从江淮到黄山，城市、山水与记忆彼此连接。", cities: ["合肥","芜湖","蚌埠","淮南","淮北","铜陵","安庆","黄山","滁州","阜阳","宿州","六安","池州"].map(name => ({ name, tag: "安徽足迹" })) },
  福建: { region: "华东", note: "山海相连，城市里有很鲜明的生活质感与开放气息。", cities: ["福州","厦门","三明","漳州","南平","龙岩","宁德"].map(name => ({ name, tag: "福建足迹" })) },
  甘肃: { region: "西北", note: "河西走廊与陇原山川，留下了很有纵深感的旅行记忆。", cities: ["兰州","天水","定西"].map(name => ({ name, tag: "甘肃足迹" })) },
  广东: { region: "华南", note: "很适合把想法推进成行动，空气里有一种快速试错、快速生长的动能。", cities: ["广州","韶关","深圳","佛山","惠州","汕尾","河源","清远","东莞","中山","揭阳"].map(name => ({ name, tag: "广东足迹" })) },
  广西: { region: "华南", note: "山水之间的城市节奏，让旅途拥有很柔软的边界。", cities: [{ name: "桂林", tag: "山水 / 漓江" }] },
  河北: { region: "华北", note: "北方城市的风物与历史，在不同的城市尺度里展开。", cities: ["张家口","承德","廊坊"].map(name => ({ name, tag: "河北足迹" })) },
  河南: { region: "华中", note: "中原大地连接着城市生活与漫长的历史时间。", cities: ["郑州","洛阳","新乡"].map(name => ({ name, tag: "河南足迹" })) },
  黑龙江: { region: "东北", note: "北方的季节感和城市性格，构成了很独特的旅行记忆。", cities: [{ name: "哈尔滨", tag: "冰城 / 建筑" }] },
  湖北: { region: "华中", note: "江城与湖泊之间，城市保持着热烈又松弛的节奏。", cities: ["黄冈","武汉","咸宁"].map(name => ({ name, tag: "湖北足迹" })) },
  湖南: { region: "华中", note: "山水、烟火与热烈的城市气质，组成了一段鲜活的旅程。", cities: ["长沙","株洲","衡阳","郴州"].map(name => ({ name, tag: "湖南足迹" })) },
  吉林: { region: "东北", note: "长白山与松花江的北方气息，留下了清晰的季节记忆。", cities: ["长春","吉林","延边朝鲜族自治州"].map(name => ({ name, tag: "吉林足迹" })) },
  江苏: { region: "华东", note: "江南城市的秩序、尺度与生活感，在水网之间自然展开。", cities: ["南京","苏州","扬州"].map(name => ({ name, tag: "江苏足迹" })) },
  江西: { region: "华东", note: "山水与旧城交织，旅途在不同城市之间慢慢沉淀。", cities: ["南昌","萍乡","九江","赣州","吉安","上饶"].map(name => ({ name, tag: "江西足迹" })) },
  辽宁: { region: "东北", note: "海岸、工业与城市生活，构成东北很有力量的空间感。", cities: [{ name: "大连", tag: "海岸 / 城市" }] },
  内蒙古: { region: "华北", note: "辽阔的地理尺度，让旅行从城市延伸到更大的风景。", cities: ["赤峰","乌兰察布"].map(name => ({ name, tag: "内蒙古足迹" })) },
  青海: { region: "西北", note: "高原的光线和辽阔感，让每座城市都拥有不同的观看方式。", cities: ["西宁","海东","海北藏族自治州","玉树藏族自治州","海西蒙古族藏族自治州"].map(name => ({ name, tag: "青海足迹" })) },
  山东: { region: "华东", note: "沿海城市与齐鲁文化并置，旅途有着清晰而厚重的方向感。", cities: ["济南","青岛","淄博","烟台","潍坊","日照","滨州"].map(name => ({ name, tag: "山东足迹" })) },
  山西: { region: "华北", note: "古城、山河和时间留下的纹理，让行走本身变成一种阅读。", cities: [{ name: "大同", tag: "古城 / 历史" }] },
  陕西: { region: "西北", note: "历史感非常具体，走在城墙和街巷里，会自然开始思考时间的厚度。", cities: ["咸阳","西安"].map(name => ({ name, tag: "陕西足迹" })) },
  四川: { region: "西南", note: "松弛、热闹、有人情味。它提醒人，好的体验不只有效率，还有停留。", cities: ["成都","雅安","甘孜藏族自治州"].map(name => ({ name, tag: "四川足迹" })) },
  西藏: { region: "西南", note: "高原的光线、距离和安静，让每一次抵达都变得格外具体。", cities: ["拉萨","昌都","林芝","那曲"].map(name => ({ name, tag: "西藏足迹" })) },
  新疆: { region: "西北", note: "辽阔的空间和多样的地貌，把旅途拉伸成一条很长的时间线。", cities: ["乌鲁木齐","昌吉回族自治州","博尔塔拉蒙古自治州","巴音郭楞蒙古自治州","克孜勒苏柯尔克孜自治州","喀什地区","伊犁哈萨克自治州","塔城地区","石河子市","可克达拉"].map(name => ({ name, tag: "新疆足迹" })) },
  云南: { region: "西南", note: "高原、湖泊与古城之间，旅行保留了很丰富的生活层次。", cities: ["昆明","大理白族自治州"].map(name => ({ name, tag: "云南足迹" })) },
};

const mapCanvas = document.querySelector("#travel-map-canvas");
const mapContainer = document.querySelector(".three-map");
const panel = document.querySelector("#place-panel");
const cityList = document.querySelector("#city-list");
const cityMapCanvas = document.querySelector("#city-map-canvas");
const cityMapCard = document.querySelector(".city-map-card");
const chips = document.querySelector("#province-chips");
const visitedCount = document.querySelector("#visited-count");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x071016, 14, 34);

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(0.1, -1.95, 12.4);
camera.lookAt(0.05, -0.2, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: mapCanvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const mapGroup = new THREE.Group();
mapGroup.rotation.x = -0.2;
mapGroup.rotation.z = -0.05;
scene.add(mapGroup);

const provinceMeshes = [];
const mainLabelMeshes = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const baseMaterial = new THREE.MeshStandardMaterial({
  color: 0x163341,
  roughness: 0.56,
  metalness: 0.22,
});
const visitedMaterial = new THREE.MeshStandardMaterial({
  color: 0x27c5dd,
  emissive: 0x125766,
  emissiveIntensity: 0.5,
  roughness: 0.38,
  metalness: 0.36,
});
const activeMaterial = new THREE.MeshStandardMaterial({
  color: 0xe9c46a,
  emissive: 0x5c4313,
  emissiveIntensity: 0.72,
  roughness: 0.3,
  metalness: 0.44,
});
const selectedBaseMaterial = new THREE.MeshStandardMaterial({
  color: 0x25485a,
  emissive: 0x182f3b,
  emissiveIntensity: 0.45,
  roughness: 0.44,
  metalness: 0.3,
});
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xd9f4ff,
  transparent: true,
  opacity: 0.28,
});
const cityBaseMaterial = new THREE.MeshStandardMaterial({
  color: 0x173443,
  roughness: 0.58,
  metalness: 0.22,
});
const cityVisitedMaterial = new THREE.MeshStandardMaterial({
  color: 0x38d7ee,
  emissive: 0x14606f,
  emissiveIntensity: 0.82,
  roughness: 0.34,
  metalness: 0.34,
});
const cityLineMaterial = new THREE.LineBasicMaterial({
  color: 0xd9f4ff,
  transparent: true,
  opacity: 0.34,
});

const ambientLight = new THREE.HemisphereLight(0xb8efff, 0x071016, 2.1);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
keyLight.position.set(-4, -5, 9);
keyLight.castShadow = true;
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x69e6ff, 7.5, 16);
rimLight.position.set(4, -4, 3);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6.9, 96),
  new THREE.MeshBasicMaterial({
    color: 0x0c1d25,
    transparent: true,
    opacity: 0.42,
  })
);
floor.position.z = -0.18;
mapGroup.add(floor);

const cityScene = new THREE.Scene();
cityScene.fog = new THREE.Fog(0x071016, 9, 22);

const cityCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
cityCamera.position.set(0, -2.2, 7.6);
cityCamera.lookAt(0, -0.04, 0);

const cityRenderer = new THREE.WebGLRenderer({
  canvas: cityMapCanvas,
  antialias: true,
  alpha: true,
});
cityRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const cityGroup = new THREE.Group();
cityGroup.rotation.x = -0.28;
cityScene.add(cityGroup);

const cityHemisphereLight = new THREE.HemisphereLight(0xb8efff, 0x071016, 2.2);
cityScene.add(cityHemisphereLight);

const cityKeyLight = new THREE.DirectionalLight(0xffffff, 2.6);
cityKeyLight.position.set(-2.4, -3.2, 6);
cityScene.add(cityKeyLight);

const cityGlowLight = new THREE.PointLight(0x69e6ff, 5.2, 9);
cityGlowLight.position.set(2.8, -2.4, 3.2);
cityScene.add(cityGlowLight);

const cityFloor = new THREE.Mesh(
  new THREE.CircleGeometry(3.1, 80),
  new THREE.MeshBasicMaterial({
    color: 0x0b1d25,
    transparent: true,
    opacity: 0.46,
  })
);
cityFloor.position.z = -0.08;
cityGroup.add(cityFloor);

const cityMeshes = [];
const cityView = {
  rotationX: -0.28,
  rotationZ: 0,
  targetRotationX: -0.28,
  targetRotationZ: 0,
  zoom: 1,
  targetZoom: 1,
};
let isCityDragging = false;
let lastCityPointer = { x: 0, y: 0 };

function normalizeProvinceName(name) {
  if (!name) return "南海诸岛";
  return name
    .replace(/特别行政区$/, "")
    .replace(/壮族自治区$/, "")
    .replace(/回族自治区$/, "")
    .replace(/维吾尔自治区$/, "")
    .replace(/自治区$/, "")
    .replace(/[省市]$/, "");
}

function normalizePlaceName(name) {
  if (!name) return "";
  return name
    .replace(/特别行政区$/, "")
    .replace(/蒙古自治州$/, "")
    .replace(/藏族自治州$/, "")
    .replace(/回族自治州$/, "")
    .replace(/土家族苗族自治州$/, "")
    .replace(/哈尼族彝族自治州$/, "")
    .replace(/傣族自治州$/, "")
    .replace(/白族自治州$/, "")
    .replace(/壮族苗族自治州$/, "")
    .replace(/苗族侗族自治州$/, "")
    .replace(/布依族苗族自治州$/, "")
    .replace(/哈萨克自治州$/, "")
    .replace(/柯尔克孜自治州$/, "")
    .replace(/朝鲜族自治州$/, "")
    .replace(/自治州$/, "")
    .replace(/地区$/, "")
    .replace(/盟$/, "")
    .replace(/[市区县旗]$/, "");
}

function forEachCoordinate(features, callback, includeAuxiliary = true) {
  features.forEach((feature) => {
    if (!includeAuxiliary && !feature.properties?.name) return;
    const geometry = feature.geometry;
    if (!geometry) return;

    const polygons =
      geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    polygons.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((coordinate) => callback(coordinate, feature));
      });
    });
  });
}

function getGeoBounds(features) {
  const bounds = {
    minLon: Infinity,
    maxLon: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity,
  };

  forEachCoordinate(
    features,
    ([lon, lat]) => {
      bounds.minLon = Math.min(bounds.minLon, lon);
      bounds.maxLon = Math.max(bounds.maxLon, lon);
      bounds.minLat = Math.min(bounds.minLat, lat);
      bounds.maxLat = Math.max(bounds.maxLat, lat);
    },
    false
  );

  return bounds;
}

const geoFeatures = chinaProvinceGeojson.features;
const cityFeatureRecords = geoFeatures.flatMap((provinceFeature) => {
  const province = {
    name: normalizeProvinceName(provinceFeature.properties?.name),
    sourceName: provinceFeature.properties?.name || "南海诸岛",
    adcode: provinceFeature.properties?.adcode,
  };
  const cityFeatures = chinaCityMaps[String(province.adcode)]?.features || [];
  return (cityFeatures.length ? cityFeatures : [provinceFeature]).map((feature) => ({
    feature,
    province,
  }));
});
const mapFeatures = cityFeatureRecords.map(({ feature }) => feature);
const geoBounds = getGeoBounds(mapFeatures.length ? mapFeatures : geoFeatures);
const geoCenter = {
  lon: (geoBounds.minLon + geoBounds.maxLon) / 2,
  lat: (geoBounds.minLat + geoBounds.maxLat) / 2,
};
const lonScale = Math.cos((geoCenter.lat * Math.PI) / 180);
const mapScale = Math.min(
  8.7 / ((geoBounds.maxLon - geoBounds.minLon) * lonScale),
  6.45 / (geoBounds.maxLat - geoBounds.minLat)
);

function projectCoordinate([lon, lat]) {
  return [
    (lon - geoCenter.lon) * lonScale * mapScale,
    (lat - geoCenter.lat) * mapScale,
  ];
}

function createRingShape(ring) {
  const [startX, startY] = projectCoordinate(ring[0]);
  const shape = new THREE.Shape();
  shape.moveTo(startX, startY);
  ring.slice(1).forEach((point) => {
    const [x, y] = projectCoordinate(point);
    shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function createProvinceShapes(geometry) {
  if (!geometry) return [];
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons
    .map((polygon) => {
      const [outerRing, ...holeRings] = polygon;
      if (!outerRing || outerRing.length < 3) return null;
      const shape = createRingShape(outerRing);
      holeRings.forEach((ring) => {
        if (ring.length >= 3) shape.holes.push(createRingShape(ring));
      });
      return shape;
    })
    .filter(Boolean);
}

function createTextSprite(text, color = "#dce7ee", options = {}) {
  const fontSize = options.fontSize || 38;
  const labelCanvas = document.createElement("canvas");
  const labelCtx = labelCanvas.getContext("2d");
  labelCanvas.width = 320;
  labelCanvas.height = 96;
  labelCtx.font = `800 ${fontSize}px PingFang SC, Microsoft YaHei, sans-serif`;
  labelCtx.textAlign = "center";
  labelCtx.textBaseline = "middle";
  labelCtx.shadowColor = "rgba(0,0,0,0.88)";
  labelCtx.shadowBlur = 18;
  labelCtx.lineJoin = "round";
  labelCtx.strokeStyle = "rgba(2,8,12,0.86)";
  labelCtx.lineWidth = 8;
  labelCtx.strokeText(text, 160, 48);
  labelCtx.fillStyle = color;
  labelCtx.fillText(text, 160, 48);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.anisotropy = 4;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
  );
  sprite.renderOrder = 20;
  sprite.scale.set(options.width || 0.82, options.height || 0.26, 1);
  return sprite;
}

function provinceCenter(feature) {
  const points = [];
  forEachCoordinate([feature], (coordinate) => {
    points.push(projectCoordinate(coordinate));
  });
  const total = points.reduce((acc, point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
  return [total[0] / points.length, total[1] / points.length];
}

function getVisitedCityNames(detail) {
  return new Set((detail?.cities || []).map((city) => normalizePlaceName(city.name)));
}

function isVisitedCity(cityName, provinceName, detail) {
  const visitedCities = getVisitedCityNames(detail);
  const normalizedCity = normalizePlaceName(cityName);
  const normalizedProvince = normalizePlaceName(provinceName);
  return (
    visitedCities.has(normalizedCity) ||
    (visitedCities.has(normalizedProvince) &&
      ["北京", "上海", "天津", "重庆", "香港", "澳门"].includes(normalizedProvince))
  );
}

function createCityProjection(features) {
  const bounds = getGeoBounds(features);
  const center = {
    lon: (bounds.minLon + bounds.maxLon) / 2,
    lat: (bounds.minLat + bounds.maxLat) / 2,
  };
  const scaleX = Math.cos((center.lat * Math.PI) / 180);
  const width = Math.max((bounds.maxLon - bounds.minLon) * scaleX, 0.001);
  const height = Math.max(bounds.maxLat - bounds.minLat, 0.001);
  const scale = Math.min(4.2 / width, 2.9 / height);
  return ([lon, lat]) => [
    (lon - center.lon) * scaleX * scale,
    (lat - center.lat) * scale,
  ];
}

function createProjectedRingShape(ring, project) {
  const [startX, startY] = project(ring[0]);
  const shape = new THREE.Shape();
  shape.moveTo(startX, startY);
  ring.slice(1).forEach((point) => {
    const [x, y] = project(point);
    shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function createProjectedShapes(geometry, project) {
  if (!geometry) return [];
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons
    .map((polygon) => {
      const [outerRing, ...holeRings] = polygon;
      if (!outerRing || outerRing.length < 3) return null;
      const shape = createProjectedRingShape(outerRing, project);
      holeRings.forEach((ring) => {
        if (ring.length >= 3) shape.holes.push(createProjectedRingShape(ring, project));
      });
      return shape;
    })
    .filter(Boolean);
}

function featureCenter(feature, project) {
  const labelCoordinate = feature.properties?.centroid || feature.properties?.center;
  if (Array.isArray(labelCoordinate) && labelCoordinate.length >= 2) {
    return project(labelCoordinate);
  }

  const points = [];
  forEachCoordinate([feature], (coordinate) => points.push(project(coordinate)));
  const total = points.reduce((acc, point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
  return [total[0] / points.length, total[1] / points.length];
}

function renderCityMap(province, detail, fallbackFeature) {
  cityMeshes.splice(0).forEach((mesh) => {
    cityGroup.remove(mesh);
    mesh.traverse((child) => {
      child.geometry?.dispose?.();
      if (child.material && child.material !== cityLineMaterial) child.material.dispose?.();
    });
  });

  const cityGeojson = chinaCityMaps[String(province.adcode)];
  const features = cityGeojson?.features?.length ? cityGeojson.features : [fallbackFeature];
  const hasCityData = Boolean(cityGeojson?.features?.length);
  cityMapCard.classList.toggle("empty", !features.length);
  if (!features.length) return;

  const project = createCityProjection(features);

  features.forEach((feature) => {
    const cityName = feature.properties?.name || province.name;
    const visited = isVisitedCity(cityName, province.name, detail);
    const shapes = createProjectedShapes(feature.geometry, project);
    if (!shapes.length) return;

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    });
    const mesh = new THREE.Mesh(
      geometry,
      visited ? cityVisitedMaterial.clone() : cityBaseMaterial.clone()
    );
    mesh.userData = {
      cityName,
      visited,
      targetZ: visited ? 0.22 : 0,
    };

    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), cityLineMaterial);
    mesh.add(edge);

    if (visited) {
      const [x, y] = featureCenter(feature, project);
      const label = createTextSprite(normalizePlaceName(cityName), "#f8fcff", {
        fontSize: 30,
        width: 0.46,
        height: 0.15,
      });
      label.position.set(x, y, 0.42);
      mesh.add(label);
    }

    cityMeshes.push(mesh);
    cityGroup.add(mesh);
  });

  cityView.targetRotationX = -0.28;
  cityView.targetRotationZ = province.name === "广东" || province.name === "海南" ? 0.04 : -0.03;
  cityView.targetZoom = 1;
}

cityFeatureRecords.forEach(({ feature, province }) => {
  const shapes = createProvinceShapes(feature.geometry);
  if (!shapes.length) return;

  const cityName = feature.properties?.name || province.name;
  const isVisited = isVisitedCity(cityName, province.name, visitedProvinceDetails[province.name]);
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  geometry.computeBoundingBox();

  const mesh = new THREE.Mesh(geometry, isVisited ? visitedMaterial.clone() : baseMaterial.clone());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = {
    province,
    feature,
    isVisited,
    targetZ: 0,
  };

  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), lineMaterial);
  mesh.add(edge);

  const [cx, cy] = provinceCenter(feature);
  const label = createTextSprite(normalizePlaceName(cityName), isVisited ? "#f8fcff" : "#8fa2ab", {
    fontSize: 27,
    width: 0.62,
    height: 0.2,
  });
  label.position.set(cx, cy - 0.1, 0.62);
  label.visible = false;
  label.userData = { cityName, provinceName: province.name };
  mainLabelMeshes.push(label);
  mesh.add(label);

  provinceMeshes.push(mesh);
  mapGroup.add(mesh);
});

const activeProvinceNames = Object.keys(visitedProvinceDetails);
visitedCount.textContent = activeProvinceNames.length;

activeProvinceNames.forEach((name, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `province-chip${index === 0 ? " active" : ""}`;
  button.textContent = name;
  button.addEventListener("click", () => {
    const mesh = provinceMeshes.find((item) => item.userData.province.name === name);
    if (mesh) selectProvince(mesh);
  });
  chips.appendChild(button);
});

function updatePanel(mesh) {
  const { province, feature, isVisited } = mesh.userData;
  const detail = visitedProvinceDetails[province.name];
  const cities = detail?.cities || [];
  panel.querySelector("h3").textContent = province.name;
  panel.querySelector(".place-meta").textContent =
    `${detail?.region || province.sourceName} / ${isVisited ? "已点亮" : "未点亮"} / ${cities.length} 城市`;
  panel.querySelector(".place-note").textContent =
    detail?.note || "这片区域还没有写入旅行记录。点开它可以先查看市级边界，之后再补上去过的城市。";
  cityList.innerHTML = "";
  if (!cities.length) {
    const item = document.createElement("div");
    item.className = "city-item";
    item.innerHTML = "<strong>尚未记录城市</strong><span>未点亮</span>";
    cityList.appendChild(item);
  }
  cities.forEach((city) => {
    const item = document.createElement("div");
    item.className = "city-item";
    item.innerHTML = `<strong>${city.name}</strong><span>${city.tag}</span>`;
    cityList.appendChild(item);
  });
  renderCityMap(province, detail, feature);
  document.querySelectorAll(".province-chip").forEach((button) => {
    button.classList.toggle("active", button.textContent === province.name);
  });
}

let targetMapZoom = 12.4;
let selectedMesh = provinceMeshes.find((mesh) => mesh.userData.province.name === "北京");
let hoveredMesh = null;

function updateMainLabels() {
  const selectedProvince = selectedMesh?.userData.province.name;
  const zoomed = targetMapZoom < 10.9;
  mainLabelMeshes.forEach((label) => {
    const { cityName, provinceName } = label.userData;
    const shortName = normalizePlaceName(cityName);
    const visited = isVisitedCity(cityName, provinceName, visitedProvinceDetails[provinceName]);
    label.visible = visited && (zoomed || shortName.length <= 3 || provinceName === selectedProvince);
  });
}

selectProvince(selectedMesh);

function selectProvince(mesh) {
  if (!mesh) return;
  selectedMesh = mesh;
  updatePanel(mesh);
  provinceMeshes.forEach((item) => {
    item.material = item.userData.isVisited ? visitedMaterial.clone() : baseMaterial.clone();
    item.userData.targetZ = item === selectedMesh ? 0.62 : 0;
  });
  mesh.material = mesh.userData.isVisited ? activeMaterial.clone() : selectedBaseMaterial.clone();
  updateMainLabels();
}

function setPointerFromEvent(event) {
  const rect = mapCanvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pickProvince(event, shouldSelect = false) {
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(provinceMeshes, false);
  const mesh = hits[0]?.object || null;

  if (hoveredMesh && hoveredMesh !== selectedMesh) hoveredMesh.userData.targetZ = 0;
  hoveredMesh = mesh;
  mapContainer.style.cursor = mesh ? "pointer" : "grab";

  if (mesh && mesh !== selectedMesh) {
    mesh.userData.targetZ = 0.26;
  }
  if (mesh && shouldSelect) selectProvince(mesh);
}

let isDragging = false;
let lastDragX = 0;
let targetRotationZ = mapGroup.rotation.z;

mapCanvas.addEventListener("pointermove", (event) => {
  if (isDragging) {
    const delta = event.clientX - lastDragX;
    targetRotationZ += delta * 0.0022;
    lastDragX = event.clientX;
    return;
  }
  pickProvince(event);
});

mapCanvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  lastDragX = event.clientX;
  mapCanvas.setPointerCapture(event.pointerId);
});

mapCanvas.addEventListener("pointerup", (event) => {
  isDragging = false;
  pickProvince(event, true);
});

mapCanvas.addEventListener("pointerleave", () => {
  isDragging = false;
  if (hoveredMesh && hoveredMesh !== selectedMesh) hoveredMesh.userData.targetZ = 0;
  hoveredMesh = null;
  mapContainer.style.cursor = "grab";
});

mapCanvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  targetMapZoom = THREE.MathUtils.clamp(
    targetMapZoom + (event.deltaY > 0 ? 0.8 : -0.8),
    8.4,
    12.4
  );
}, { passive: false });

cityMapCanvas.addEventListener("pointerdown", (event) => {
  isCityDragging = true;
  lastCityPointer = { x: event.clientX, y: event.clientY };
  cityMapCanvas.setPointerCapture(event.pointerId);
});

cityMapCanvas.addEventListener("pointermove", (event) => {
  if (!isCityDragging) return;
  const dx = event.clientX - lastCityPointer.x;
  const dy = event.clientY - lastCityPointer.y;
  cityView.targetRotationZ += dx * 0.006;
  cityView.targetRotationX = THREE.MathUtils.clamp(
    cityView.targetRotationX + dy * 0.0035,
    -0.72,
    -0.06
  );
  lastCityPointer = { x: event.clientX, y: event.clientY };
});

cityMapCanvas.addEventListener("pointerup", () => {
  isCityDragging = false;
});

cityMapCanvas.addEventListener("pointerleave", () => {
  isCityDragging = false;
});

cityMapCanvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    cityView.targetZoom = THREE.MathUtils.clamp(
      cityView.targetZoom + (event.deltaY > 0 ? -0.08 : 0.08),
      0.76,
      1.65
    );
  },
  { passive: false }
);

cityMapCanvas.addEventListener("dblclick", () => {
  cityView.targetRotationX = -0.28;
  cityView.targetRotationZ = selectedMesh?.userData.province.name === "广东" ? 0.04 : -0.03;
  cityView.targetZoom = 1;
});

function resizeMap() {
  const { width, height } = mapContainer.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);

  const cityRect = cityMapCard.getBoundingClientRect();
  cityCamera.aspect = cityRect.width / cityRect.height;
  cityCamera.updateProjectionMatrix();
  cityRenderer.setSize(cityRect.width, cityRect.height, false);
}

function animateMap(time) {
  provinceMeshes.forEach((mesh) => {
    mesh.position.z += (mesh.userData.targetZ - mesh.position.z) * 0.12;
  });

  mapGroup.rotation.z += (targetRotationZ - mapGroup.rotation.z) * 0.08;
  mapGroup.rotation.y = Math.sin(time * 0.00035) * 0.06;
  camera.position.z += (targetMapZoom - camera.position.z) * 0.1;
  updateMainLabels();
  renderer.render(scene, camera);

  cityMeshes.forEach((mesh) => {
    mesh.position.z += (mesh.userData.targetZ - mesh.position.z) * 0.14;
  });
  cityView.rotationX += (cityView.targetRotationX - cityView.rotationX) * 0.12;
  cityView.rotationZ += (cityView.targetRotationZ - cityView.rotationZ) * 0.12;
  cityView.zoom += (cityView.targetZoom - cityView.zoom) * 0.12;
  cityGroup.rotation.x = cityView.rotationX;
  cityGroup.rotation.z = cityView.rotationZ;
  cityGroup.rotation.y = Math.sin(time * 0.00045) * 0.035;
  cityGroup.scale.setScalar(cityView.zoom);
  cityRenderer.render(cityScene, cityCamera);

  requestAnimationFrame(animateMap);
}

resizeMap();
window.addEventListener("resize", resizeMap);
requestAnimationFrame(animateMap);
