import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { ProgressBar, PillButton } from '../components/ui';
import EmptyState from '../components/EmptyState';
import { useBudget, useMonthExpenses } from '../hooks/useExpenseData';
import { sumAmount, budgetBreakdown } from '../lib/expenseMath';
import { formatMoney } from '../lib/dates';

export default function BudgetDetailsScreen({ onBack, onNavigate, onBell, onEditBudget }) {
  const budgetQ = useBudget();
  const expensesQ = useMonthExpenses();

  const loading = budgetQ.isLoading || expensesQ.isLoading;
  const total = budgetQ.data?.monthlyTotal ?? 0;
  const expenses = expensesQ.data ?? [];
  const spent = sumAmount(expenses);
  const remaining = total - spent;
  const usedPct = total > 0 ? Math.min(spent / total, 1) : 0;
  const remainingPct = total > 0 ? Math.max(0, Math.round((remaining / total) * 100)) : 0;
  const breakdown = budgetBreakdown(expenses, total);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Budget Details" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Available budget */}
            <View style={styles.bigCard}>
              <Text style={styles.bigLabel}>Available Budget</Text>
              <Text style={styles.bigAmount}>
                {formatMoney(Math.max(remaining, 0))}{' '}
                <Text style={styles.bigOf}>of {formatMoney(total)}</Text>
              </Text>
              <View style={styles.bigProgressRow}>
                <ProgressBar progress={usedPct} color={colors.card} track="#FFFFFF33" />
              </View>
              <Text style={styles.bigPct}>
                {total > 0
                  ? `${remainingPct}% remaining this month`
                  : 'No budget set yet'}
              </Text>
            </View>

            {/* Allocated / Remaining */}
            <View style={styles.pairRow}>
              <View style={styles.pairCard}>
                <Text style={styles.pairLabel}>Allocated</Text>
                <Text style={styles.pairValue}>{formatMoney(total)}</Text>
              </View>
              <View style={styles.pairCard}>
                <Text style={styles.pairLabel}>Remaining</Text>
                <Text
                  style={[
                    styles.pairValue,
                    { color: remaining < 0 ? colors.error : colors.success },
                  ]}
                >
                  {formatMoney(remaining)}
                </Text>
              </View>
            </View>

            {/* Breakdown */}
            <Text style={styles.sectionTitle}>Budget Breakdown</Text>
            {spent === 0 ? (
              <EmptyState
                compact
                title="Sin gastos este mes"
                subtitle="Cuando registres gastos, vas a ver acá cómo se reparten por categoría."
              />
            ) : (
              breakdown.map((b) => (
                <View key={b.key} style={styles.breakRow}>
                  <View style={[styles.breakIcon, { backgroundColor: b.color + '22' }]}>
                    <Ionicons name={b.icon} size={18} color={b.color} />
                  </View>
                  <View style={styles.breakInfo}>
                    <View style={styles.breakTopRow}>
                      <Text style={styles.breakName}>{b.label}</Text>
                      <Text style={styles.breakAmount}>{formatMoney(b.amount)}</Text>
                    </View>
                    <ProgressBar progress={b.pct} color={b.color} />
                    <Text style={styles.breakPct}>
                      {total > 0 ? `${Math.round(b.pct * 100)}% of budget` : 'set a budget to see %'}
                    </Text>
                  </View>
                </View>
              ))
            )}

            <PillButton
              label={total > 0 ? 'Edit Budget' : 'Set Budget'}
              variant="orange"
              onPress={onEditBudget}
              style={{ marginTop: 12 }}
            />
          </>
        )}
      </ScrollView>

      <BottomNav active="Statistics" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  bigCard: {
    backgroundColor: colors.bannerGreen,
    borderRadius: 22,
    padding: 22,
  },
  bigLabel: { fontSize: 13, color: colors.bannerGreenText },
  bigAmount: { fontSize: 30, fontWeight: '800', color: colors.card, marginTop: 6 },
  bigOf: { fontSize: 14, fontWeight: '600', color: colors.bannerGreenText },
  bigProgressRow: { marginTop: 16, marginBottom: 8 },
  bigPct: { fontSize: 12, color: colors.bannerGreenText },

  pairRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  pairCard: {
    flex: 1,
    backgroundColor: colors.lightGreen,
    borderRadius: 16,
    padding: 16,
  },
  pairLabel: { fontSize: 12, color: colors.textLight },
  pairValue: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 6 },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 26, marginBottom: 16 },

  breakRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  breakIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakInfo: { flex: 1 },
  breakTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakName: { fontSize: 14, fontWeight: '700', color: colors.text },
  breakAmount: { fontSize: 14, fontWeight: '700', color: colors.text },
  breakPct: { fontSize: 11, color: colors.textLight, marginTop: 6 },
});
