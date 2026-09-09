// 히어로, 스크롤 소개, 컬러 선택 영역이 함께 사용하는 마감 목록.
export const finishes = [
  {
    id: "obsidian",
    label: "Black",
    korean: "블랙",
    body: "#22282e",
    cap: "#20272c",
    note: "",
  },
  {
    id: "porcelain",
    label: "White",
    korean: "화이트",
    body: "#e8eae6",
    cap: "#e5e9e5",
    note: "",
  },
  {
    id: "silver",
    label: "Silver",
    korean: "유광 실버",
    body: "#bec8d2",
    cap: "#aebac5",
    note: "",
  },
  {
    id: "studio",
    label: "Studio",
    korean: "스튜디오 그레이",
    body: "#4e595e",
    cap: "#626e74",
    note: "",
  },
  {
    id: "daylight",
    label: "Daylight",
    korean: "데이라이트 아이보리",
    body: "#e9dfca",
    cap: "#f1e7d4",
    note: "",
  },
  {
    id: "afterhours",
    label: "After hours",
    korean: "애프터 아워스 퍼플",
    body: "#4d465f",
    cap: "#706280",
    note: "",
  },
] as const;

export type Finish = (typeof finishes)[number]["id"];
