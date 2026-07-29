import {
  toDateString,
  parseDateString,
  todayString,
  addDays,
  daysInMonth,
  monthKey,
  monthRange,
  addMonths,
  buildMonthGrid,
} from "../utils/date";

describe("toDateString / parseDateString", () => {
  it("round-trips using local date parts", () => {
    expect(toDateString(new Date(2026, 6, 12))).toBe("2026-07-12");
    const parsed = parseDateString("2026-07-12");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(6);
    expect(parsed.getDate()).toBe(12);
  });

  it("zero-pads month and day", () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("does not shift late-evening local times to the next UTC day", () => {
    // In any timezone west of UTC, toISOString() on 11pm local rolls the
    // date forward; local-part formatting must not
    expect(toDateString(new Date(2026, 6, 12, 23, 30))).toBe("2026-07-12");
  });
});

describe("addDays", () => {
  it("adds within a month", () => {
    expect(addDays("2026-07-10", 3)).toBe("2026-07-13");
  });

  it("crosses month and year boundaries", () => {
    expect(addDays("2026-07-30", 5)).toBe("2026-08-04");
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("handles leap years", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
  });

  it("crosses US DST transitions without gaining or losing a day", () => {
    // Spring forward (Mar 8 2026) and fall back (Nov 1 2026)
    expect(addDays("2026-03-07", 1)).toBe("2026-03-08");
    expect(addDays("2026-03-08", 1)).toBe("2026-03-09");
    expect(addDays("2026-10-31", 2)).toBe("2026-11-02");
  });
});

describe("month helpers", () => {
  it("daysInMonth", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 7)).toBe(31);
  });

  it("monthKey and monthRange pad correctly", () => {
    expect(monthKey(2026, 7)).toBe("2026-07");
    expect(monthRange(2026, 2)).toEqual({ start: "2026-02-01", end: "2026-02-28" });
  });

  it("addMonths wraps years in both directions", () => {
    expect(addMonths(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe("buildMonthGrid", () => {
  it("always returns 42 cells", () => {
    expect(buildMonthGrid(2026, 7)).toHaveLength(42);
    expect(buildMonthGrid(2026, 2)).toHaveLength(42);
  });

  it("starts each week on Sunday", () => {
    // July 1 2026 is a Wednesday, so the grid leads with Jun 28 (Sunday)
    const grid = buildMonthGrid(2026, 7);
    expect(grid[0]).toEqual({ dateStr: "2026-06-28", day: 28, inMonth: false });
    expect(grid[3]).toEqual({ dateStr: "2026-07-01", day: 1, inMonth: true });
    expect(parseDateString(grid[0].dateStr).getDay()).toBe(0);
  });

  it("marks exactly the current month's days inMonth", () => {
    const grid = buildMonthGrid(2026, 7);
    expect(grid.filter((c) => c.inMonth)).toHaveLength(31);
    expect(grid.filter((c) => c.inMonth)[0].dateStr).toBe("2026-07-01");
    expect(grid.filter((c) => c.inMonth)[30].dateStr).toBe("2026-07-31");
  });

  it("handles a month starting on Sunday with no leading fillers", () => {
    // Feb 1 2026 is a Sunday
    const grid = buildMonthGrid(2026, 2);
    expect(grid[0]).toEqual({ dateStr: "2026-02-01", day: 1, inMonth: true });
  });
});

describe("todayString", () => {
  it("matches local date parts of now", () => {
    expect(todayString()).toBe(toDateString(new Date()));
  });
});
