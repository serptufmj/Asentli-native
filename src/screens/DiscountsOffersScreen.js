import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { ViewMore, Thumb } from '../components/ui';

const COUPONS = [
  {
    id: 'c1',
    store: 'Súper Selectos',
    icon: 'storefront',
    coupon: '$3 off en compras de canasta básica mayores a $30',
    valid: 'Valid until Sep 6',
  },
  {
    id: 'c2',
    store: 'La Despensa Familiar',
    icon: 'storefront',
    coupon: '10% en lácteos los fines de semana',
    valid: 'Valid until Sep 1',
  },
  {
    id: 'c3',
    store: 'Carnicería El Novillo',
    icon: 'restaurant',
    coupon: '1 libra de pollo gratis por cada $20 de compra',
    valid: 'Valid until Aug 31',
  },
  {
    id: 'c4',
    store: 'Farmacia San Nicolás',
    icon: 'medkit',
    coupon: '20% en vitaminas y suplementos familiares',
    valid: 'Valid until Sep 15',
  },
];

export default function DiscountsOffersScreen({ onBack, onNavigate, onBell, onUseCoupon, onViewMore }) {
  return (
    <View style={styles.flex}>
      <ScreenHeader title="Discounts & Offers" onBack={onBack} onBell={onBell} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="bag-handle" size={30} color={colors.card} />
            <View style={styles.heroTag}>
              <Ionicons name="pricetag" size={14} color={colors.bannerGreen} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Save More with Asentli</Text>
          <Text style={styles.heroText}>
            Exclusive coupons from affiliated stores across El Salvador, updated every week for your
            family basket.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Coupons</Text>
        {COUPONS.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Thumb icon={c.icon} bg={colors.lightGreen} size={38} radius={10} />
              <Text style={styles.store}>{c.store}</Text>
            </View>
            <Text style={styles.coupon}>{c.coupon}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.valid}>{c.valid}</Text>
              <TouchableOpacity style={styles.useBtn} onPress={() => onUseCoupon && onUseCoupon(c)}>
                <Text style={styles.useBtnText}>Use</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <ViewMore onPress={onViewMore} />
      </ScrollView>

      <BottomNav active="Home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  hero: {
    backgroundColor: colors.bannerGreen,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFFFF2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTag: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: colors.card },
  heroText: {
    fontSize: 13,
    color: colors.bannerGreenText,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },

  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 14 },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  store: { fontSize: 14, fontWeight: '800', color: colors.bottleGreen },
  coupon: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 20 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  valid: { fontSize: 12, color: colors.textLight },
  useBtn: {
    backgroundColor: colors.bottleGreen,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  useBtnText: { color: colors.card, fontSize: 13, fontWeight: '800' },
});
