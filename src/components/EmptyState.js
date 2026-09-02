import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/** Neutral placeholder for "no data yet" states. */
export default function EmptyState({
  icon = 'receipt-outline',
  title = 'Aún no tienes gastos registrados',
  subtitle,
  compact,
}) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={compact ? 20 : 26} color={colors.textLight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32, gap: 8 },
  compact: { paddingVertical: 18 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 17,
  },
});
