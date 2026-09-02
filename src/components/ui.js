import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/* Rounded search field, used on list-style screens. */
export function SearchBar({ placeholder = 'Search...', value, onChangeText, right }) {
  return (
    <View style={styles.searchWrap}>
      <Ionicons name="search" size={18} color={colors.textLight} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
      />
      {right ? <View style={styles.searchRight}>{right}</View> : null}
    </View>
  );
}

/* Horizontal category pills. `options` = array of strings. */
export function Chips({ options, value, onChange, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chipsRow, style]}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange && onChange(opt)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/* Thin rounded progress bar. `progress` = 0..1. */
export function ProgressBar({ progress = 0, color = colors.saladGreen, track = colors.progressTrack, height = 8 }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { backgroundColor: track, height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${pct * 100}%`,
          height,
          borderRadius: height / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/* "Title ............ Action" row above card lists. */
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* Full-width pill button. `variant` = 'orange' | 'green' | 'dark'. */
export function PillButton({ label, onPress, variant = 'orange', icon, style }) {
  const bg =
    variant === 'green'
      ? colors.saladGreen
      : variant === 'dark'
      ? colors.bottleGreen
      : colors.primary;
  return (
    <TouchableOpacity style={[styles.pillButton, { backgroundColor: bg }, style]} onPress={onPress}>
      {icon ? <Ionicons name={icon} size={16} color={colors.card} style={{ marginRight: 8 }} /> : null}
      <Text style={styles.pillButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Rounded placeholder thumbnail with a glyph. Avoids the JPG-transparency issues. */
export function Thumb({ icon = 'image', bg = colors.lightGreen, color = colors.bottleGreen, size = 44, radius = 12 }) {
  return (
    <View style={[styles.thumb, { width: size, height: size, borderRadius: radius, backgroundColor: bg }]}>
      <Ionicons name={icon} size={Math.round(size * 0.5)} color={color} />
    </View>
  );
}

/* "View more  ›" footer link used at the end of several lists. */
export function ViewMore({ onPress, label = 'View more' }) {
  return (
    <TouchableOpacity style={styles.viewMore} onPress={onPress}>
      <Text style={styles.viewMoreText}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  searchRight: { marginLeft: 4 },

  chipsRow: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.chipBg,
  },
  chipActive: { backgroundColor: colors.chipActiveBg },
  chipText: { fontSize: 13, color: colors.chipText, fontWeight: '600' },
  chipTextActive: { color: colors.chipActiveText },

  track: { width: '100%', overflow: 'hidden' },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  sectionAction: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  pillButton: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButtonText: { color: colors.card, fontSize: 15, fontWeight: '700' },

  thumb: { alignItems: 'center', justifyContent: 'center' },

  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  viewMoreText: { fontSize: 13, color: colors.primary, fontWeight: '700' },
});
