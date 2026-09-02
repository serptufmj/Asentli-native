import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { SearchBar, Thumb } from '../components/ui';

const BUSINESSES = [
  { id: 'b1', name: 'Súper Selectos', category: 'Supermercado', icon: 'storefront', cashback: '5%' },
  { id: 'b2', name: 'La Despensa Familiar', category: 'Supermercado', icon: 'storefront', cashback: '4%' },
  { id: 'b3', name: 'Farmacia San Nicolás', category: 'Farmacia', icon: 'medkit', cashback: '3%' },
  { id: 'b4', name: 'Panadería La Espiga', category: 'Panadería', icon: 'pizza', cashback: '2%' },
  { id: 'b5', name: 'Carnicería El Novillo', category: 'Carnicería', icon: 'restaurant', cashback: '3%' },
];

export default function AffiliatedBusinessesScreen({ onBack, onNavigate, onBell, onOpenBusiness }) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState('List');

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Affiliated businesses" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar placeholder="Buscar comercio" value={query} onChangeText={setQuery} />

        <View style={styles.toggle}>
          {['List', 'Map'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.toggleBtn, view === opt && styles.toggleBtnActive]}
              onPress={() => setView(opt)}
            >
              <Ionicons
                name={opt === 'List' ? 'list' : 'map'}
                size={16}
                color={view === opt ? colors.card : colors.chipText}
              />
              <Text style={[styles.toggleText, view === opt && styles.toggleTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {view === 'Map' ? (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={40} color={colors.textLight} />
            <Text style={styles.mapText}>Map view coming soon</Text>
          </View>
        ) : (
          BUSINESSES.map((b) => (
            <TouchableOpacity
              key={b.id}
              activeOpacity={0.8}
              style={styles.row}
              onPress={() => onOpenBusiness && onOpenBusiness(b)}
            >
              <Thumb icon={b.icon} bg={colors.lightGreen} />
              <View style={styles.info}>
                <Text style={styles.name}>{b.name}</Text>
                <Text style={styles.category}>{b.category}</Text>
              </View>
              <View style={styles.cashbackTag}>
                <Text style={styles.cashbackText}>{b.cashback}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNav active="Home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.chipBg,
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
    marginBottom: 18,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleBtnActive: { backgroundColor: colors.bottleGreen },
  toggleText: { fontSize: 13, fontWeight: '700', color: colors.chipText },
  toggleTextActive: { color: colors.card },

  mapPlaceholder: {
    height: 220,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  mapText: { fontSize: 13, color: colors.textLight },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  category: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  cashbackTag: {
    backgroundColor: colors.lightGreen,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cashbackText: { fontSize: 11, fontWeight: '800', color: colors.bottleGreen },
});
