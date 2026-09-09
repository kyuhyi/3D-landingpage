# GROK BOT / 01 제품 사이트 계획과 검증 하네스

## 목표
첨부된 제품 사진의 흑연색 금속 하우징, 3열 매크로 키, 작은 OLED, 노브와 파스텔 조명을 참고한 한국어 제품 쇼케이스.
사진은 시각 레퍼런스이며 실측 CAD가 아니므로 보이지 않는 내부 구조와 뒷면은 콘셉트 재구성.

## 아키텍처
- 기존 Next.js 16 App Router 및 React 19 유지.
- `src/features/product/`: 제품 페이지, 3D 뷰어, 모델 생성, 상태 계산, CSS 모듈.
- Three.js를 클라이언트에서 지연 로드하고 OrbitControls로 회전/확대 지원.
- 3D 모델은 하판, PCB, 상판, 스위치, 키캡 그룹으로 분리하여 동일한 분해율을 보간.
- 스튜디오/주광/야간 조명, 자동 회전, 기본 시점 복원, 분해 슬라이더.
- 키 선택에 따라 OLED와 활동 패널 동기화. 실제 AI API 연결은 범위 밖.
- 모든 인터랙션을 단일 페이지에서 제공하고 기능별 코드 분리.

## 검증 하네스
1. 수정 전: 기존 lint/typecheck 상태 확인.
2. 구현 전: 분해율 제한 및 위치 보간, 프리셋 검증을 Node 테스트로 정의.
3. 구현 후: 해당 테스트 → ESLint → TypeScript → Next.js production build.
4. 실제 브라우저: 모델 렌더, 마우스 드래그, 분해/조립, 조명 전환, 초기화, 키 상호작용, 모바일 오버플로와 콘솔 오류 확인.
5. 첨부 사진과 구현 캡처를 함께 검토하고 `design-qa.md` 기록.

## 디자인
- 어두운 무채색 배경, 차분한 모노스페이스 보조 표기, 큰 산세리프 제목.
- 모델을 화면 주인공으로 두고 기존 사진의 금속 질감과 민트/블루/앰버/라일락 조명 유지.
- 360도 모델 및 내부 구조는 사용자가 요청한 기능이므로 정지 이미지 생성으로 대체하지 않음.
- 모바일에서는 설명/모델/조작부를 세로로 배치하고 캔버스 바깥 스크롤 유지.
- 동작 감소 설정을 존중하고 WebGL 불가 시 원본 이미지와 명확한 안내 제공.

## 공식 기술 자료
- https://threejs.org/docs/pages/OrbitControls.html
- https://threejs.org/docs/pages/RoundedBoxGeometry.html
- 로컬 `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- 로컬 `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`
