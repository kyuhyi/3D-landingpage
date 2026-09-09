"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Circle,
  Mail,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  chapters,
  faq,
  finishes,
  interestStorageKey,
  productPrice,
  type Finish,
} from "./content";
import { validateInterest } from "./scroll-story.mjs";
import { flowProgress } from "./flow-motion.mjs";
import type { LightMode, SceneProps } from "../product-scene";
import styles from "./sales-landing.module.css";

const Scene = dynamic(
  () => import("../product-scene").then((module) => module.ProductScene),
  { ssr: false },
);
const ignore = () => {};
const price = new Intl.NumberFormat("ko-KR").format(productPrice);

export function SalesLanding({
  finish,
  onFinishChange,
  light,
  atmosphere,
}: {
  finish: Finish;
  onFinishChange: (finish: Finish) => void;
  light: LightMode;
  atmosphere: number;
}) {
  const storyRef = useRef<HTMLElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const purchasePreview = useRef(0.08);
  const [flowActive, setFlowActive] = useState(false);
  const [viewRequest, setViewRequest] = useState<SceneProps["viewRequest"]>();
  const changeView = (kind: NonNullable<SceneProps["viewRequest"]>["kind"]) =>
    setViewRequest((previous) => ({ id: (previous?.id ?? 0) + 1, kind }));
  const [stickyBar, setStickyBar] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const purchaseRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedFinish, setSavedFinish] = useState<Finish>(finish);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!storyRef.current || !landingRef.current) return;
      const rect = storyRef.current.getBoundingClientRect();
      const row = storyRef.current.querySelector("article");
      const rowHeight =
        row?.getBoundingClientRect().height ?? window.innerHeight;
      progressRef.current = flowProgress(
        rect.top,
        rowHeight,
        window.innerHeight,
      );
      setFlowActive(rect.top < window.innerHeight && rect.bottom > 0);
      setStickyBar(landingRef.current.getBoundingClientRect().top < 80);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === storyRef.current) setSceneReady(true);
          if (entry.target === purchaseRef.current) setPreviewReady(true);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "400px" },
    );
    if (storyRef.current) observer.observe(storyRef.current);
    if (purchaseRef.current) observer.observe(purchaseRef.current);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  function openInterest() {
    setError("");
    try {
      const stored = JSON.parse(
        localStorage.getItem(interestStorageKey) ?? "null",
      );
      if (
        stored &&
        typeof stored.email === "string" &&
        finishes.some((item) => item.id === stored.finish)
      ) {
        setEmail(stored.email);
        setSavedFinish(stored.finish);
        setSaved(true);
      } else setSaved(false);
    } catch {
      setSaved(false);
    }
    dialogRef.current?.showModal();
  }
  function submitInterest(event: FormEvent) {
    event.preventDefault();
    const issue = validateInterest(email, consent);
    if (issue) {
      setError(issue);
      if (!email.includes("@")) emailRef.current?.focus();
      return;
    }
    try {
      localStorage.setItem(
        interestStorageKey,
        JSON.stringify({
          email: email.trim(),
          finish,
          savedAt: new Date().toISOString(),
        }),
      );
      setSavedFinish(finish);
      setSaved(true);
      setError("");
    } catch {
      setError(
        "이 기기에 저장할 수 없습니다. 브라우저의 저장 권한을 확인해 주세요.",
      );
    }
  }
  function removeInterest() {
    try {
      localStorage.removeItem(interestStorageKey);
      setSaved(false);
      setEmail("");
      setConsent(false);
      setError("");
    } catch {
      setError("저장된 정보를 삭제하지 못했습니다. 다시 시도해 주세요.");
    }
  }
  const selectedFinish = finishes.find((item) => item.id === finish)!;

  return (
    <div ref={landingRef} className={styles.landing}>
      <section
        ref={storyRef}
        id="product-story"
        className={styles.story}
        aria-label="제품 소개"
      >
        <div
          className={styles.flowVisual}
          data-active={flowActive}
          aria-hidden={!flowActive}
        >
          {sceneReady && (
            <Scene
              cinematic
              autoRotate={false}
              explode={0}
              light={light}
              finish={finish}
              atmosphere={atmosphere}
              resetToken={0}
              selectedKey={-1}
              onKeySelect={ignore}
              onInteract={ignore}
              flowProgressRef={progressRef}
              viewRequest={viewRequest}
              renderActive={flowActive}
            />
          )}
          {flowActive && stickyBar && (
            <div
              className={styles.flowTools}
              role="group"
              aria-label="제품 3D 보기 조작"
            >
              <span>드래그 회전</span>
              <button
                type="button"
                onClick={() => changeView("zoom-out")}
                aria-label="제품 축소"
                title="제품 축소"
              >
                <Minus size={18} />
              </button>
              <button
                type="button"
                onClick={() => changeView("zoom-in")}
                aria-label="제품 확대"
                title="제품 확대"
              >
                <Plus size={18} />
              </button>
              <button
                type="button"
                onClick={() => changeView("home")}
                aria-label="소개 시점으로"
                title="소개 시점으로"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          )}
        </div>
        {chapters.map((item, index) => (
          <article
            id={`detail-${item.id}`}
            key={item.id}
            className={styles.flowSection}
            data-side={index % 2 === 0 ? "left" : "right"}
            aria-labelledby={`chapter-${item.id}`}
          >
            <div className={styles.flowCopy}>
              <span className={styles.partName}>{item.name}</span>
              <h2 id={`chapter-${item.id}`}>
                {item.title[0]}
                <br />
                <em>{item.title[1]}</em>
              </h2>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        id="launch"
        ref={purchaseRef}
        className={styles.purchase}
        aria-labelledby="purchase-title"
      >
        <div className={styles.purchaseVisual}>
          {previewReady && (
            <Scene
              cinematic
              centered
              autoRotate={false}
              explode={0}
              light={light}
              finish={finish}
              atmosphere={atmosphere}
              resetToken={0}
              selectedKey={-1}
              onKeySelect={ignore}
              onInteract={ignore}
              scrollProgressRef={purchasePreview}
            />
          )}
          <span className={styles.finishCaption}>
            {selectedFinish.label.toUpperCase()}
            <span>{selectedFinish.korean}</span>
          </span>
        </div>
        <div className={styles.purchaseCopy}>
          <span className={styles.status}>출시 예정</span>
          <h2 id="purchase-title">
            나의 데스크.
            <br />
            <em>나만의 색.</em>
          </h2>

          <p className={styles.price}>{price}원</p>
          <fieldset className={styles.finishPicker}>
            <legend>
              컬러 <span>{selectedFinish.label}</span>
            </legend>
            <div>
              {finishes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles[item.id]}
                  aria-label={`관심 마감 ${item.label}`}
                  title={item.label}
                  aria-pressed={finish === item.id}
                  onClick={() => onFinishChange(item.id)}
                >
                  {finish === item.id && <Check size={15} />}
                </button>
              ))}
            </div>
            <p>{selectedFinish.note}</p>
          </fieldset>
          <button className={styles.primaryButton} onClick={openInterest}>
            <Bell size={17} /> 출시 알림 신청 <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq-title">
        <div>
          <h2 id="faq-title">궁금한 점.</h2>
        </div>
        <div className={styles.questions}>
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <ChevronDown size={16} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <a href="#">
          <Circle size={12} fill="currentColor" /> Grok Bot <span>— 001</span>
        </a>
        <span>© {new Date().getFullYear()} GROK BOT</span>
      </footer>

      <aside
        className={styles.launchBar}
        hidden={!stickyBar}
        aria-label="출시 알림 빠른 신청"
      >
        <div>
          <strong>GROK BOT / 01</strong>
          <span>{price}원</span>
        </div>
        <button onClick={openInterest}>
          출시 알림 신청 <ArrowRight size={14} />
        </button>
      </aside>

      <dialog
        ref={dialogRef}
        className={styles.launchDialog}
        aria-labelledby="interest-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <button
          className={styles.closeDialog}
          aria-label="출시 알림 창 닫기"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={22} />
        </button>

        <h2 id="interest-title">
          {saved ? "관심 제품을 저장했어요." : "출시 알림 신청"}
        </h2>
        {saved ? (
          <div className={styles.savedState}>
            <Check size={30} />
            <p>{email}</p>
            <span>
              GROK BOT / 01 ·{" "}
              {finishes.find((item) => item.id === savedFinish)?.label}
            </span>
            <p className={styles.formNotice}>
              이 기기에 신청 정보가 저장되었습니다.
              <br />
              실제 알림 접수와 이메일 발송은 아직 시작되지 않았습니다.
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => dialogRef.current?.close()}
            >
              확인 <Check size={16} />
            </button>
            <button className={styles.deleteButton} onClick={removeInterest}>
              이 기기에 저장된 정보 삭제
            </button>
          </div>
        ) : (
          <form onSubmit={submitInterest} noValidate>
            <label className={styles.emailLabel} htmlFor="launch-email">
              이메일 주소
            </label>
            <div className={styles.emailField}>
              <Mail size={17} />
              <input
                ref={emailRef}
                id="launch-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={!!error}
                aria-describedby="launch-notice launch-error"
                required
              />
            </div>
            <p className={styles.chosenFinish}>
              선택한 마감 <strong>{selectedFinish.label}</strong>
            </p>
            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                이메일과 관심 마감을 이 기기에 보관하는 데 동의합니다.
              </span>
            </label>
            <p id="launch-notice" className={styles.formNotice}>
              알림 서비스 준비 중입니다. 현재 입력 내용은 이 기기에만 보관되며,
              외부로 전송되거나 실제 알림 신청으로 접수되지 않습니다.
            </p>
            <p id="launch-error" className={styles.formError} role="alert">
              {error}
            </p>
            <button className={styles.primaryButton} type="submit">
              신청 정보 저장 <ArrowRight size={17} />
            </button>
          </form>
        )}
        {saved && error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
      </dialog>
    </div>
  );
}
