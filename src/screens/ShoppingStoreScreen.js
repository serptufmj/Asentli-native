import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { SearchBar, ViewMore, Thumb } from '../components/ui';

const CATEGORIES = [
  { key: 'All', icon: 'grid' },
  { key: 'Grains', icon: 'leaf' },
  { key: 'Dairy', icon: 'cafe' },
  { key: 'Meat', icon: 'restaurant' },
  { key: 'Beverages', icon: 'wine' },
];

const PRODUCTS = [
  { id: 'p1', name: 'Red beans', price: '$1.20', unit: 'Pound', icon: 'nutrition' },
  { id: 'p2', name: 'White rice', price: '$0.95', unit: 'Pound', icon: 'nutrition' },
  { id: 'p3', name: 'Milk 1L', price: '$1.10', unit: 'Unit', icon: 'cafe' },
  { id: 'p4', name: 'Eggs (15)', price: '$2.30', unit: 'Carton', icon: 'ellipse' },
  { id: 'p5', name: 'Chicken breast', price: '$2.75', unit: 'Pound', icon: 'restaurant' },
  { id: 'p6', name: 'Corn flour', price: '$0.85', unit: 'Pound', icon: 'nutrition' },
];

export default function ShoppingStoreScreen({ onBack, onNavigate, onBell, onViewMore }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Shopping Store" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          right={
            <View>
              <Ionicons name="cart" size={20} color={colors.bottleGreen} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </View>
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <TouchableOpacity key={c.key} style={styles.catItem} onPress={() => setCategory(c.key)}>
                <View style={[styles.catCircle, active && styles.catCircleActive]}>
                  <Ionicons name={c.icon} size={20} color={active ? colors.card : colors.bottleGreen} />
                </View>
                <Text style={[styles.catLabel, active && styles.catLabelActive]}>{c.key}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recommended Products</Text>
        <View style={styles.grid}>
          {PRODUCTS.map((p) => (
            <View key={p.id} style={styles.gridCard}>
              <Thumb icon={p.icon} bg={colors.lightGreen} size={56} radius={14} />
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productUnit}>{p.unit}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>{p.price}</Text>
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <ViewMore onPress={onViewMore} />
      </ScrollView>

      <BottomNav active="Basket" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: colors.card, fontSize: 10, fontWeight: '800' },

  catRow: { gap: 16, paddingVertical: 16 },
  catItem: { alignItems: 'center', width: 62 },
  catCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catCircleActive: { backgroundColor: colors.bottleGreen },
  catLabel: { fontSize: 11, color: colors.textLight },
  catLabelActive: { color: colors.text, fontWeight: '700' },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 6, marginBottom: 14 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  productName: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 10 },
  productUnit: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  productPrice: { fontSize: 14, fontWeight: '800', color: colors.text },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addBtnText: { color: colors.card, fontSize: 12, fontWeight: '800' },
});
