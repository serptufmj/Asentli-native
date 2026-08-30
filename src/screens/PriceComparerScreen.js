import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { SearchBar, Thumb } from '../components/ui';

const PRODUCT = { name: 'Aceite vegetal 900ml', unit: 'Botella', icon: 'water' };

const STORES = [
  { id: 's1', name: 'La Despensa Familiar', price: '$2.35', best: true },
  { id: 's2', name: 'Súper Selectos', price: '$2.60', best: false },
  { id: 's3', name: 'Farmacia San Nicolás', price: '$2.80', best: false },
];

export default function PriceComparerScreen({ onBack, onNavigate, onBell, onOpenStore }) {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Price comparer" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar placeholder="Search a product..." value={query} onChangeText={setQuery} />

        <View style={styles.productCard}>
          <Thumb icon={PRODUCT.icon} bg={colors.lightGreen} size={56} radius={14} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{PRODUCT.name}</Text>
            <Text style={styles.productUnit}>{PRODUCT.unit}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Stores by price</Text>
        {STORES.map((s) => (
          <View key={s.id} style={[styles.storeRow, s.best && styles.storeRowBest]}>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{s.name}</Text>
              {s.best && (
                <View style={styles.bestBadge}>
                  <Text style={styles.bestBadgeText}>Best price</Text>
                </View>
              )}
            </View>
            <Text style={[styles.storePrice, s.best && { color: colors.bottleGreen }]}>{s.price}</Text>
          </View>
        ))}

        <View style={styles.recCard}>
          <View style={styles.recHeader}>
            <Ionicons name="hardware-chip" size={18} color={colors.cardPinkText} />
            <Text style={styles.recTitle}>Recommendation Asentli</Text>
          </View>
          <Text style={styles.recText}>
            Buying this at La Despensa Familiar saves you $0.25 per bottle. Over a month that's about
            $1.00 for your family.
          </Text>
          <Text style={styles.recLink} onPress={onOpenStore}>
            Open store →
          </Text>
        </View>
      </ScrollView>

      <BottomNav active="Basket" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '800', color: colors.text },
  productUnit: { fontSize: 12, color: colors.textLight, marginTop: 2 },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 14 },

  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  storeRowBest: { borderColor: colors.saladGreen, backgroundColor: colors.lightGreen },
  storeInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  storeName: { fontSize: 14, fontWeight: '700', color: colors.text },
  bestBadge: {
    backgroundColor: colors.saladGreen,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bestBadgeText: { fontSize: 10, fontWeight: '800', color: colors.bottleGreen },
  storePrice: { fontSize: 16, fontWeight: '800', color: colors.text },

  recCard: {
    backgroundColor: colors.cardPink,
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
  },
  recHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  recTitle: { fontSize: 15, fontWeight: '800', color: colors.cardPinkText },
  recText: { fontSize: 13, color: colors.cardPinkText, lineHeight: 19 },
  recLink: { fontSize: 13, fontWeight: '800', color: colors.cardPinkText, marginTop: 10 },
});
