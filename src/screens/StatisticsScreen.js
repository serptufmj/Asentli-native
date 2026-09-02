import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { G, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { Chips } from '../components/ui';
import EmptyState from '../components/EmptyState';
import { usePeriodExpenses } from '../hooks/useExpenseData';
import { sumAmount, donutData, comparisonText, periodWordFor } from '../lib/expenseMath';
import { formatMoney } from '../lib/dates';

const PERIODS = ['Weekly', 'Monthly', 'Yearly'];
const PERIOD_LABEL = { Weekly: 'This week', Monthly: 'This month', Yearly: 'This year' };

function DonutChart({ data, total, size = 170, strokeWidth = 26 }) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  let acc = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          {total > 0 ? (
            data.map((d) => {
              const dash = (d.value / total) * circ;
              const seg = (
                <Circle
                  key={d.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={-acc}
                  strokeLinecap="butt"
                />
              );
              acc += dash;
              return seg;
            })
          ) : (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors.progressTrack}
              strokeWidth={strokeWidth}
            />
          )}
        </G>
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutCenterValue}>{formatMoney(total)}</Text>
        <Text style={styles.donutCenterLabel}>spent</Text>
      </View>
    </View>
  );
}

export default function StatisticsScreen({ onBack, onNavigate, onBell, onOpenHistory, onOpenRewards }) {
  const [period, setPeriod] = useState('Monthly');
  const { current, previous } = usePeriodExpenses(period);

  const loading = current.isLoading;
  const expenses = current.data ?? [];
  const total = sumAmount(expenses);
  const prevTotal = sumAmount(previous.data ?? []);
  const donut = donutData(expenses);
  const insight = comparisonText(total, prevTotal, periodWordFor(period));

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Consumption Insights" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        <Chips options={PERIODS} value={period} onChange={setPeriod} />

        <Text style={styles.periodLabel}>{PERIOD_LABEL[period]}</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20, alignSelf: 'flex-start' }} />
        ) : (
          <>
            <Text style={styles.totalSpent}>{formatMoney(total)}</Text>
            <Text style={styles.totalCaption}>Total spent</Text>

            <View style={styles.chartCard}>
              <DonutChart data={donut} total={total} />
              <View style={styles.legend}>
                {donut.map((c) => (
                  <View key={c.key} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                    <Text style={styles.legendKey}>{c.label}</Text>
                    <Text style={styles.legendPct}>{Math.round(c.pct * 100)}%</Text>
                  </View>
                ))}
              </View>
            </View>

            {total === 0 && (
              <EmptyState
                compact
                title="Aún no tienes gastos registrados"
                subtitle="Agregá un gasto con el botón + en Home para ver tus estadísticas."
              />
            )}

            {/* Spending Insight */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="trending-down" size={18} color={colors.cardPinkText} />
                <Text style={styles.insightTitle}>Spending Insight</Text>
              </View>
              <Text style={styles.insightText}>{insight}</Text>
              <Text style={styles.insightLink} onPress={onOpenHistory}>
                View purchase history →
              </Text>
            </View>

            {/* Asentli Tip */}
            <View style={styles.tipCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="bulb" size={18} color={colors.bottleGreen} />
                <Text style={styles.tipTitle}>Asentli Tip</Text>
              </View>
              <Text style={styles.tipText}>
                Registrá cada gasto apenas lo hacés — así la dona y el presupuesto se mantienen al día.
              </Text>
              <Text style={styles.tipLink} onPress={onOpenRewards}>
                See your cashback →
              </Text>
            </View>
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

  periodLabel: { fontSize: 13, color: colors.textLight, marginTop: 18 },
  totalSpent: { fontSize: 32, fontWeight: '800', color: colors.text, marginTop: 4 },
  totalCaption: { fontSize: 12, color: colors.textLight, marginTop: 2 },

  chartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  donutCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterValue: { fontSize: 15, fontWeight: '800', color: colors.text },
  donutCenterLabel: { fontSize: 11, color: colors.textLight },

  legend: { flex: 1, marginLeft: 20, gap: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendKey: { flex: 1, fontSize: 13, color: colors.text },
  legendPct: { fontSize: 13, fontWeight: '800', color: colors.text },

  insightCard: {
    backgroundColor: colors.cardPink,
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightTitle: { fontSize: 15, fontWeight: '800', color: colors.cardPinkText },
  insightText: { fontSize: 13, color: colors.cardPinkText, lineHeight: 19 },
  insightLink: { fontSize: 13, fontWeight: '800', color: colors.cardPinkText, marginTop: 10 },

  tipCard: {
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    padding: 18,
    marginTop: 14,
  },
  tipTitle: { fontSize: 15, fontWeight: '800', color: colors.bottleGreen },
  tipText: { fontSize: 13, color: colors.text, lineHeight: 19 },
  tipLink: { fontSize: 13, fontWeight: '800', color: colors.bottleGreen, marginTop: 10 },
});
