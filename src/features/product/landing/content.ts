export const productPrice = 199000;
export const interestStorageKey = "grok-launch-interest-v1";
export { finishes, type Finish } from "../finishes";
export const chapters = [
  {
    id: "display",
    name: "OLED 디스플레이",
    label: "01 / THE DISPLAY",
    title: ["지금의 흐름을,", "한눈에."],
    description: "선택한 기능과 현재 상태를 한눈에.",
    detail: "상태 표시 · 기능 피드백",
    caption: "OLED STATUS DISPLAY",
  },
  {
    id: "knob",
    name: "볼륨 노브",
    label: "02 / THE DIAL",
    title: ["한 번의 회전.", "빛이 따라옵니다."],
    description: "돌리는 순간, 테두리의 빛이 반응합니다.",
    detail: "로터리 다이얼 · 테두리 라이트",
    caption: "ROTARY VOLUME DIAL",
  },
  {
    id: "keys",
    name: "키캡 & LED",
    label: "03 / THE KEYS",
    title: ["손끝의 감각.", "빛으로 돌아오다."],
    description: "누르면 빛이 가려지고, 놓으면 다시 켜집니다.",
    detail: "11개 키 · 독립 LED 링",
    caption: "TACTILE KEYS & LIGHT",
  },
  {
    id: "layers",
    name: "내부 구조",
    label: "04 / THE INSIDE",
    title: ["안쪽까지,", "빈틈없이."],
    description: "키캡부터 회로기판까지. 안쪽의 디테일을 펼쳐보세요.",
    detail: "키캡 → 스위치 → 상판 → PCB → 하판",
    caption: "LAYER BY LAYER",
    note: "내부 구조는 이해를 돕는 콘셉트 표현입니다.",
  },
] as const;
export const faq = [
  [
    "출시 가격은 얼마인가요?",
    "GROK BOT / 01의 안내 가격은 199,000원입니다. 최종 판매 구성과 구매 조건은 출시 시 안내됩니다.",
  ],
  [
    "지금 바로 구매할 수 있나요?",
    "현재는 출시 전 공개 단계입니다. 구매와 결제는 출시 후 열리며, 이 페이지에서 관심 있는 마감을 미리 선택할 수 있습니다.",
  ],
  [
    "어떤 기능과 프로그램을 지원하나요?",
    "화면에서는 대화·탐색·제작·창작을 위한 사용 방식을 소개합니다. 실제 지원 프로그램, 연결 방식 및 호환 운영체제는 출시 안내에서 확인할 수 있습니다.",
  ],
  [
    "3D 화면과 실제 제품이 같은가요?",
    "이 페이지는 제품의 형태와 사용 감각을 살펴보는 3D 프리뷰입니다. 세부 재질, 내부 구조 및 최종 제조 사양은 달라질 수 있습니다.",
  ],
  [
    "출시 알림은 어떻게 받나요?",
    "이메일과 관심 마감을 입력할 수 있습니다. 현재 신청 정보는 이 기기에만 보관되며, 실제 접수 및 이메일 발송 서비스는 준비 중입니다. 저장한 정보는 신청 창에서 삭제할 수 있습니다.",
  ],
] as const;
