import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';

const GROUPS = [
  {
    title: 'Today',
    messages: [
      {
        id: 'n1',
        text: 'Aceite de cocina bajó $0.40 en La Despensa Familiar. Podrías cambiar esta compra a esa tienda.',
        time: '9:12 AM',
      },
      {
        id: 'n2',
        text: 'Vas $15.15 por debajo de tu meta semanal de canasta. ¡Buen ritmo!',
        time: '8:03 AM',
      },
    ],
  },
  {
    title: 'Account details',
    messages: [
      {
        id: 'n3',
        text: 'Recarga de $150.00 acreditada a tu Family Wallet.',
        time: 'Yesterday',
      },
      {
        id: 'n4',
        text: 'Ganaste $2.15 de cashback en tu compra de Súper Selectos.',
        time: 'Yesterday',
      },
    ],
  },
  {
    title: 'Last week',
    messages: [
      {
        id: 'n5',
        text: 'Nuevo comercio afiliado cerca de ti: Farmacia San Nicolás con 3% de cashback.',
        time: 'Mon',
      },
    ],
  },
];

export default function NotificationsScreen({ onBack, onNavigate }) {
  return (
    <View style={styles.flex}>
      <ScreenHeader title="Notification" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        {GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.messages.map((m) => (
              <View key={m.id} style={styles.bubbleRow}>
                <View style={styles.avatar}>
                  <Ionicons name="sparkles" size={14} color={colors.primary} />
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                  <Text style={styles.bubbleTime}>{m.time}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <BottomNav active="Home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  group: { marginBottom: 22 },
  groupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  bubbleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.notifBubble,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
  },
  bubbleText: { fontSize: 13, color: colors.text, lineHeight: 19 },
  bubbleTime: { fontSize: 11, color: colors.textLight, marginTop: 8 },
});
