const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatSlot(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

export function formatSlotCompact(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAYS[d.getDay()]})`;
}

export function formatSlotParts(iso: string) {
  const d = new Date(iso);
  return { month: d.getMonth() + 1, day: d.getDate(), weekday: WEEKDAYS[d.getDay()] };
}
