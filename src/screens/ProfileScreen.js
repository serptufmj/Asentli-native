import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import { Thumb } from '../components/ui';

const ACCOUNT = [
  { key: 'account', icon: 'person-outline', label: 'Account details' },
  { key: 'family', icon: 'people-outline', label: 'Family members' },
  { key: 'billing', icon: 'card-outline', label: 'Payment methods' },
];

const SUPPORT = [
  { key: 'password', icon: 'lock-closed-outline', label: 'Password' },
  { key: 'settings', icon: 'settings-outline', label: 'Settings' },
  { key: 'help', icon: 'help-circle-outline', label: 'Help & support' },
];

function MenuRow({ item, onPress, last }) {
  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={item.icon} size={20} color={colors.bottleGreen} />
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ onBack, onNavigate, onLogout }) {
  const [faceId, setFaceId] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const { signOut } = useAuth();
  const { user } = useUser();

  const displayName = user?.fullName || user?.username || 'Tu familia';
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '';

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      onLogout?.(); // auth gate returns to Welcome on its own
    } catch (e) {
      setSigningOut(false);
      Alert.alert('Error', 'No se pudo cerrar la sesión. Intentá de nuevo.');
    }
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Profile" onBack={onBack} onBell={() => onNavigate && onNavigate('notifications')} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Identity card */}
        <View style={styles.profileCard}>
          <Thumb icon="person" bg={colors.card} color={colors.bottleGreen} size={60} radius={30} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{displayName}</Text>
            {!!displayEmail && <Text style={styles.email}>{displayEmail}</Text>}
          </View>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={20} color={colors.bottleGreen} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {ACCOUNT.map((item, i) => (
            <MenuRow key={item.key} item={item} last={i === ACCOUNT.length - 1} />
          ))}
        </View>

        {/* Security & support */}
        <Text style={styles.sectionTitle}>Security & support</Text>
        <View style={styles.menuCard}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Ionicons name="scan-outline" size={20} color={colors.bottleGreen} />
              <Text style={styles.rowLabel}>Face ID</Text>
            </View>
            <Switch
              value={faceId}
              onValueChange={setFaceId}
              trackColor={{ false: colors.border, true: colors.saladGreen }}
              thumbColor={colors.card}
            />
          </View>
          {SUPPORT.map((item, i) => (
            <MenuRow key={item.key} item={item} last={i === SUPPORT.length - 1} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, signingOut && { opacity: 0.6 }]}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.card} style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>{signingOut ? 'Cerrando sesión…' : 'Sign out'}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Asentli v1.0.0</Text>
      </ScrollView>

      <BottomNav active="Profile" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 30 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  profileInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  email: { fontSize: 12, color: colors.textLight, marginTop: 3 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  menuCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: colors.text },

  signOutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { color: colors.card, fontSize: 15, fontWeight: '700' },

  version: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: 16 },
});
