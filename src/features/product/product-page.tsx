"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Box,
  Check,
  ChevronRight,
  Circle,
  Code2,
  Command,
  Layers3,
  Moon,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Sun,
  X,
  Zap,
} from "lucide-react";
import type { LightMode } from "./product-scene";
import styles from "./product.module.css";

const ProductScene = dynamic(
  () => import("./product-scene").then((module) => module.ProductScene),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <span />
        3D 스튜디오 불러오는 중
      </div>
    ),
  },
);

const actions = [
  ["Chat", "생각의 시작, 대화 한 번.", "떠오른 아이디어를 바로 꺼내 보세요."],
  [
    "Research",
    "호기심을 더 깊이.",
    "질문에서 발견까지, 자연스럽게 이어지는 흐름.",
  ],
  ["Build", "아이디어가 현실이 되는 순간.", "만들고 싶은 것에 집중하세요."],
  [
    "Create",
    "상상에 새로운 형태를.",
    "하나의 영감에서 시작되는 무한한 가능성.",
  ],
  [
    "Focus",
    "지금, 중요한 것 하나에.",
    "방해는 내려놓고 몰입의 리듬을 만드세요.",
  ],
  [
    "Review",
    "좋은 아이디어를 더 단단하게.",
    "놓쳤던 디테일까지, 한 번 더 살펴보세요.",
  ],
  ["Approve", "다음 단계로 나아갈 준비.", "확신이 생겼다면, 한 번의 터치로."],
  [
    "Pause",
    "잠시 멈추는 것도 흐름의 일부.",
    "당신의 속도에 맞춰 다시 시작하세요.",
  ],
  [
    "Voice",
    "말하는 순간, 아이디어가 되다.",
    "키보드보다 빠른 당신의 생각을 담으세요.",
  ],
  [
    "Execute",
    "생각은 끝. 이제 실행할 시간.",
    "준비된 워크플로를 하나의 키로 시작하세요.",
  ],
  ["New task", "다음 가능성을 열어보세요.", "새로운 작업, 새로운 시작."],
];

export function ProductPage() {
  const [light, setLight] = useState<LightMode>("studio");
  const [explode, setExplode] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [selectedKey, setSelectedKey] = useState(-1);
  const [tab, setTab] = useState<"overview" | "details">("overview");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const active = selectedKey >= 0 ? actions[selectedKey] : null;

  function reset() {
    setExplode(0);
    setTab("overview");
    setAutoRotate(false);
    setResetToken((value) => value + 1);
  }

  function explore() {
    viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setExplode(1);
    setTab("details");
  }

  function selectTab(next: "overview" | "details") {
    setTab(next);
    setExplode(next === "details" ? 1 : 0);
  }

  return (
    <main
      lang="ko"
      className={`${styles.site} ${light === "daylight" ? styles.daylight : ""} ${light === "afterhours" ? styles.afterhours : ""}`}
    >
      <header className={styles.header}>
        <a className={styles.logo} href="#product" aria-label="GROK BOT 홈">
          <Command size={23} strokeWidth={1.7} />
          <span>
            grok<span className={styles.logoLight}>bot</span>
            <sup>®</sup>
          </span>
        </a>
        <nav className={styles.nav} aria-label="주 메뉴">
          <a className={styles.navActive} href="#product">
            제품 <span>01</span>
          </a>
          <a href="#philosophy">디자인 철학</a>
          <button onClick={() => dialogRef.current?.showModal()}>
            제품 사양 <ArrowUpRight size={12} />
          </button>
        </nav>
        <button className={styles.headerCta} onClick={explore}>
          직접 경험하기 <ArrowUpRight size={15} />
        </button>
      </header>

      <section id="product" className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.productId}>
            <span>GROK BOT / 01</span>
            <span className={styles.muted}>THE PHYSICAL INTERFACE</span>
          </div>
          <div className={styles.available}>
            <span className={styles.liveDot} /> READY WHEN YOU ARE
          </div>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.viewer} ref={viewerRef}>
            <div className={styles.viewerTop}>
              <span className={styles.edition}>DESIGNED FOR YOUR FLOW</span>
              <span className={styles.liveView}>
                <Box size={12} /> LIVE 3D
              </span>
            </div>
            <ProductScene
              explode={explode}
              light={light}
              autoRotate={autoRotate}
              resetToken={resetToken}
              selectedKey={selectedKey}
              onKeySelect={setSelectedKey}
              onInteract={() => setAutoRotate(false)}
            />
            <div className={styles.viewMarker}>
              <span>{explode > 0.1 ? "02" : "01"}</span> /{" "}
              {explode > 0.1
                ? "키캡 · 스위치 · 상판 · 회로기판 · 하판"
                : "A NEW WAY TO CONNECT."}
            </div>
            <div className={styles.dragHint}>
              <MousePointer2 size={13} />
              <span>드래그하여 360° 회전</span>
              <span className={styles.hintDivider} />
              스크롤로 확대
            </div>
            <button
              className={styles.resetButton}
              onClick={reset}
              aria-label="기본 시점으로 초기화"
              title="기본 시점으로 초기화"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <aside className={styles.productCopy}>
            <div className={styles.smallLabel}>
              <span className={styles.shortLine} /> MEET YOUR NEW DESKMATE
            </div>
            <h1>
              Digital minds.
              <br />
              <span>
                Physical
                <br className={styles.desktopBreak} /> presence.
              </span>
            </h1>
            <p className={styles.intro}>
              생각과 실행 사이,
              <br />
              당신의 손끝에 놓인 새로운 가능성.
            </p>
            <p className={styles.description}>
              디지털의 무한한 능력을 물리적인 감각으로.
              <br />
              누르고, 돌리고, 몰입하세요.
              <br />
              당신의 흐름을 위한 하나의 인터페이스.
            </p>

            <div className={styles.lightSection}>
              <div className={styles.controlLabel}>
                <span>SET THE MOOD</span>
                <span>조명</span>
              </div>
              <div
                className={styles.lightSwitch}
                role="group"
                aria-label="제품 조명 선택"
              >
                <button
                  aria-pressed={light === "studio"}
                  className={light === "studio" ? styles.lightActive : ""}
                  onClick={() => setLight("studio")}
                >
                  <Circle size={12} />
                  Studio
                </button>
                <button
                  aria-pressed={light === "daylight"}
                  className={light === "daylight" ? styles.lightActive : ""}
                  onClick={() => setLight("daylight")}
                >
                  <Sun size={13} />
                  Daylight
                </button>
                <button
                  aria-pressed={light === "afterhours"}
                  className={light === "afterhours" ? styles.lightActive : ""}
                  onClick={() => setLight("afterhours")}
                >
                  <Moon size={12} />
                  After hours
                </button>
              </div>
            </div>

            <div className={styles.activity} aria-live="polite">
              <div className={styles.controlLabel}>
                <span>
                  <span className={styles.liveDot} /> DECK ACTIVITY
                </span>
                <span>
                  {active ? String(selectedKey + 1).padStart(3, "0") : "001"}
                </span>
              </div>
              <h2>{active ? active[1] : "Your team is here."}</h2>
              <p>
                {active
                  ? active[2]
                  : "제품의 키를 눌러, 아이디어를 움직여 보세요."}
              </p>
              <div
                className={`${styles.waveform} ${active ? styles.waveformActive : ""}`}
                aria-hidden="true"
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <AudioLines key={i} size={25} strokeWidth={1.2} />
                ))}
              </div>
              <div className={styles.keyChoices} aria-label="제품 키 기능 선택">
                {actions.slice(0, 4).map((action, i) => (
                  <button
                    key={action[0]}
                    className={`${styles.keyChoice} ${selectedKey === i ? styles.keyChoiceActive : ""}`}
                    aria-pressed={selectedKey === i}
                    onClick={() => setSelectedKey(i)}
                  >
                    <span />
                    {action[0]}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.productMeta}>
            <span className={styles.finishDot} />
            <div>
              <strong>Graphite edition</strong>
              <span>정교하게 설계된, 당신만의 컨트롤.</span>
            </div>
          </div>
          <div className={styles.viewerControls}>
            <button
              className={`${styles.iconControl} ${autoRotate ? styles.controlActive : ""}`}
              aria-label={autoRotate ? "자동 회전 멈추기" : "자동 회전 시작"}
              aria-pressed={autoRotate}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              {autoRotate ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <div
              className={styles.modeSwitch}
              role="group"
              aria-label="모델 보기 방식"
            >
              <button
                aria-pressed={tab === "overview"}
                className={tab === "overview" ? styles.modeActive : ""}
                onClick={() => selectTab("overview")}
              >
                <Box size={14} />
                완성된 형태
              </button>
              <button
                aria-pressed={tab === "details"}
                className={tab === "details" ? styles.modeActive : ""}
                onClick={() => selectTab("details")}
              >
                <Layers3 size={14} />
                분해해서 보기
              </button>
            </div>
            <div className={styles.explodeSlider}>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(explode * 100)}
                aria-label="제품 분해 정도"
                onChange={(event) => {
                  const value = Number(event.target.value) / 100;
                  setExplode(value);
                  setTab(value > 0 ? "details" : "overview");
                }}
              />
              <output>
                {Math.round(explode * 100)}
                <small>%</small>
              </output>
            </div>
          </div>
          <a className={styles.scrollLink} href="#philosophy">
            디테일을 발견하세요 <ArrowDown size={14} />
          </a>
        </div>
      </section>

      <section id="philosophy" className={styles.philosophy}>
        <div className={styles.sectionKicker}>
          <span>01 — THE PHILOSOPHY</span>
          <ArrowDownRight size={20} />
        </div>
        <div className={styles.philosophyHeading}>
          <h2>
            Less between you
            <br />
            and your <span>next idea.</span>
          </h2>
          <p>
            더 많은 창을 여는 대신, 더 깊은 몰입을.
            <br />
            복잡한 과정을 덜어내고 만드는 즐거움만 남겼습니다.
            <br />
            좋은 도구는 당신의 생각을 방해하지 않으니까요.
          </p>
        </div>
        <div className={styles.features}>
          <article>
            <Command size={22} />
            <span>01 / TACTILE</span>
            <h3>생각을 깨우는 감각.</h3>
            <p>
              손끝에서 느껴지는 키의 깊이.
              <br />
              모든 입력에 분명하게 응답하는 인터페이스.
            </p>
            <strong>
              11개의 키, 무한한 가능성 <ArrowUpRight size={14} />
            </strong>
          </article>
          <article>
            <Layers3 size={23} />
            <span>02 / CRAFTED</span>
            <h3>보이지 않는 곳까지.</h3>
            <p>
              차분한 메탈 바디부터 내부 레이어까지.
              <br />
              하나의 경험을 완성하는 정교한 디테일.
            </p>
            <button onClick={explore}>
              구조 살펴보기 <ArrowUpRight size={14} />
            </button>
          </article>
          <article>
            <Zap size={22} />
            <span>03 / CONNECTED</span>
            <h3>당신의 흐름에 연결.</h3>
            <p>
              대화에서 탐색으로, 영감에서 실행으로.
              <br />
              자연스러운 흐름을 위한 전용 컨트롤.
            </p>
            <button onClick={() => dialogRef.current?.showModal()}>
              컨셉 사양 보기 <ArrowUpRight size={14} />
            </button>
          </article>
        </div>
      </section>
      <section className={styles.closing}>
        <span className={styles.smallLabel}>BUILT AROUND YOU.</span>
        <h2>
          Your ideas.
          <br />
          <span>In motion.</span>
        </h2>
        <button
          onClick={() => {
            reset();
            viewerRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        >
          다시 경험하기 <ArrowRight size={18} />
        </button>
      </section>
      <footer className={styles.footer}>
        <a href="#product" className={styles.logo}>
          <Command size={18} />
          grokbot<sup>®</sup>
        </a>
        <p>이미지에서 출발한 인터랙티브 제품 콘셉트.</p>
        <span>DESIGNED FOR HUMAN POTENTIAL. © 2026</span>
      </footer>

      <dialog
        ref={dialogRef}
        aria-labelledby="grok-spec-title"
        className={styles.specDialog}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className={styles.dialogInner}>
          <button
            className={styles.closeDialog}
            onClick={() => dialogRef.current?.close()}
            aria-label="제품 사양 닫기"
          >
            <X size={22} />
          </button>
          <span className={styles.smallLabel}>GROK BOT / 01</span>
          <h2 id="grok-spec-title">디테일의 합.</h2>
          <p>손끝의 경험을 위한 제품 콘셉트</p>
          <dl>
            <div>
              <dt>마감</dt>
              <dd>Graphite · 메탈 바디</dd>
            </div>
            <div>
              <dt>입력</dt>
              <dd>11개 키 · 로터리 노브</dd>
            </div>
            <div>
              <dt>디스플레이</dt>
              <dd>OLED 스타일 상태 화면</dd>
            </div>
            <div>
              <dt>연결 디자인</dt>
              <dd>USB-C</dd>
            </div>
            <div>
              <dt>레이어</dt>
              <dd>키캡 / 스위치 / 상판 / PCB / 하판</dd>
            </div>
            <div>
              <dt>3D 체험</dt>
              <dd>
                <Check size={14} /> 360° 회전 · 분해 · 조명 전환
              </dd>
            </div>
          </dl>
          <div className={styles.conceptNote}>
            <Code2 size={17} />
            <p>
              사진을 참고해 재구성한 콘셉트 모델입니다. 내부 구조는 시각화용이며
              실제 제품의 제조 사양이나 AI 연결 기능을 의미하지 않습니다.
            </p>
          </div>
          <button
            className={styles.dialogCta}
            onClick={() => {
              dialogRef.current?.close();
              explore();
            }}
          >
            레이어 직접 살펴보기 <ChevronRight size={16} />
          </button>
        </div>
      </dialog>
    </main>
  );
}
