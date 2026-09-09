# GROK BOT 실행 안내

2026-09-07 영상 리파인: `/grok/`은 `CinematicShowcase`를 사용합니다. 기본 자동 투어36초, 드래그 시 수동 전환, 마감3종/조명3종/강도/소리/레이어 제어를 제공합니다. 영상 QA: `design-qa-video.md`. 이전 소스 백업: `docs/backups/grok-before-video/`.

기존 메인 화면 및 루트 설정은 보존하고 `/grok/` 경로에 제품 쇼케이스를 추가했습니다.

## 재설치 및 실행
```powershell
npm ci
Push-Location src/features/product
npm ci
Pop-Location
npm run dev -- --port 3100
```

브라우저: http://localhost:3100/grok/

현재 최종 미리보기는 프로덕션 빌드의 `out/` 폴더를 정적으로 서빙합니다.
```powershell
npm run build
python -m http.server 3100 --bind 127.0.0.1 --directory out
```
개발 서버를 시작하려면 같은 포트를 쓰는 미리보기 서버를 먼저 종료하거나 다른 포트를 지정하세요.

Three.js 의존성은 독립된 feature package에 정확한 버전으로 선언했습니다. 기존 루트 package.json을 덮어쓰지 않으면서 기능을 재설치할 수 있습니다.

## 검증
```powershell
node --test src/features/product/model-state.test.mjs
node --test src/features/product/cinematic-motion.test.mjs
npx eslint src/features/product src/app/grok
npm run typecheck
npm run build
```

전체 lint는 이번 작업 전부터 `_insane-search/`의 CommonJS import 오류 13개로 실패합니다. 해당 외부 코드의 lint 설정은 수정하지 않았습니다.

## 조작
- 마우스 드래그 / 터치 드래그: 제품 회전
- 마우스 휠 / 두 손가락 핀치: 확대 축소
- 캔버스 포커스 후 방향키: 키보드 회전
- 분해해서 보기 및 슬라이더: 5개 레이어 분리
- 완성된 형태: 재조립
- 원형 화살표: 카메라와 분해 상태 초기화
- Studio / Daylight / After hours: 조명과 화면 배경 변경
- 제품 키 및 오른쪽 기능 선택: OLED와 설명 변경
- 제품 사양: 키보드 포커스가 유지되는 네이티브 모달

## 범위
원본 사진을 참고한 콘셉트 3D 모델입니다. 사진에서 보이지 않는 내부와 뒷면은 추정 디자인입니다. 제조용 CAD, 실제 제품 제어, AI 백엔드, 주문/결제 연결은 포함하지 않습니다.
