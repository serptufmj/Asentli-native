import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { Chips, Thumb } from '../components/ui';

const CATEGORIES = ['All', 'Food', 'Beverages', 'Cleaning'];

const OFFERS = [
  {
    id: 'o1',
    store: 'Súper Selectos',
    icon: 'storefront',
    offer: '2x1 en frijoles de seda seleccionados',
    valid: 'Valid until Sep 5',
    category: 'Food',
  },
  {
    id: 'o2',
    store: 'La Despensa Familiar',
    icon: 'storefront',
    offer: '$0.50 de descuento en leche entera 1L',
    valid: 'Valid until Sep 2',
    category: 'Beverages',
  },
  {
    id: 'o3',
    store: 'Farmacia San Nicolás',
    icon: 'medkit',
    offer: '15% en productos de limpieza del hogar',
    valid: 'Valid until Sep 10',
    category: 'Cleaning',
  },
  {
    id: 'o4',
    store: 'Panadería La Espiga',
    icon: 'pizza',
    offer: 'Pan francés gratis en compras mayores a $5',
    valid: 'Valid until Aug 31',
    category: 'Food',
  },
];

export default function AvailableOffersScreen({ onBack, onNavigate, onBell, onOpenOffer }) {
  const [category, setCategory] = useState('All');
  const visible = category === 'All' ? OFFERS : OFFERS.filter((o) => o.category === category);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Available Offers" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        <Chips options={CATEGORIES} value={category} onChange={setCategory} />

        {visible.map((o) => (
          <TouchableOpacity
            key={o.id}
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => onOpenOffer && onOpenOffer(o)}
          >
            <View style={styles.cardHeader}>
              <Thumb icon={o.icon} bg={colors.lightGreen} size={38} radius={10} />
              <Text style={styles.store}>{o.store}</Text>
            </View>
            <Text style={styles.offer}>{o.offer}</Text>
            <Text style={styles.valid}>{o.valid}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav active="Home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  card: {
    backgroundColor: colors.lightGreen,
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  store: { fontSize: 14, fontWeight: '800', color: colors.bottleGreen },
  offer: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 20 },
  valid: { fontSize: 12, color: colors.textLight, marginTop: 8 },
});
