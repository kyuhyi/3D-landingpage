"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createProductModel } from "./create-model";
import type { Finish } from "./finishes";
import { layerPosition } from "./model-state.mjs";
import { sampleTour, type TourFrame } from "./cinematic-motion.mjs";
import {
  clampVolume,
  dragVolume,
  wheelVolume,
  createKeyFeedback,
} from "./product-input.mjs";
import styles from "./product.module.css";
import { sampleStory } from "./landing/scroll-story.mjs";
import { sampleFlow, createFlowInteraction } from "./landing/flow-motion.mjs";

export type LightMode = "studio" | "daylight" | "afterhours";
export type SceneProps = {
  explode: number;
  light: LightMode;
  autoRotate: boolean;
  resetToken: number;
  selectedKey: number;
  onKeySelect: (index: number) => void;
  onInteract: () => void;
  cinematic?: boolean;
  finish?: Finish;
  atmosphere?: number;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  keyPressToken?: number;
  scrollProgressRef?: RefObject<number>;
  flowProgressRef?: RefObject<number>;
  centered?: boolean;
  renderActive?: boolean;
  viewRequest?: {
    id: number;
    kind: "home" | "top" | "front" | "zoom-in" | "zoom-out";
  };
  onTourFrame?: (frame: TourFrame) => void;
};

export function ProductScene(props: SceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const applyFinishRef = useRef<
    ((finish: NonNullable<SceneProps["finish"]>) => void) | null
  >(null);
  const annotationRef = useRef<HTMLDivElement>(null);
  const annotationLabelRef = useRef<HTMLDivElement>(null);
  const annotationArrowRef = useRef<SVGPathElement>(null);
  const annotationLineRef = useRef<SVGPathElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    propsRef.current = props;
  }, [props]);
  useEffect(() => {
    applyFinishRef.current?.(props.finish ?? "obsidian");
  }, [props.finish]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => setStatus("error"));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "GROK BOT 인터랙티브 3D 모델. 드래그 또는 방향키로 회전하고 휠로 확대하세요.",
    );
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const initialPosition = new THREE.Vector3(5.9, 8.9, 8.3);
    camera.position.copy(initialPosition);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0.05, -0.3);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = propsRef.current.flowProgressRef ? 32 : 23;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    controls.autoRotateSpeed = 0.7;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.7;
    controls.update();
    controls.saveState();
    if (
      propsRef.current.scrollProgressRef &&
      !propsRef.current.flowProgressRef &&
      !propsRef.current.centered
    ) {
      controls.enabled = false;
      canvas.tabIndex = -1;
      canvas.style.pointerEvents = "none";
      canvas.setAttribute(
        "aria-label",
        propsRef.current.centered
          ? "선택한 마감을 보여주는 GROK BOT 3D 미리보기"
          : "스크롤에 따라 OLED, 볼륨 노브, 키캡과 내부 구조를 보여주는 3D 제품",
      );
    }
    if (propsRef.current.flowProgressRef) {
      canvas.style.pointerEvents = "auto";
      canvas.setAttribute(
        "aria-label",
        "제품 소개 3D 모델. 드래그 또는 방향키로 회전, 확대 버튼 또는 Ctrl 키와 휠로 확대. 스크롤하면 소개가 이어집니다.",
      );
    }
    if (propsRef.current.centered) {
      canvas.style.pointerEvents = "auto";
      canvas.setAttribute(
        "aria-label",
        "컬러 선택 3D 모델. 드래그 또는 방향키로 회전하고 Ctrl 키와 휠로 확대하세요.",
      );
    }
    if (propsRef.current.cinematic) canvas.style.touchAction = "pan-y";
    const flowInteraction = createFlowInteraction();
    const interact = () => {
      const progress =
        propsRef.current.flowProgressRef ?? propsRef.current.scrollProgressRef;
      if (progress) flowInteraction.takeOver(progress.current);
      propsRef.current.onInteract();
    };

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.025);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.72;
    room.dispose();
    pmrem.dispose();

    const ambient = new THREE.AmbientLight("#d5e4e4", 0.55);
    const keyLight = new THREE.DirectionalLight("#e7f1f0", 2.6);
    keyLight.position.set(-3, 9, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -9;
    keyLight.shadow.camera.right = 9;
    keyLight.shadow.camera.top = 9;
    keyLight.shadow.camera.bottom = -9;
    keyLight.shadow.normalBias = 0.025;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 5;
    const rimLight = new THREE.DirectionalLight("#a9bddb", 2.2);
    rimLight.position.set(6, 4, -4);
    const fillLight = new THREE.PointLight("#b2c3bf", 7, 15);
    fillLight.position.set(-5, 3, 2);
    scene.add(ambient, keyLight, rimLight, fillLight);

    const model = createProductModel();
    scene.add(model.root);
    const applyFinish = (finish: NonNullable<SceneProps["finish"]>) => {
      model.setFinish(finish);
      host.dataset.finish = finish;
      // 화면 밖에 있는 미리보기도 이전 색상이 남지 않게 즉시 갱신한다.
      renderer.render(scene, camera);
    };
    applyFinishRef.current = applyFinish;
    applyFinish(propsRef.current.finish ?? "obsidian");
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.3 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.7;
    shadow.receiveShadow = true;
    scene.add(shadow);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.fov = propsRef.current.centered
        ? 36
        : propsRef.current.cinematic
          ? width < 600
            ? 47
            : 32
          : width < 500
            ? 43
            : 34;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let down = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const keyFeedback = createKeyFeedback();
    let knobDrag: { id: number; volume: number } | null = null;
    let liveVolume = propsRef.current.volume ?? 65;
    let knobHighlight = 0;
    let knobGlowUntil = 0;
    let suppressNextPulse = false;
    const aim = (event: { clientX: number; clientY: number }) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
    };
    const changeVolume = (value: number) => {
      knobGlowUntil = performance.now() + 180;
      liveVolume = clampVolume(value);
      propsRef.current.onVolumeChange?.(liveVolume);
    };
    const start = (event: PointerEvent) => {
      if (event.button !== 0 || knobDrag) return;
      down = { x: event.clientX, y: event.clientY };
      aim(event);
      if (raycaster.intersectObjects(model.knobMeshes)[0]) {
        event.preventDefault();
        event.stopImmediatePropagation();
        controls.enabled = false;
        knobDrag = { id: event.pointerId, volume: liveVolume };
        canvas.setPointerCapture(event.pointerId);
        interact();
        canvas.style.cursor = "ns-resize";
        return;
      }
      const hit = raycaster.intersectObjects(model.keyMeshes)[0];
      if (hit) {
        const index = hit.object.userData.keyIndex as number;
        keyFeedback.hold(index);
        suppressNextPulse = true;
        propsRef.current.onKeySelect(index);
      }
    };
    const move = (event: PointerEvent) => {
      if (knobDrag?.id === event.pointerId) {
        event.preventDefault();
        event.stopImmediatePropagation();
        changeVolume(
          dragVolume(
            knobDrag.volume,
            event.clientX - down.x,
            event.clientY - down.y,
          ),
        );
      } else {
        aim(event);
        canvas.style.cursor = raycaster.intersectObjects(model.knobMeshes)[0]
          ? "ns-resize"
          : "grab";
        if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5)
          keyFeedback.release();
      }
    };
    const release = (event?: PointerEvent) => {
      keyFeedback.release();
      if (!knobDrag || (event && event.pointerId !== knobDrag.id)) return;
      event?.stopImmediatePropagation();
      if (
        event?.type === "pointerup" &&
        Math.hypot(event.clientX - down.x, event.clientY - down.y) < 5
      )
        changeVolume(liveVolume + 10);
      if (canvas.hasPointerCapture(knobDrag.id))
        canvas.releasePointerCapture(knobDrag.id);
      knobDrag = null;
      controls.enabled = true;
      canvas.style.cursor = "grab";
    };
    const wheel = (event: WheelEvent) => {
      if (propsRef.current.flowProgressRef) {
        // 일반 휠은 문서를 스크롤하고 Ctrl+휠만 모델을 확대한다.
        if (!event.ctrlKey) event.stopImmediatePropagation();
        return;
      }
      aim(event);
      if (!raycaster.intersectObjects(model.knobMeshes)[0]) {
        if (propsRef.current.cinematic && !event.ctrlKey)
          event.stopImmediatePropagation();
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      propsRef.current.onInteract();
      changeVolume(wheelVolume(liveVolume, event.deltaY));
    };
    const blur = () => release();
    const keyboard = (event: KeyboardEvent) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      interact();
      const spherical = new THREE.Spherical().setFromVector3(
        camera.position.clone().sub(controls.target),
      );
      spherical.theta +=
        event.key === "ArrowLeft"
          ? 0.16
          : event.key === "ArrowRight"
            ? -0.16
            : 0;
      spherical.phi +=
        event.key === "ArrowUp" ? -0.16 : event.key === "ArrowDown" ? 0.16 : 0;
      spherical.makeSafe();
      camera.position.setFromSpherical(spherical).add(controls.target);
      controls.update();
    };
    canvas.addEventListener("pointerdown", start, true);
    canvas.addEventListener("pointermove", move, true);
    canvas.addEventListener("pointerup", release, true);
    canvas.addEventListener("pointercancel", release, true);
    canvas.addEventListener("lostpointercapture", release);
    canvas.addEventListener("wheel", wheel, { capture: true, passive: false });
    window.addEventListener("blur", blur);
    canvas.addEventListener("keydown", keyboard);
    controls.addEventListener("start", interact);
    const contextLost = (event: Event) => {
      event.preventDefault();
      setStatus("error");
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    intersection.observe(host);
    let animatedExplode = 0;
    let lastReset = 0;
    let lastKey = -1;
    let lastPress = propsRef.current.keyPressToken ?? 0;
    let lastLight = "";
    let lastView = -1;
    let tourTime = 0;
    let lastPublish = 0;
    let cinematicInitialized = false;
    let lastStoryProgress = -1;
    const tourPosition = new THREE.Vector3();
    const tourTarget = new THREE.Vector3();
    const annotationPoint = new THREE.Vector3();
    let frame = 0;
    let previousTime = 0;
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      if (
        !visible ||
        document.hidden ||
        propsRef.current.renderActive === false
      ) {
        previousTime = time;
        return;
      }
      const elapsed = Math.min((time - previousTime) / 1000 || 0.016, 0.5);
      const dt = Math.min(elapsed, 0.12);
      previousTime = time;
      const current = propsRef.current;
      const flow = current.flowProgressRef
        ? sampleFlow(current.flowProgressRef.current)
        : null;
      const story =
        flow ??
        (current.scrollProgressRef
          ? sampleStory(current.scrollProgressRef.current)
          : null);
      const manualView =
        !!story &&
        flowInteraction.isManual(
          (current.flowProgressRef ?? current.scrollProgressRef)!.current,
        );
      if (!knobDrag && current.volume !== undefined)
        liveVolume = current.volume;
      if ((current.keyPressToken ?? 0) !== lastPress) {
        if (!suppressNextPulse) keyFeedback.pulse(current.selectedKey, time);
        suppressNextPulse = false;
        lastPress = current.keyPressToken ?? 0;
      }
      const mobile = host.clientWidth < 600;
      const playing =
        !story &&
        !!current.cinematic &&
        current.autoRotate &&
        !reducedMotion.matches;
      if (playing) tourTime += elapsed;
      const shot = sampleTour(tourTime);
      if (!story && current.cinematic && (playing || !cinematicInitialized)) {
        tourTarget.set(mobile ? 0 : shot.targetX, -0.35, 0.1);
        tourPosition
          .setFromSphericalCoords(
            shot.distance +
              (mobile
                ? 4.5
                : host.clientWidth / host.clientHeight < 1.6
                  ? 4
                  : 0),
            shot.phi,
            shot.theta,
          )
          .add(tourTarget);
        if (!cinematicInitialized) {
          camera.position.copy(tourPosition);
          controls.target.copy(tourTarget);
          cinematicInitialized = true;
        } else {
          camera.position.lerp(tourPosition, 1 - Math.exp(-dt * 3));
          controls.target.lerp(tourTarget, 1 - Math.exp(-dt * 3));
        }
        if (time - lastPublish > 180) {
          current.onTourFrame?.(shot);
          lastPublish = time;
        }
      }
      if (story) {
        if (flow) {
          camera.setViewOffset(
            host.clientWidth,
            host.clientHeight,
            host.clientWidth * (0.5 - (mobile ? 0.5 : flow.screenX)),
            host.clientHeight * (0.5 - (flow.screenY + (mobile ? 0.16 : 0))),
            host.clientWidth,
            host.clientHeight,
          );
        }
        tourTarget.set(
          mobile || current.centered ? 0 : story.targetX,
          mobile || current.centered ? -0.2 : story.targetY,
          0,
        );
        tourPosition
          .setFromSphericalCoords(
            current.centered
              ? 14.8
              : story.distance * (mobile ? (flow ? 1.25 : 0.8) : 1),
            story.phi,
            story.theta,
          )
          .add(tourTarget);
        const weight = reducedMotion.matches ? 1 : 1 - Math.exp(-dt * 9);
        if (!manualView) {
          camera.position.lerp(tourPosition, weight);
          controls.target.lerp(tourTarget, weight);
          camera.lookAt(controls.target);
        }
        if (story.part === "knob" && !manualView && !knobDrag) {
          liveVolume = 35 + story.progress * 100;
          if (Math.abs(story.progress - lastStoryProgress) > 0.0001)
            knobGlowUntil = time + 180;
        }
        lastStoryProgress = story.progress;
      }
      if (current.resetToken !== lastReset) {
        controls.reset();
        tourTime = 0;
        lastReset = current.resetToken;
      }
      if (current.viewRequest && current.viewRequest.id !== lastView) {
        const kind = current.viewRequest.kind;
        if (flow && kind !== "home") interact();
        if (flow && kind === "home") {
          flowInteraction.reset();
          // 회전 관성을 비워 현재 섹션의 소개 시점으로 복귀한다.
          controls.enableDamping = false;
          controls.update();
          controls.enableDamping = true;
        } else if (kind === "top") {
          controls.target.set(0, 0, 0);
          camera.position.set(0.01, 14, 0.1);
        } else if (kind === "front") {
          controls.target.set(0, 0.25, 0);
          camera.position.set(0, 4, 14);
        } else if (kind === "home") {
          controls.target.set(0, -0.25, 0.1);
          camera.position
            .copy(initialPosition)
            .multiplyScalar(current.cinematic ? 1.12 : 1);
        } else {
          camera.position
            .sub(controls.target)
            .multiplyScalar(kind === "zoom-in" ? 0.85 : 1.17)
            .add(controls.target);
        }
        lastView = current.viewRequest.id;
        controls.update();
      }
      if (lastKey !== current.selectedKey) {
        if (current.selectedKey >= 0) model.updateScreen(current.selectedKey);
        lastKey = current.selectedKey;
      }
      const lightSignature = current.light + String(current.atmosphere ?? 65);
      if (lastLight !== lightSignature) {
        const isDay = current.light === "daylight";
        const isNight = current.light === "afterhours";
        const intensity = 0.45 + (current.atmosphere ?? 65) / 100;
        keyLight.intensity = (isDay ? 4.2 : isNight ? 0.6 : 2.4) * intensity;
        keyLight.color.set(isDay ? "#ffedda" : "#e7f1f0");
        ambient.intensity = (isDay ? 0.7 : isNight ? 0.1 : 0.32) * intensity;
        rimLight.intensity = isNight ? 3.2 : 2.2;
        rimLight.color.set(isNight ? "#aaa1fa" : "#a9bddb");
        fillLight.intensity = isNight ? 15 : 7;
        scene.environmentIntensity =
          (isNight ? 0.2 : isDay ? 0.85 : 0.55) * intensity;
        lastLight = lightSignature;
      }
      animatedExplode = reducedMotion.matches
        ? (story?.explode ?? current.explode)
        : THREE.MathUtils.damp(
            animatedExplode,
            story?.explode ?? (playing ? shot.explode : current.explode),
            4.5,
            dt,
          );
      model.root.scale.setScalar(
        1 - animatedExplode * (current.cinematic ? 0.05 : 0.18),
      );
      shadow.position.y = -0.47 - animatedExplode * 2.23;
      for (const [name, group] of Object.entries(model.layers))
        group.position.y = layerPosition(
          name as keyof typeof model.layers,
          animatedExplode,
        );
      model.keyGroups.forEach((group, i) => {
        const pressed =
          keyFeedback.active(time) === i ||
          (story?.part === "keys" &&
            !reducedMotion.matches &&
            i === 2 &&
            time % 1500 < 260);
        group.position.y = THREE.MathUtils.damp(
          group.position.y,
          pressed ? -0.14 : 0,
          pressed ? 55 : 65,
          dt,
        );
        model.ledRings[i].visible = !pressed;
      });
      model.knob.rotation.y =
        -Math.PI * 0.75 + (liveVolume / 100) * Math.PI * 1.5;
      const knobActive = time < knobGlowUntil;
      knobHighlight = THREE.MathUtils.damp(
        knobHighlight,
        knobActive ? 1 : 0,
        knobActive ? 18 : 7,
        dt,
      );
      model.setKnobHighlight(knobHighlight);
      controls.autoRotate =
        !current.cinematic && current.autoRotate && !reducedMotion.matches;
      controls.update(dt);
      renderer.render(scene, camera);
      if (story && annotationRef.current) {
        const labels = [
          "OLED 디스플레이",
          "볼륨 노브",
          "키캡 · LED 링",
          "PCB · 회로기판",
        ];
        const target = model.annotationTargets[story.chapter];
        if (!target.geometry.boundingBox) target.geometry.computeBoundingBox();
        const bounds = target.geometry.boundingBox!;
        let left = Infinity,
          right = -Infinity,
          top = Infinity,
          bottom = -Infinity;
        let behindCamera = false;
        // 실제 부품의 모서리를 투영해 회전·확대·분해를 함께 따라간다.
        for (let corner = 0; corner < 8; corner++) {
          annotationPoint
            .set(
              corner & 1 ? bounds.max.x : bounds.min.x,
              corner & 2 ? bounds.max.y : bounds.min.y,
              corner & 4 ? bounds.max.z : bounds.min.z,
            )
            .applyMatrix4(target.matrixWorld)
            .project(camera);
          behindCamera ||= annotationPoint.z > 1;
          const x = (annotationPoint.x * 0.5 + 0.5) * host.clientWidth;
          const y = (-annotationPoint.y * 0.5 + 0.5) * host.clientHeight;
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
        const visible =
          !behindCamera &&
          right > 0 &&
          left < host.clientWidth &&
          bottom > 0 &&
          top < host.clientHeight - 90;
        annotationRef.current.hidden = !visible;
        if (
          visible &&
          annotationLabelRef.current &&
          annotationArrowRef.current &&
          annotationLineRef.current
        ) {
          const label = annotationLabelRef.current;
          label.textContent = labels[story.chapter];
          label.dataset.part = story.part;
          const labelWidth = label.offsetWidth;
          const towardRight = (left + right) / 2 < host.clientWidth * 0.75;
          const labelX = THREE.MathUtils.clamp(
            towardRight ? right + (mobile ? 35 : 80) : left - labelWidth - 80,
            20,
            host.clientWidth - labelWidth - 20,
          );
          const labelY = THREE.MathUtils.clamp(
            top - (mobile ? 80 : 110),
            mobile ? 235 : 65,
            host.clientHeight - 190,
          );
          label.style.setProperty("--part-x", `${labelX}px`);
          label.style.setProperty("--part-y", `${labelY}px`);
          bounds.getCenter(annotationPoint);
          annotationPoint.y = bounds.max.y;
          annotationPoint.applyMatrix4(target.matrixWorld).project(camera);
          const tipX = (annotationPoint.x * 0.5 + 0.5) * host.clientWidth;
          const tipY = (-annotationPoint.y * 0.5 + 0.5) * host.clientHeight;
          const startX = labelX + (towardRight ? 0 : labelWidth);
          const startY = labelY + label.offsetHeight;
          const angle = Math.atan2(tipY - startY, tipX - startX);
          annotationLineRef.current.setAttribute(
            "d",
            `M ${startX} ${startY} L ${tipX - Math.cos(angle) * 7} ${tipY - Math.sin(angle) * 7}`,
          );
          annotationArrowRef.current.setAttribute(
            "transform",
            `translate(${tipX} ${tipY}) rotate(${(angle * 180) / Math.PI})`,
          );
        }
      }
    };
    frame = requestAnimationFrame(animate);
    queueMicrotask(() => setStatus("ready"));

    return () => {
      applyFinishRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointerdown", start, true);
      canvas.removeEventListener("pointermove", move, true);
      canvas.removeEventListener("pointerup", release, true);
      canvas.removeEventListener("pointercancel", release, true);
      canvas.removeEventListener("lostpointercapture", release);
      canvas.removeEventListener("wheel", wheel, true);
      window.removeEventListener("blur", blur);
      canvas.removeEventListener("keydown", keyboard);
      canvas.removeEventListener("webglcontextlost", contextLost);
      controls.dispose();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          for (const mat of Array.isArray(object.material)
            ? object.material
            : [object.material]) {
            materials.add(mat);
            if ("map" in mat && mat.map instanceof THREE.Texture)
              textures.add(mat.map);
            if ("bumpMap" in mat && mat.bumpMap instanceof THREE.Texture)
              textures.add(mat.bumpMap);
          }
        }
      });
      textures.forEach((texture) => texture.dispose());
      materials.forEach((mat) => mat.dispose());
      environment.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.canvasHost} data-status={status}>
      {(props.scrollProgressRef || props.flowProgressRef) &&
        !props.centered && (
          <div
            ref={annotationRef}
            className={styles.partAnnotation}
            hidden
            aria-hidden="true"
          >
            <svg className={styles.annotationDrawing}>
              <path ref={annotationLineRef} />
              <path
                ref={annotationArrowRef}
                className={styles.annotationArrow}
                d="M 0 0 L -12 -5 L -9 0 L -12 5 Z"
              />
            </svg>
            <div ref={annotationLabelRef} className={styles.partLabel} />
          </div>
        )}
      {status === "loading" && (
        <div className={styles.loading}>
          <span />
          제품을 준비하고 있어요
        </div>
      )}
      {status === "error" && (
        <div className={styles.fallback}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/grok-reference.jpg" alt="GROK BOT 제품 레퍼런스" />
          <p>
            이 브라우저에서 3D 화면을 표시할 수 없습니다. 하드웨어 가속을 켜고
            새로고침해 주세요.
          </p>
        </div>
      )}
    </div>
  );
}
