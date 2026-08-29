import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const weeks = [
    { label: 'Week 1', height: 40, color: colors.saladGreen },
    { label: 'Week 2', height: 70, color: colors.bottleGreen },
    { label: 'Week 3', height: 100, color: colors.primary },
    { label: 'Week 4', height: 55, color: '#F5C9A8' },
];

const tabs = [
    { key: 'Home', icon: 'home' },
    { key: 'Statistics', icon: 'bar-chart' },
    { key: 'Basket', icon: 'cart' },
    { key: 'Profile', icon: 'person' },
];

export default function HomeScreen({ onMyCardPress, onAIAssistantPress, onBellPress, onStatisticsPress, onBasketPress, onProfilePress, }) {
    const [activeTab, setActiveTab] = useState('Home');

    return (
        <View style={styles.flex}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Asentli</Text>
                <TouchableOpacity onPress={onBellPress}>
                    <Image
                        source={require('../../assets/bell-icon.jpg')}
                        style={styles.bellIconImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content}>
                {/* Budget card */}
                <View style={styles.budgetCard}>
                    <View style={styles.budgetHeaderRow}>
                        <Text style={styles.budgetTitle}>Household budget</Text>
                        <Text style={styles.budgetAmount}>$142.50</Text>
                    </View>
                    <Text style={styles.budgetSubtitle}>
                        Your spending this month of $200.00
                    </Text>

                    <View style={styles.chartRow}>
                        {weeks.map((w) => (
                            <View key={w.label} style={styles.barColumn}>
                                <View
                                    style={[
                                        styles.bar,
                                        { height: w.height, backgroundColor: w.color },
                                    ]}
                                />
                                <Text style={styles.barLabel}>{w.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.aiButton]} onPress={onAIAssistantPress}>
                        <Image
                            source={require('../../assets/IA-icon.jpg')}
                            style={styles.actionIconImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.actionText}>AI Assistant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.cardButton]}
                        onPress={onMyCardPress}>
                        <Image
                            source={require('../../assets/card-icon.jpg')}
                            style={styles.actionIconImage}
                            resizeMode="contain"
                        />
                        <Text style={[styles.actionText, { color: colors.card }]}>
                            My Card
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Affiliated stores */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Affiliated Stores</Text>
                    <Text style={styles.seeAll}>See All</Text>
                </View>

                <View style={styles.storeCard}>
                    <View style={styles.storeLogo}>
                        <Image
                            source={require('../../assets/basket-icon.jpg')}
                            style={styles.storeLogoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.storeInfo}>
                        <Text style={styles.storeName}>Súper Selectos</Text>
                        <Text style={styles.storeDetail}>5% Cashback en Canasta</Text>
                        <Text style={styles.storeDistance}>📍 A 500m from you</Text>
                    </View>
                </View>

                {/* Offer banner */}
                <View style={styles.offerCard}>
                    <Text style={styles.offerLabel}>OFERTA DEL DÍA</Text>
                    <Text style={styles.offerText}>
                        Ahorra $5 en tu próxima compra de lácteos
                    </Text>
                    <Text style={styles.offerLink}>Válido en tiendas afiliadas</Text>
                </View>
            </ScrollView>

            {/* Bottom nav */}
            <View style={styles.bottomNav}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tabButton}
                        onPress={() => {
                            setActiveTab(tab.key);
                            if (tab.key === 'Statistics') onStatisticsPress();
                            if (tab.key === 'Basket') onBasketPress();
                            if (tab.key === 'Profile') onProfilePress();
                        }}
                    >
                        <Ionicons
                            name={tab.icon}
                            size={22}
                            color={activeTab === tab.key ? colors.card : '#8FA89C'}
                        />
                        <Text
                            style={[
                                styles.tabLabel,
                                activeTab === tab.key && styles.tabLabelActive,
                            ]}
                        >
                            {tab.key}
                        </Text>
                        {activeTab === tab.key && <View style={styles.tabDot} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.card },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.bottleGreen,
    },
    bellIconImage: { width: 22, height: 22 },
    content: { padding: 20, paddingBottom: 20 },

    budgetCard: {
        backgroundColor: colors.lightGreen,
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
    },
    budgetHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    budgetTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
    budgetAmount: { fontSize: 15, fontWeight: '700', color: colors.primary },
    budgetSubtitle: {
        fontSize: 12,
        color: colors.textLight,
        marginTop: 4,
        marginBottom: 16,
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 110,
    },
    barColumn: { alignItems: 'center' },
    bar: { width: 26, borderRadius: 6 },
    barLabel: { fontSize: 10, color: colors.textLight, marginTop: 6 },

    actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    actionButton: {
        flex: 1,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiButton: { backgroundColor: colors.primary },
    cardButton: { backgroundColor: colors.bottleGreen },
    actionIcon: { fontSize: 20, marginBottom: 6 },
    actionText: { color: colors.card, fontWeight: '600', fontSize: 13 },

    actionIconImage: { width: 26, height: 26, marginBottom: 6 },
    storeLogoImage: { width: 26, height: 26 },

    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
    seeAll: { fontSize: 12, color: colors.primary, fontWeight: '600' },

    storeCard: {
        flexDirection: 'row',
        backgroundColor: colors.lightGreen,
        borderRadius: 16,
        padding: 14,
        marginBottom: 20,
        alignItems: 'center',
    },
    storeLogo: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    storeInfo: { flex: 1 },
    storeName: { fontSize: 14, fontWeight: '700', color: colors.text },
    storeDetail: { fontSize: 12, color: colors.textLight, marginTop: 2 },
    storeDistance: { fontSize: 11, color: colors.textLight, marginTop: 2 },

    offerCard: {
        backgroundColor: '#FDEDE3',
        borderRadius: 16,
        padding: 16,
    },
    offerLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 6,
    },
    offerText: { fontSize: 14, fontWeight: '600', color: colors.text },
    offerLink: { fontSize: 11, color: colors.textLight, marginTop: 6 },

    bottomNav: {
        flexDirection: 'row',
        backgroundColor: colors.bottleGreen,
        paddingTop: 12,
        paddingBottom: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    tabButton: { flex: 1, alignItems: 'center' },
    tabIcon: { fontSize: 20, marginBottom: 4 },
    tabLabel: { fontSize: 11, color: '#8FA89C' },
    tabLabelActive: { color: colors.card, fontWeight: '700' },
    tabDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primary,
        marginTop: 4,
    },
});