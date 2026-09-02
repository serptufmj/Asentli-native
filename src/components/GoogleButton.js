import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';

/** Shared "Continuar con Google" button used on the sign-in and sign-up screens. */
export default function GoogleButton({ onPress, loading, label = 'Continuar con Google' }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <View style={styles.inner}>
          <Text style={styles.g}>G</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  g: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4285F4',
    width: 20,
    textAlign: 'center',
  },
  label: { fontSize: 14, fontWeight: '700', color: colors.text },
});
