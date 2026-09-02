import { colors } from '../theme/colors';


export const CATEGORIES = [
  { key: 'food', label: 'Food', color: colors.catFood, icon: 'nutrition' },
  { key: 'dairy', label: 'Dairy', color: colors.catDairy, icon: 'cafe' },
  { key: 'meat', label: 'Meat', color: colors.catMeat, icon: 'restaurant' },
  { key: 'other', label: 'Other', color: colors.catOther, icon: 'ellipsis-horizontal' },];

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export const CATEGORY_BY_KEY = CATEGORIES.reduce((acc, c) => {
  acc[c.key] = c;
  return acc;
}, {});

export function categoryLabel(key) {
  return CATEGORY_BY_KEY[key]?.label ?? 'Other';
}

export function categoryColor(key) {
  return CATEGORY_BY_KEY[key]?.color ?? colors.catOther;
}

export function categoryIcon(key) {
  return CATEGORY_BY_KEY[key]?.icon ?? 'ellipsis-horizontal';
}

// Convenience for the store/merchant quick-picks on the Add Expense form.
export const KNOWN_MERCHANTS = [
  'Súper Selectos',
  'La Despensa Familiar',
  'Farmacia San Nicolás',
  'Panadería La Espiga',
  'Carnicería El Novillo',
];
