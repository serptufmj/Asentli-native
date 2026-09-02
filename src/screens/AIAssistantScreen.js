// src/screens/AIAssistantScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';

const bars = [
  { label: 'Mon', value: '$12', height: 45, solid: false },
  { label: 'Tue', value: '$18', height: 65, solid: false },
  { label: 'Hoy', value: '$25', height: 95, solid: true },
  { label: 'Thu', value: '$15', height: 55, solid: false, dashed: true },
  { label: 'Fri', value: '$20', height: 75, solid: false, dashed: true },
];

export default function AIAssistantScreen({ onBack, onNavigate }) {
  const [message, setMessage] = useState('');
  const go = (key) => onNavigate && onNavigate(key);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Asentli IA" onBack={onBack} onBell={() => go('notifications')} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Greeting bubble */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>How can I help you?</Text>
          <Text style={styles.greetingText}>
            Analizaré tus gastos de la Canasta Básica para ayudarte a ahorrar
            hoy.
          </Text>
        </View>

        {/* Prediction box */}
        <View style={styles.predictionBox}>
          <View style={styles.predictionHeaderRow}>
            <View style={styles.predictionTitleRow}>
              <Text style={styles.predictionIcon}>📊</Text>
              <Text style={styles.predictionTitle}>
                Predicción de Gastos{'\n'}Semanales
              </Text>
            </View>
            <Text style={styles.iaActiveTag}>IA{'\n'}Activa</Text>
          </View>

          <View style={styles.chartRow}>
            {bars.map((b) => (
              <View key={b.label} style={styles.barColumn}>
                <Text style={[
                    styles.barValue,
                    b.solid && { color: colors.primary },]}>
                  {b.value}
                </Text>
                <View
                  style={[
                    styles.bar,
                    { height: b.height },
                    b.solid
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.mintBar },
                    b.dashed && styles.barDashed,
                  ]}
                />
                <Text
                  style={[
                    styles.barLabel,
                    b.label === 'Hoy' && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {b.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.suggestionText}>
            <Text style={styles.suggestionBold}>Sugerencia de IA: </Text>
            Basado en tus compras de frijoles y maíz del mes pasado, podrías
            ahorrar un <Text style={styles.suggestionBold}>15%</Text> si
            compras en el supermercado este viernes.
          </Text>
        </View>

        {/* Chat message from AI */}
        <View style={styles.chatRow}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarIcon}>🤖</Text>
          </View>
          <View style={styles.chatBubble}>
            <Text style={styles.chatText}>
              ¡Hola! He revisado tu canasta básica. El precio del aceite ha
              subido en el supermercado local, pero bajó en la despensa
              vecina. ¿Quieres ver la comparación?
            </Text>
          </View>
        </View>

        {/* Quick suggestions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickButton} onPress={() => go('priceComparer')}>
            <Text style={styles.quickText}>↘ Ver la comparación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton}>
            <Text style={styles.quickText}>🧾 Subir ticket</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="..."
            placeholderTextColor={colors.textLight}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Asentli AI puede cometer errores. Verifica información importante.
        </Text>
      </ScrollView>

      <BottomNav active="Basket" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },

  content: { paddingHorizontal: 20, paddingBottom: 20 },

  greetingCard: {
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  greetingText: { fontSize: 14, color: colors.text, lineHeight: 20 },

  predictionBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  predictionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  predictionTitleRow: { flexDirection: 'row', flex: 1, gap: 8 },
  predictionIcon: { fontSize: 18 },
  predictionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, flex: 1 },
  iaActiveTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },

  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
  },
  barColumn: { alignItems: 'center' },
  barValue: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 6 },
  bar: { width: 26, borderRadius: 6 },
  barDashed: { borderWidth: 1, borderColor: colors.saladGreen, borderStyle: 'dashed' },
  barLabel: { fontSize: 11, color: colors.textLight, marginTop: 6 },

  suggestionText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  suggestionBold: { fontWeight: '800', color: colors.bottleGreen },

  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarIcon: { fontSize: 16 },
  chatBubble: {
    flex: 1,
    backgroundColor: colors.chatBubble,
    borderRadius: 16,
    padding: 14,
  },
  chatText: { fontSize: 14, color: colors.text, lineHeight: 20 },

  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quickButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickText: { fontSize: 12, color: colors.text, fontWeight: '600' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 14, color: colors.text },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: colors.card, fontSize: 18 },

  disclaimer: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
});