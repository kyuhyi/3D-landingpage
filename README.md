# BSD BOT · 3D Landing Page

마우스로 회전하고 스크롤로 부품을 살펴보는 인터랙티브 제품 랜딩페이지입니다.

## 실행

Node.js 22 이상을 사용합니다.

```bash
npm ci
npm run dev
```

`http://localhost:3000/`에서 실행됩니다. 기존 `/grok/` 경로도 지원합니다.

```bash
npm run check
```

20개 기능 테스트, ESLint, TypeScript 검사를 포함한 프로덕션 빌드를 실행합니다. 정적 빌드 결과는 `out/`입니다.

## 구현 내용

- BSD 로고, BSD BOT 히어로, 화이트 배경과 Pretendard Bold/Thin
- 자동 3D 투어, 마우스 드래그 회전, 확대·축소, 제품 분해·조립
- 디스플레이 → 볼륨 노브 → 키캡 LED → 내부 구조의 스크롤 소개
- 스크롤 소개와 마지막 컬러 선택 모델의 직접 회전
- 검정 점선 화살표와 은은하게 점멸하는 빨간 화살촉
- 키를 누르면 LED가 가려지고 놓으면 복귀하는 키감 표현
- 저채도 파스텔 LED와 회전 시에만 빛나는 노브 테두리
- Black, White, Silver, Studio, Daylight, After hours의 6가지 마감 동기화
- 히어로 우측 설정 패널, 기본 Sound on, 모바일 반응형 배치
- 199,000원 가격 안내와 출시 알림 UI

## 조작

- 마우스 드래그 / 방향키: 회전
- 확대·축소 버튼 / Ctrl + 휠: 확대·축소
- 일반 휠: 페이지 스크롤. 스크롤을 다시 시작하면 소개 시점으로 자연스럽게 복귀합니다.
- 히어로 노브 드래그: 음량 조절. 소리는 사용자 입력 이후 WebAudio로 재생됩니다.

## 구조

```text
src/app/                     페이지와 공통 스타일
src/features/product/        3D 모델, 입력, 자동 투어, 히어로
src/features/product/landing/ 스크롤 소개와 출시 알림 UI
public/images/               사용자 로고와 제품 레퍼런스
public/fonts/pretendard/      로컬 폰트와 라이선스
docs/                        기획과 시각 검증 기록
```

현재 구현 기준은 `design-qa-white-landing.md`와 소스 코드입니다. 이전 기획·QA 문서는 제작 과정 기록이며 이후 요청으로 변경된 내용이 포함됩니다.

## 출시 알림과 모델 범위

출시 알림 정보는 현재 브라우저의 localStorage에만 저장됩니다. 실제 서버 접수, 메일 발송, 결제는 연결되어 있지 않습니다. 3D 내부 구조는 콘셉트 표현이며 제조용 CAD가 아닙니다.

## 모바일 앱 (PWA · Android APK)

### PWA 설치
배포된 HTTPS 주소를 안드로이드 Chrome에서 열면 "홈 화면에 추가"로 설치됩니다. 관련 파일:

- `public/manifest.webmanifest` — 앱 이름, 아이콘(any/maskable), standalone 표시
- `public/sw.js` + `scripts/build-sw.mjs` — `npm run build` 뒤 `out/`을 훑어 프리캐시 목록을 채우는 오프라인 서비스워커
- `src/app/register-service-worker.tsx` — 프로덕션 브라우저에서만 서비스워커 등록(네이티브 앱 안에서는 건너뜀)
- `src/app/layout.tsx` — `viewport-fit=cover`, 테마 색, 홈 화면 아이콘 메타
- `public/.well-known/assetlinks.json` — 안드로이드 앱(`com.bsd.bot`)과 사이트를 연결하는 Digital Asset Links

### Android APK (Capacitor)
`out/` 정적 빌드를 앱에 번들하므로 네트워크 없이도 랜딩페이지가 그대로 동작합니다.

```bash
npm run build          # out/ 생성 + 서비스워커 프리캐시
npx cap sync android   # out/ → android/app/src/main/assets/public
cd android && ./gradlew assembleDebug assembleRelease
```

- 결과물: `android/app/build/outputs/apk/debug/app-debug.apk`, `android/app/build/outputs/apk/release/app-release.apk`
- 요구 사항: JDK 21, Android SDK 36 (`android/local.properties`의 `sdk.dir`)
- 릴리스 서명 키: `android/keystore/` (git 제외). `keystore.properties`가 없으면 릴리스 APK는 서명되지 않습니다.
- 앱 아이콘·스플래시: `assets/` 원본에서 `npx @capacitor/assets generate --android`로 생성
- 웹 코드를 바꾸면 `npm run build && npx cap sync android` 후 다시 빌드합니다.

에뮬레이터 설치:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### Vercel 배포
GitHub 저장소를 Vercel에 Import 하면 `main` 푸시마다 자동 배포됩니다. `vercel.json`은 `sw.js` 무캐시, 매니페스트·assetlinks 콘텐츠 타입, 폰트 장기 캐시 헤더를 설정합니다.

## 라이선스

Next.js 초기 템플릿의 MIT 고지는 `LICENSE`에 보존되어 있습니다. Pretendard의 SIL OFL 고지는 `public/fonts/pretendard/LICENSE.txt`에 있습니다. BSD 로고 등 사용자 제공 브랜드 자산에 해당 오픈소스 라이선스가 자동 적용되는 것은 아닙니다.
