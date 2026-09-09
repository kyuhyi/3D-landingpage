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

## 라이선스

Next.js 초기 템플릿의 MIT 고지는 `LICENSE`에 보존되어 있습니다. Pretendard의 SIL OFL 고지는 `public/fonts/pretendard/LICENSE.txt`에 있습니다. BSD 로고 등 사용자 제공 브랜드 자산에 해당 오픈소스 라이선스가 자동 적용되는 것은 아닙니다.
