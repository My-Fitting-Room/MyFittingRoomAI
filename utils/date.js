// Calendar-date helpers for the outfit planner.
//
// outfit_date is a wall-clock calendar date: "2026-07-12" means July 12
// wherever the device is. Everything here works off LOCAL date parts —
// toISOString() and new Date("YYYY-MM-DD") both go through UTC and shift
// the day for users west/east of it, so neither is used anywhere in this
// feature. Months are 1-based (1 = January) to match "YYYY-MM-DD" strings.

const pad = (n) => String(n).padStart(2, "0");

export const toDateString = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateString = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayString = () => toDateString(new Date());

// setDate rolls months/years and is DST-safe, unlike adding n * 86400000ms
export const addDays = (dateStr, n) => {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + n);
  return toDateString(date);
};

export const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

export const monthKey = (year, month) => `${year}-${pad(month)}`;

export const monthRange = (year, month) => ({
  start: `${year}-${pad(month)}-01`,
  end: `${year}-${pad(month)}-${pad(daysInMonth(year, month))}`,
});

export const addMonths = (year, month, n) => {
  const date = new Date(year, month - 1 + n, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
};

export const monthTitle = (year, month) =>
  `${new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" })} ${year}`;

// e.g. "Sat, Aug 2" for the bulk-assign confirm sheet
export const shortDateLabel = (dateStr) => {
  const date = parseDateString(dateStr);
  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${weekday}, ${month} ${date.getDate()}`;
};

// 42 cells (6 weeks, Sunday start) covering the month plus the adjacent-month
// days that fill out the first and last weeks
export const buildMonthGrid = (year, month) => {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const start = addDays(`${year}-${pad(month)}-01`, -firstWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const dateStr = addDays(start, i);
    const date = parseDateString(dateStr);
    return {
      dateStr,
      day: date.getDate(),
      inMonth: date.getMonth() + 1 === month && date.getFullYear() === year,
    };
  });
};

export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
