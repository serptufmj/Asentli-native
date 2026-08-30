// Small date helpers for expense aggregation. Local time, no external lib.

const DAY = 24 * 60 * 60 * 1000;

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function startOfMonth(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function startOfYear(d) {
  const x = new Date(d);
  x.setMonth(0, 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Week starts Monday.
export function startOfWeek(d) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Mon=0 … Sun=6
  x.setDate(x.getDate() - day);
  return x;
}

function addMonths(d, n) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

/**
 * Current period + the equal "to-date" window immediately before it.
 * period: 'Weekly' | 'Monthly' | 'Yearly'
 */
export function periodRange(period, ref = new Date()) {
  const now = new Date(ref);
  let from;
  let prevFrom;
  let prevTo;

  if (period === 'Weekly') {
    from = startOfWeek(now);
    prevFrom = new Date(from.getTime() - 7 * DAY);
    prevTo = new Date(now.getTime() - 7 * DAY);
  } else if (period === 'Yearly') {
    from = startOfYear(now);
    prevFrom = startOfYear(new Date(now.getFullYear() - 1, 0, 1));
    prevTo = new Date(now);
    prevTo.setFullYear(prevTo.getFullYear() - 1);
  } else {
    // Monthly (default)
    from = startOfMonth(now);
    prevFrom = startOfMonth(addMonths(now, -1));
    prevTo = addMonths(now, -1);
  }

  return {
    from: from.toISOString(),
    to: now.toISOString(),
    prevFrom: prevFrom.toISOString(),
    prevTo: prevTo.toISOString(),
  };
}

export function monthRange(ref = new Date()) {
  const from = startOfMonth(ref);
  const to = new Date(ref);
  return { from: from.toISOString(), to: to.toISOString() };
}

/** Four ~weekly buckets covering the current calendar month. */
export function weekBucketsOfMonth(ref = new Date()) {
  const first = startOfMonth(ref);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const edges = [1, 8, 15, 22, daysInMonth + 1];
  const buckets = [];
  for (let i = 0; i < 4; i += 1) {
    const from = new Date(first);
    from.setDate(edges[i]);
    const to = new Date(first);
    to.setDate(edges[i + 1]);
    buckets.push({ label: `Week ${i + 1}`, from, to });
  }
  return buckets;
}

/** 'Today' | 'Yesterday' | 'Last Week' | 'Earlier' for grouping a list. */
export function relativeDayGroup(date, now = new Date()) {
  const d = startOfDay(date).getTime();
  const today = startOfDay(now).getTime();
  if (d === today) return 'Today';
  if (d === today - DAY) return 'Yesterday';
  if (d > today - 7 * DAY) return 'Last Week';
  return 'Earlier';
}

export const RELATIVE_GROUP_ORDER = ['Today', 'Yesterday', 'Last Week', 'Earlier'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Hand-rolled so it doesn't depend on Hermes's partial Intl number support.
export function formatMoney(n) {
  const value = Number.isFinite(n) ? n : 0;
  const neg = value < 0;
  const [int, dec] = Math.abs(value).toFixed(2).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}$${grouped}.${dec}`;
}

export function formatTime(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h < 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

export function formatDateTime(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${formatTime(d)}`;
}
