import * as THREE from "three";
import { KNOB_POSITION } from "./product-input.mjs";
import { finishes, type Finish } from "./finishes";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { LayerName } from "./model-state.mjs";

export const KEY_DEFINITIONS = [
  {
    label: "Chat",
    title: "생각의 시작, 대화 한 번.",
    detail: "떠오른 아이디어를 바로 꺼내 보세요.",
    color: "#a2e6d1",
    symbol: "◉",
  },
  {
    label: "Research",
    title: "호기심을 더 깊이.",
    detail: "질문에서 발견까지, 자연스럽게 이어지는 흐름.",
    color: "#b5c6fb",
    symbol: "▲",
  },
  {
    label: "Build",
    title: "아이디어가 현실이 되는 순간.",
    detail: "만들고 싶은 것에 집중하세요.",
    color: "#f1d887",
    symbol: "●",
  },
  {
    label: "Create",
    title: "상상에 새로운 형태를.",
    detail: "하나의 영감에서 시작되는 무한한 가능성.",
    color: "#d9a8ef",
    symbol: "◆",
  },
  {
    label: "Focus",
    title: "지금, 중요한 것 하나에.",
    detail: "방해는 내려놓고 몰입의 리듬을 만드세요.",
    color: "#d1d5d7",
    symbol: "◎",
  },
  {
    label: "Review",
    title: "좋은 아이디어를 더 단단하게.",
    detail: "놓쳤던 디테일까지, 한 번 더 살펴보세요.",
    color: "#d1d5d7",
    symbol: "↻",
  },
  {
    label: "Approve",
    title: "다음 단계로 나아갈 준비.",
    detail: "확신이 생겼다면, 한 번의 터치로.",
    color: "#d1d5d7",
    symbol: "✓",
  },
  {
    label: "Pause",
    title: "잠시 멈추는 것도 흐름의 일부.",
    detail: "당신의 속도에 맞춰 다시 시작하세요.",
    color: "#d1d5d7",
    symbol: "Ⅱ",
  },
  {
    label: "Voice",
    title: "말하는 순간, 아이디어가 되다.",
    detail: "키보드보다 빠른 당신의 생각을 담으세요.",
    color: "#d1d5d7",
    symbol: "♩",
  },
  {
    label: "Orchestrate",
    title: "생각은 끝. 이제 실행할 시간.",
    detail: "준비된 워크플로를 하나의 키로 시작하세요.",
    color: "#ffffff",
    symbol: "→",
  },
  {
    label: "New task",
    title: "다음 가능성을 열어보세요.",
    detail: "새로운 작업, 새로운 시작.",
    color: "#d1d5d7",
    symbol: "+",
  },
] as const;

function material(color: string, metalness = 0, roughness = 0.45) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

// 각 키 하단에서 금속 플레이트 위로 번지는 컬러 광원을 표현한다.
function ledSpillTexture(color: string, wide: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = wide ? 768 : 384;
  canvas.height = 384;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 34;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.roundRect(47, 47, canvas.width - 94, 290, 35);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundedShape(w: number, d: number, radius: number) {
  const r = Math.min(radius, w / 2, d / 2);
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -d / 2);
  shape.lineTo(w / 2 - r, -d / 2);
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  shape.lineTo(w / 2, d / 2 - r);
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
  shape.lineTo(-w / 2 + r, d / 2);
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
  shape.lineTo(-w / 2, -d / 2 + r);
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  return shape;
}

function oledTexture(index = -1) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const key = KEY_DEFINITIONS[Math.max(0, index)];
  ctx.fillStyle = "#061114";
  ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = "#374546";
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 996, 228);
  ctx.fillStyle = key.color;
  ctx.beginPath();
  ctx.arc(110, 108, 49, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#172927";
  ctx.fillRect(92, 98, 8, 10);
  ctx.fillRect(121, 98, 8, 10);
  ctx.fillStyle = "#d3e2dc";
  ctx.font = "bold 38px monospace";
  ctx.fillText(
    index < 0 ? "HELLO, HUMAN." : key.label.toUpperCase() + " / READY",
    210,
    96,
  );
  ctx.fillStyle = "#6d9690";
  ctx.font = "17px monospace";
  ctx.fillText("YOUR TEAM IS WITHIN REACH", 212, 133);
  ctx.font = "14px monospace";
  ctx.fillText("GROK OS  /  01", 45, 210);
  ctx.fillText("ONLINE", 480, 210);
  ctx.fillStyle = key.color;
  for (let i = 0; i < 25; i++) {
    const height = 8 + Math.sin(i * 0.83) ** 2 * 22;
    ctx.fillRect(720 + i * 8, 210 - height, 4, height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function box(
  w: number,
  h: number,
  d: number,
  radius: number,
  mat: THREE.Material,
) {
  const r = Math.min(radius, w / 2, d / 2);
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -d / 2);
  shape.lineTo(w / 2 - r, -d / 2);
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  shape.lineTo(w / 2, d / 2 - r);
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
  shape.lineTo(-w / 2 + r, d / 2);
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
  shape.lineTo(-w / 2, -d / 2 + r);
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  const bevel = Math.min(h * 0.2, 0.065, r * 0.4);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: h - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    steps: 1,
    curveSegments: 6,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function textTexture(
  text: string,
  subtext = "",
  ink = "#dde8e7",
  background = "transparent",
  width = 256,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  if (background !== "transparent") {
    context.fillStyle = background;
    context.fillRect(0, 0, width, 256);
  }
  context.textAlign = "center";
  context.fillStyle = ink;
  context.font = "500 74px Arial, sans-serif";
  context.fillText(text, width / 2, 112);
  if (subtext === "Chat") {
    context.clearRect(0, 0, width, 145);
    context.beginPath();
    context.arc(width / 2, 82, 33, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#344b46";
    context.fillRect(width / 2 - 13, 76, 6, 7);
    context.fillRect(width / 2 + 7, 76, 6, 7);
    context.fillStyle = ink;
  }
  if (subtext === "Voice") {
    context.clearRect(0, 0, width, 145);
    context.strokeStyle = ink;
    context.lineWidth = 5;
    context.lineCap = "round";
    context.beginPath();
    context.roundRect(width / 2 - 11, 45, 22, 49, 12);
    context.stroke();
    context.beginPath();
    context.arc(width / 2, 84, 23, 0, Math.PI);
    context.moveTo(width / 2, 108);
    context.lineTo(width / 2, 125);
    context.moveTo(width / 2 - 12, 125);
    context.lineTo(width / 2 + 12, 125);
    context.stroke();
  }
  context.font = "500 27px Arial, sans-serif";
  context.fillText(subtext, width / 2, 195);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function decal(texture: THREE.Texture, w: number, d: number) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export function createProductModel() {
  const root = new THREE.Group();
  const layers = Object.fromEntries(
    ["base", "board", "plate", "switches", "caps"].map((name) => {
      const group = new THREE.Group();
      group.name = name;
      root.add(group);
      return [name, group];
    }),
  ) as Record<LayerName, THREE.Group>;

  const graphite = material("#3b454b", 0.86, 0.36);
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = grainCanvas.height = 256;
  const grainContext = grainCanvas.getContext("2d")!;
  const grainData = grainContext.createImageData(256, 256);
  for (let i = 0; i < grainData.data.length; i += 4) {
    const value = 110 + ((i * 17 + i * i) % 43);
    grainData.data[i] = grainData.data[i + 1] = grainData.data[i + 2] = value;
    grainData.data[i + 3] = 255;
  }
  grainContext.putImageData(grainData, 0, 0);
  const grain = new THREE.CanvasTexture(grainCanvas);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(5, 5);
  graphite.bumpMap = grain;
  graphite.bumpScale = 0.013;
  const darkMetal = material("#191e22", 0.65, 0.4);
  const steel = material("#7e8a90", 0.85, 0.28);
  const rubber = material("#101314", 0.1, 0.82);
  const base = box(6.16, 0.4, 5.94, 0.23, darkMetal);
  base.position.y = -0.18;
  layers.base.add(base);
  const seam = box(6.18, 0.055, 5.96, 0.22, material("#111718", 0.5));
  seam.position.y = 0.055;
  layers.base.add(seam);
  const plateShape = roundedShape(6.19, 5.96, 0.28);
  KEY_DEFINITIONS.forEach((_, index) => {
    const row = index < 4 ? 0 : index < 8 ? 1 : 2;
    const column =
      index < 8 ? index % 4 : index === 8 ? 0 : index === 9 ? 1.5 : 3;
    const x = -2.04 + column * 1.36,
      z = -0.83 + row * 1.36;
    const hole = new THREE.Path();
    const w = index === 9 ? 1.9 : 0.79,
      d = 0.79;
    hole.moveTo(x - w / 2, -z - d / 2);
    hole.lineTo(x - w / 2, -z + d / 2);
    hole.lineTo(x + w / 2, -z + d / 2);
    hole.lineTo(x + w / 2, -z - d / 2);
    hole.closePath();
    plateShape.holes.push(hole);
  });
  const plateGeometry = new THREE.ExtrudeGeometry(plateShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.012,
    bevelThickness: 0.015,
    curveSegments: 10,
  });
  plateGeometry.rotateX(-Math.PI / 2);
  plateGeometry.translate(0, -0.05, 0);
  const plate = new THREE.Mesh(plateGeometry, graphite);
  plate.castShadow = true;
  plate.receiveShadow = true;
  plate.position.y = 0.22;
  layers.plate.add(plate);

  const pcb = box(5.74, 0.055, 5.49, 0.12, material("#183e36", 0.35, 0.55));
  pcb.position.y = 0.105;
  layers.board.add(pcb);
  // 회로판은 분해 상태에서 볼 수 있는 콘셉트 내부 구조입니다.
  const traceMat = material("#b6a062", 0.7, 0.4);
  for (let i = 0; i < 18; i++) {
    const trace = box(0.014, 0.005, 4.8 - (i % 4) * 0.35, 0.001, traceMat);
    trace.position.set(-2.5 + i * 0.29, 0.138, 0);
    layers.board.add(trace);
  }
  for (let i = 0; i < 5; i++) {
    const chip = box(0.35, 0.045, 0.45, 0.015, rubber);
    chip.position.set(-2 + i, 0.15, -2.12);
    layers.board.add(chip);
    for (let n = 0; n < 5; n++) {
      const pin = box(0.5, 0.018, 0.025, 0.003, steel);
      pin.position.set(chip.position.x, 0.15, -2.28 + n * 0.075);
      layers.board.add(pin);
    }
  }

  for (const x of [-2.77, 2.77]) {
    for (const z of [-2.65, 2.65]) {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.086, 0.086, 0.028, 32),
        steel,
      );
      screw.position.set(x, 0.298, z);
      const inset = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.031, 6),
        darkMetal,
      );
      inset.position.copy(screw.position);
      inset.position.y += 0.005;
      layers.plate.add(screw, inset);
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.06, 32),
        rubber,
      );
      foot.position.set(x * 0.91, -0.413, z * 0.91);
      layers.base.add(foot);
    }
  }

  // 작은 화면을 실제 제품 표면에 배치해 어느 각도에서도 함께 회전합니다.
  const screenBezel = box(
    4.02,
    0.12,
    0.85,
    0.055,
    material("#0c1115", 0.6, 0.22),
  );
  screenBezel.position.set(-0.65, 0.335, -2.05);
  layers.plate.add(screenBezel);
  const screen = decal(oledTexture(), 3.82, 0.65);
  screen.position.set(-0.65, 0.403, -2.05);
  layers.plate.add(screen);

  const knob = new THREE.Group();
  const knobBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 0.07, 80),
    darkMetal,
  );
  const knobBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.35, 80),
    graphite,
  );
  knobBody.position.y = 0.18;
  knob.add(knobBase, knobBody);
  const knobTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.578, 0.578, 0.075, 80),
    graphite,
  );
  knobTop.position.y = 0.388;
  knob.add(knobTop);
  const ribs = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.013, 0.28, 0.018),
    steel,
    90,
  );
  const ribTransform = new THREE.Object3D();
  for (let i = 0; i < 90; i++) {
    const angle = (i / 90) * Math.PI * 2;
    ribTransform.position.set(
      Math.cos(angle) * 0.602,
      0.19,
      Math.sin(angle) * 0.602,
    );
    ribTransform.rotation.y = -angle;
    ribTransform.updateMatrix();
    ribs.setMatrixAt(i, ribTransform.matrix);
  }
  knob.add(ribs);
  const marker = box(0.034, 0.006, 0.14, 0.012, material("#e2ebe6"));
  marker.position.set(0, 0.43, -0.39);
  knob.add(marker);
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: "#def4ef",
    emissive: "#def4ef",
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const highlight = new THREE.Mesh(
    new THREE.TorusGeometry(0.581, 0.008, 8, 80),
    highlightMaterial,
  );
  highlight.rotation.x = Math.PI / 2;
  highlight.position.y = 0.421;
  knob.add(highlight);
  knob.position.set(KNOB_POSITION.x, KNOB_POSITION.y, KNOB_POSITION.z);
  layers.caps.add(knob);

  const keyMeshes: THREE.Mesh[] = [];
  const ledRings: THREE.Mesh[] = [];
  const keyGroups: THREE.Group[] = [];
  const glows: THREE.MeshBasicMaterial[] = [];
  const ledColors = [
    "#abd8cb",
    "#b2bfdc",
    "#dfd1a8",
    "#ceb7dd",
    "#aed1d9",
    "#bdb7d8",
    "#d9b6c1",
    "#dcc5ab",
    "#b9d5bf",
    "#b3cfdc",
    "#cbbadb",
  ];
  const capMaterials: THREE.MeshStandardMaterial[] = [];
  const capLabels: THREE.Mesh[] = [];
  KEY_DEFINITIONS.forEach((key, index) => {
    const row = index < 4 ? 0 : index < 8 ? 1 : 2;
    const column =
      index < 8 ? index % 4 : index === 8 ? 0 : index === 9 ? 1.5 : 3;
    const x = -2.04 + column * 1.36;
    const z = -0.83 + row * 1.36;
    const width = index === 9 ? 2.49 : 1.15;
    const keyGroup = new THREE.Group();
    keyGroup.position.set(x, 0, z);
    const glowMat = new THREE.MeshBasicMaterial({
      color: ledColors[index],
      toneMapped: false,
    });
    glows.push(glowMat);
    const ringShape = roundedShape(width + 0.04, 1.19, 0.15);
    const innerRing = roundedShape(width - 0.035, 1.115, 0.12);
    ringShape.holes.push(new THREE.Path(innerRing.getPoints(24).reverse()));
    const ringGeometry = new THREE.ExtrudeGeometry(ringShape, {
      depth: 0.028,
      bevelEnabled: false,
      curveSegments: 8,
    });
    ringGeometry.rotateX(-Math.PI / 2);
    const rim = new THREE.Mesh(ringGeometry, glowMat);
    const spill = new THREE.Mesh(
      new THREE.PlaneGeometry(width + 0.4, 1.55),
      new THREE.MeshBasicMaterial({
        map: ledSpillTexture(ledColors[index], index === 9),
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      }),
    );
    spill.rotation.x = -Math.PI / 2;
    spill.position.y = -0.064;
    rim.add(spill);
    ledRings.push(rim);
    rim.position.y = 0.362;
    const cap = new THREE.Mesh(
      new RoundedBoxGeometry(width, 0.53, 1.15, 5, 0.18),
      material(index === 9 ? "#dddcd4" : "#20272c", 0.02, 0.52),
    );
    capMaterials.push(cap.material);
    cap.castShadow = true;
    cap.receiveShadow = true;
    cap.position.y = 0.627;
    cap.userData.keyIndex = index;
    keyMeshes.push(cap);
    const label = decal(
      textTexture(key.symbol, key.label, index === 9 ? "#586466" : key.color),
      Math.min(width - 0.15, 1.25),
      0.75,
    );
    label.position.y = 0.897;
    capLabels.push(label);
    keyGroup.add(cap, label);
    layers.caps.add(keyGroup);
    keyGroups.push(keyGroup);

    const socket = box(0.68, 0.06, 0.68, 0.05, rubber);
    socket.position.set(x, 0.32, z);
    const switchBody = box(
      0.5,
      0.15,
      0.5,
      0.045,
      material("#30393b", 0.45, 0.32),
    );
    switchBody.position.set(x, 0.415, z);
    const stem = box(
      0.28,
      0.1,
      0.095,
      0.014,
      material(index < 4 ? key.color : "#c4bd98"),
    );
    stem.position.set(x, 0.535, z);
    const crossStem = stem.clone();
    crossStem.rotation.y = Math.PI / 2;
    rim.position.x = x;
    rim.position.z = z;
    layers.switches.add(socket, switchBody, stem, crossStem, rim);
    if (index === 9) {
      const stabilizer = box(1.65, 0.06, 0.045, 0.015, steel);
      stabilizer.position.set(x, 0.48, z + 0.25);
      layers.switches.add(stabilizer);
    }
  });

  const branding = decal(
    textTexture("G R O K   B O T  /  0 1", "", "#a4b0b1", "transparent", 1024),
    2.75,
    0.28,
  );
  branding.position.set(-0.3, 0.293, 2.69);
  layers.plate.add(branding);
  const underside = decal(
    textTexture(
      "GROK BOT / 01",
      "DESIGNED FOR HUMAN POTENTIAL",
      "#82908e",
      "transparent",
      1024,
    ),
    2.7,
    0.75,
  );
  underside.rotation.x = Math.PI / 2;
  underside.position.y = -0.386;
  layers.base.add(underside);

  const port = box(0.49, 0.145, 0.055, 0.06, rubber);
  port.position.set(-0.65, -0.1, -2.98);
  layers.base.add(port);
  const connector = box(0.42, 0.2, 0.46, 0.08, darkMetal);
  connector.position.set(-0.65, -0.08, -3.1);
  layers.base.add(connector);
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.65, -0.08, -3.25),
    new THREE.Vector3(-0.65, -0.08, -3.95),
    new THREE.Vector3(-0.3, -0.08, -4.4),
    new THREE.Vector3(0.55, -0.08, -4.58),
    new THREE.Vector3(1.05, -0.08, -5.25),
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 48, 0.062, 12, false),
    rubber,
  );
  layers.base.add(cable);

  function updateScreen(index: number) {
    const screenMat = screen.material as THREE.MeshBasicMaterial;
    screenMat.map?.dispose();
    screenMat.map = oledTexture(index);
    screenMat.needsUpdate = true;
  }

  return {
    root,
    layers,
    keyMeshes,
    ledRings,
    keyGroups,
    glows,
    knob,
    knobMeshes: [knobTop, knobBody, knobBase],
    annotationTargets: [screenBezel, knobTop, keyMeshes[2], pcb],
    setKnobHighlight(amount: number) {
      highlightMaterial.opacity = amount * 0.85;
      highlight.visible = amount > 0.002;
    },
    updateScreen,
    bodyMaterial: graphite,
    setFinish(finish: Finish) {
      const palette =
        finishes.find((item) => item.id === finish) ?? finishes[0];
      const silver = finish === "silver",
        white = finish === "porcelain" || finish === "daylight";
      graphite.color.set(palette.body);
      graphite.metalness = silver ? 1 : white ? 0.25 : 0.82;
      graphite.roughness = silver ? 0.13 : white ? 0.32 : 0.34;
      graphite.envMapIntensity = silver ? 1.7 : 1;
      capMaterials.forEach((mat, index) => {
        mat.color.set(
          index === 9 && finish === "obsidian" ? "#dddcd4" : palette.cap,
        );
        mat.metalness = silver ? 0.92 : 0.02;
        mat.roughness = silver ? 0.17 : 0.52;
        mat.envMapIntensity = silver ? 1.4 : 1;
        const label = capLabels[index].material as THREE.MeshBasicMaterial;
        label.map?.dispose();
        label.map = textTexture(
          KEY_DEFINITIONS[index].symbol,
          KEY_DEFINITIONS[index].label,
          finish !== "obsidian"
            ? "#3c4850"
            : index === 9
              ? "#586466"
              : KEY_DEFINITIONS[index].color,
        );
        label.needsUpdate = true;
      });
    },
  };
}
