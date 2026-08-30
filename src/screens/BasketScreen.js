import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { SearchBar, Chips, ProgressBar, Thumb } from '../components/ui';

const CATEGORIES = ['All', 'Vegetables', 'Dairy', 'Grains', 'Meat'];

const SECTIONS = [
  {
    category: 'Vegetables',
    items: [
      { id: 'v1', name: 'Tomato', unit: 'Pound - Súper Selectos', price: '$0.75', icon: 'nutrition' },
      { id: 'v2', name: 'Onion', unit: 'Pound - Súper Selectos', price: '$0.60', icon: 'nutrition' },
      { id: 'v3', name: 'Green pepper', unit: 'Pound - La Despensa', price: '$0.90', icon: 'nutrition' },
    ],
  },
  {
    category: 'Dairy',
    items: [
      { id: 'd1', name: 'Milk 1L', unit: 'Unit - Súper Selectos', price: '$1.10', icon: 'cafe' },
      { id: 'd2', name: 'Fresh cheese', unit: 'Pound - La Despensa', price: '$2.40', icon: 'fast-food' },
    ],
  },
];

const COMPARATOR = [
  { store: 'Súper Selectos', total: '$24.85', best: true },
  { store: 'La Despensa Familiar', total: '$27.30', best: false },
];

export default function BasketScreen({ onBack, onNavigate, onBell, onOpenStore, onOpenComparator, onOpenBudget }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [added, setAdded] = useState({ v1: true, d1: true });

  const toggle = (id) => setAdded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={styles.flex}>
      <ScreenHeader
        title="Shopping List"
        onBack={onBack}
        right={
          <TouchableOpacity onPress={onOpenStore} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View>
              <Ionicons name="cart-outline" size={24} color={colors.bottleGreen} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar placeholder="Search products..." value={query} onChangeText={setQuery} />
        <Chips options={CATEGORIES} value={category} onChange={setCategory} style={{ marginTop: 14 }} />

        {SECTIONS.map((section) => (
          <View key={section.category} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            {section.items.map((item) => {
              const isAdded = !!added[item.id];
              return (
                <View key={item.id} style={styles.productRow}>
                  <Thumb icon={item.icon} bg={colors.lightGreen} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productUnit}>{item.unit}</Text>
                  </View>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <TouchableOpacity
                    style={[styles.addBtn, isAdded && styles.addBtnDone]}
                    onPress={() => toggle(item.id)}
                  >
                    <Ionicons
                      name={isAdded ? 'checkmark' : 'add'}
                      size={18}
                      color={isAdded ? colors.card : colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}

        {/* Price comparator */}
        <TouchableOpacity activeOpacity={0.9} style={styles.comparatorCard} onPress={onOpenComparator}>
          <View style={styles.comparatorHeader}>
            <Text style={styles.comparatorTitle}>Price comparator</Text>
            <Ionicons name="swap-horizontal" size={18} color={colors.card} />
          </View>
          <Text style={styles.comparatorSub}>Your basket across 2 stores</Text>
          {COMPARATOR.map((c) => (
            <View key={c.store} style={styles.comparatorRow}>
              <Text style={styles.comparatorStore}>{c.store}</Text>
              <View style={styles.comparatorRight}>
                {c.best && (
                  <View style={styles.bestBadge}>
                    <Text style={styles.bestBadgeText}>Best price</Text>
                  </View>
                )}
                <Text style={styles.comparatorTotal}>{c.total}</Text>
              </View>
            </View>
          ))}
        </TouchableOpacity>

        {/* Weekly goal */}
        <TouchableOpacity activeOpacity={0.9} style={styles.goalCard} onPress={onOpenBudget}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Weekly goal</Text>
            <Text style={styles.goalAmount}>$24.85 / $40.00</Text>
          </View>
          <ProgressBar progress={0.62} color={colors.bottleGreen} track="#FFFFFF55" />
          <Text style={styles.goalHint}>You have $15.15 left in this week's grocery budget.</Text>
        </TouchableOpacity>
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

  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },

  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: colors.text },
  productUnit: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  productPrice: { fontSize: 14, fontWeight: '700', color: colors.text, marginRight: 12 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: colors.saladGreen, borderColor: colors.saladGreen },

  comparatorCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 20,
    padding: 18,
    marginTop: 26,
  },
  comparatorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  comparatorTitle: { fontSize: 15, fontWeight: '800', color: colors.card },
  comparatorSub: { fontSize: 12, color: '#9FB7AC', marginTop: 4, marginBottom: 14 },
  comparatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1C4436',
  },
  comparatorStore: { fontSize: 13, color: colors.card },
  comparatorRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  comparatorTotal: { fontSize: 14, fontWeight: '800', color: colors.card },
  bestBadge: {
    backgroundColor: colors.saladGreen,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bestBadgeText: { fontSize: 10, fontWeight: '800', color: colors.bottleGreen },

  goalCard: {
    backgroundColor: colors.bannerGreen,
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: { fontSize: 15, fontWeight: '800', color: colors.card },
  goalAmount: { fontSize: 13, fontWeight: '700', color: colors.bannerGreenText },
  goalHint: { fontSize: 12, color: colors.bannerGreenText, marginTop: 12 },
});
