import { CATEGORIES } from '../constants/categories';
import { weekBucketsOfMonth, relativeDayGroup, RELATIVE_GROUP_ORDER, formatMoney } from './dates';

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function sumAmount(expenses = []) {
  return expenses.reduce((acc, e) => acc + num(e.amount), 0);
}

/** { food, dairy, meat, other } — every key present, 0 default. */
export function sumByCategory(expenses = []) {
  const out = {};
  CATEGORIES.forEach((c) => {
    out[c.key] = 0;
  });
  expenses.forEach((e) => {
    if (out[e.category] === undefined) out.other += num(e.amount);
    else out[e.category] += num(e.amount);
  });
  return out;
}

/** [{ key, label, color, value, pct }] for all 4 categories. pct in 0..1. */
export function donutData(expenses = []) {
  const byCat = sumByCategory(expenses);
  const total = sumAmount(expenses);
  return CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    color: c.color,
    value: byCat[c.key],
    pct: total > 0 ? byCat[c.key] / total : 0,
  }));
}

/** Per-category spend as a share of the monthly budget (0 budget -> 0). */
export function budgetBreakdown(expenses = [], monthlyTotal = 0) {
  const byCat = sumByCategory(expenses);
  const budget = num(monthlyTotal);
  return CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    color: c.color,
    icon: c.icon,
    amount: byCat[c.key],
    pct: budget > 0 ? byCat[c.key] / budget : 0,
  }));
}

/** Four bars for the current month. Returns [{ label, amount }]. */
export function weeklyBars(expenses = [], ref = new Date()) {
  const buckets = weekBucketsOfMonth(ref);
  return buckets.map((b) => {
    const amount = expenses.reduce((acc, e) => {
      const t = new Date(e.spent_at).getTime();
      return t >= b.from.getTime() && t < b.to.getTime() ? acc + num(e.amount) : acc;
    }, 0);
    return { label: b.label, amount };
  });
}

/** [{ title, items }] in Today / Yesterday / Last Week / Earlier order, non-empty only. */
export function groupByRelativeDate(expenses = [], now = new Date()) {
  const groups = {};
  expenses.forEach((e) => {
    const key = relativeDayGroup(e.spent_at, now);
    (groups[key] = groups[key] || []).push(e);
  });
  return RELATIVE_GROUP_ORDER.filter((title) => groups[title]?.length).map((title) => ({
    title,
    items: groups[title].sort((a, b) => new Date(b.spent_at) - new Date(a.spent_at)),
  }));
}

/** Simple "$X more/less than last period" line. */
export function comparisonText(current, previous, periodWord = 'last month') {
  const cur = num(current);
  const prev = num(previous);
  if (prev <= 0 && cur <= 0) {
    return 'No spending yet to compare.';
  }
  if (prev <= 0) {
    return `This is your first tracked spending — nothing to compare against ${periodWord} yet.`;
  }
  const diff = cur - prev;
  if (Math.abs(diff) < 0.01) return `You spent about the same as ${periodWord}.`;
  const dir = diff > 0 ? 'more' : 'less';
  return `You spent ${formatMoney(Math.abs(diff))} ${dir} than ${periodWord}.`;
}

export function periodWordFor(period) {
  if (period === 'Weekly') return 'last week';
  if (period === 'Yearly') return 'last year';
  return 'last month';
}
