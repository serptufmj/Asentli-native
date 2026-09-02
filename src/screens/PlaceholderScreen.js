import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';

export default function PlaceholderScreen({ title, onBack, onNavigate, activeTab }) {
  return (
    <View style={styles.flex}>
      <ScreenHeader title={title} onBack={onBack} />

      <View style={styles.content}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.message}>Esta pantalla está en construcción</Text>
      </View>

      <BottomNav active={activeTab} onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  message: { fontSize: 14, color: colors.textLight },
});
