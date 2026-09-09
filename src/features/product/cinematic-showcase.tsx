"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Box,
  Grid2X2,
  Hand,
  Layers3,
  Minus,
  Moon,
  Orbit,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { LightMode, SceneProps } from "./product-scene";
import { sampleTour, type TourFrame } from "./cinematic-motion.mjs";
import { clampVolume } from "./product-input.mjs";
import styles from "./cinematic.module.css";
import { SalesLanding } from "./landing/sales-landing";
import { finishes, type Finish } from "./finishes";

const Scene = dynamic(
  () => import("./product-scene").then((module) => module.ProductScene),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        Preparing your desk mate
        <span />
      </div>
    ),
  },
);
export function CinematicShowcase() {
  const [playing, setPlaying] = useState(true);
  const light: LightMode = "studio";
  const [finish, setFinish] = useState<Finish>("obsidian");
  const [atmosphere, setAtmosphere] = useState(65);
  const [explode, setExplode] = useState(0);
  const [frame, setFrame] = useState<TourFrame>(sampleTour(0));
  const [selected, setSelected] = useState(-1);
  const [reset, setReset] = useState(0);
  const [sound, setSound] = useState(true);
  const [volume, setVolume] = useState(65);
  const [keyPressToken, setKeyPressToken] = useState(0);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [viewRequest, setViewRequest] = useState<SceneProps["viewRequest"]>();
  const audioRef = useRef<AudioContext | null>(null);
  const reduced = useRef(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = motion.matches;
      if (motion.matches) setPlaying(false);
    };
    update();
    motion.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      void audioRef.current?.close();
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, []);
  const updateFrame = useCallback((next: TourFrame) => {
    setFrame(next);
    setExplode(next.explode);
  }, []);
  const pause = useCallback(() => {
    setPlaying(false);
  }, []);
  function requestView(kind: NonNullable<SceneProps["viewRequest"]>["kind"]) {
    pause();
    setViewRequest((previous) => ({ id: (previous?.id ?? 0) + 1, kind }));
  }
  function chooseKey(index: number) {
    setSelected(index);
    setKeyPressToken((value) => value + 1);
    if (!sound || volume === 0) return;
    playFeedback(index, volume);
  }
  function changeVolume(value: number) {
    const next = clampVolume(value);
    setVolume(next);
    setSound(next > 0);
    if (next > 0 && !previewTimer.current) {
      playFeedback(0, next);
      previewTimer.current = setTimeout(() => {
        previewTimer.current = null;
      }, 90);
    }
  }
  function playFeedback(index: number, level: number) {
    const context = audioRef.current ?? new AudioContext();
    audioRef.current = context;
    void context.resume();
    const oscillator = context.createOscillator(),
      gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(180 + index * 18, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      55,
      context.currentTime + 0.05,
    );
    gain.gain.setValueAtTime(0.2 * (level / 100) ** 2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.07);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.08);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }
  function tour() {
    setReset((value) => value + 1);
    setPlaying(!reduced.current);
    setExplode(0);
    setFrame(sampleTour(0));
  }
  const chapter = playing ? frame.chapter : explode > 0.1 ? "layers" : "detail";

  return (
    <main
      lang="ko"
      className={styles.site}
      data-light={light}
      data-chapter={chapter}
    >
      <header className={styles.header}>
        <button
          className={styles.brand}
          onClick={tour}
          aria-label="BSD 처음부터 보기"
        >
          <Image
            src="/images/bsd-logo.png"
            alt="BSD — Business System Development"
            width={500}
            height={100}
            unoptimized
            priority
            className={styles.brandLogo}
          />
        </button>
        <nav aria-label="주 메뉴">
          <button className={styles.navActive} onClick={tour}>
            제품
          </button>
          <a href="#product-story">디테일</a>
          <a href="#launch">출시 알림</a>
        </nav>
        <span className={styles.headerNote}>INTELLIGENCE, WITHIN REACH.</span>
      </header>

      <section className={styles.stage} aria-label="Grok Bot 자동 3D 쇼케이스">
        <div className={styles.heroVisual}>
          <Scene
            cinematic
            autoRotate={playing}
            explode={explode}
            light={light}
            finish={finish}
            atmosphere={atmosphere}
            volume={volume}
            onVolumeChange={changeVolume}
            keyPressToken={keyPressToken}
            resetToken={reset}
            selectedKey={selected}
            onKeySelect={chooseKey}
            onInteract={pause}
            onTourFrame={updateFrame}
            viewRequest={viewRequest}
          />
        </div>
        <div className={styles.intro} aria-hidden={chapter !== "intro"}>
          <h1>
            BSD BOT.
            <br />
            <span>생각을, 손끝으로.</span>
          </h1>
        </div>

        <div className={styles.toolbar} role="group" aria-label="3D 보기 도구">
          <button
            onClick={() => {
              setPlaying((value) => !value);
            }}
            aria-label={playing ? "자동 투어 일시정지" : "자동 투어 재생"}
            aria-pressed={playing}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button onClick={() => requestView("top")} aria-label="위에서 보기">
            <Grid2X2 size={15} />
          </button>
          <button
            onClick={() => requestView("front")}
            aria-label="정면에서 보기"
          >
            <Orbit size={16} />
          </button>
          <button
            aria-label="제품 분해 또는 조립"
            aria-pressed={explode > 0.1}
            onClick={() => {
              setPlaying(false);
              setExplode(explode > 0.5 ? 0 : 1);
            }}
          >
            <Layers3 size={16} />
          </button>
          <button onClick={() => requestView("home")} aria-label="기본 시점">
            <RotateCcw size={14} />
          </button>
          <span className={styles.toolDivider} />
          <button onClick={() => requestView("zoom-in")} aria-label="확대">
            <Plus size={16} />
          </button>
          <button onClick={() => requestView("zoom-out")} aria-label="축소">
            <Minus size={16} />
          </button>
        </div>

        <div className={styles.gestureHint}>
          <Hand size={13} />
          <span>드래그로 회전</span>
          <span>스크롤로 살펴보기</span>
        </div>
        <aside className={styles.controlDeck} aria-label="제품 설정">
          <div className={styles.finishGroup}>
            <label>마감</label>
            <div className={styles.swatches}>
              {finishes.map((item) => (
                <button
                  key={item.id}
                  className={styles[item.id]}
                  aria-label={`${item.label} 마감`}
                  title={item.label}
                  aria-pressed={finish === item.id}
                  onClick={() => setFinish(item.id)}
                />
              ))}
              <span>{finishes.find((item) => item.id === finish)?.label}</span>
            </div>
          </div>
          <div className={styles.atmosphere}>
            <label htmlFor="grok-atmosphere">
              조명 <output>{atmosphere}%</output>
            </label>
            <div>
              <Sun size={12} />
              <input
                id="grok-atmosphere"
                type="range"
                min={0}
                max={100}
                value={atmosphere}
                onChange={(event) => setAtmosphere(Number(event.target.value))}
              />
              <Moon size={12} />
            </div>
          </div>
          <div className={styles.explodeGroup}>
            <label htmlFor="grok-explode">
              분해 <output>{Math.round(explode * 100)}%</output>
            </label>
            <div>
              <Box size={13} />
              <input
                id="grok-explode"
                type="range"
                min={0}
                max={100}
                value={Math.round(explode * 100)}
                onChange={(event) => {
                  setPlaying(false);
                  setExplode(Number(event.target.value) / 100);
                }}
              />
              <Layers3 size={13} />
            </div>
          </div>
          <div className={styles.feelGroup}>
            <label htmlFor="grok-volume">
              음량 <output>{volume}%</output>
            </label>
            <button aria-pressed={sound} onClick={() => setSound(!sound)}>
              {sound ? <Volume2 size={13} /> : <VolumeX size={13} />}Sound{" "}
              {sound ? "on" : "off"}
              <span className={styles.toggle} />
            </button>
            <input
              id="grok-volume"
              aria-label="효과음 음량"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              title="노브를 위아래로 드래그하거나 휠로 음량을 조절하세요"
            />
          </div>
          <button
            className={styles.meetButton}
            onClick={() =>
              document
                .getElementById("product-story")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            자세히 보기 <ArrowRight size={16} />
          </button>
        </aside>
      </section>

      <SalesLanding
        finish={finish}
        onFinishChange={setFinish}
        light={light}
        atmosphere={atmosphere}
      />

      <p className={styles.srOnly}>
        자동 투어가 재생됩니다. 왼쪽 일시정지 버튼 또는 제품 드래그로 멈출 수
        있습니다. 제품 키를 누르면 화면이 반응합니다.
      </p>
    </main>
  );
}
