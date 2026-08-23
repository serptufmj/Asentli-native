import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { colors } from '../theme/colors';

const movements = [
    {
        id: '1',
        icon: '🛒',
        name: 'Súper Selectos',
        date: 'Today, 10:45 AM',
        amount: '-$42.15',
        tag: 'EXPENSE',
        isExpense: true,
    },
    {
        id: '2',
        icon: '💳',
        name: 'Wallet Top-Up',
        date: 'Yesterday, 3:20 PM',
        amount: '+$150.00',
        tag: 'Deposit',
        isExpense: false,
    },
];

export default function CardScreen({ onBack }) {
    return (
        <View style={styles.flex}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Asentli</Text>
                <Text style={styles.bellIcon}>🔔</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.greeting}>Hi, User</Text>
                <Text style={styles.pageTitle}>Your Family Wallet</Text>

                {/* Card */}
                <View style={styles.cardBox}>
                    <View style={styles.cardTopRow}>
                        <Text style={styles.cardLabel}>FAMILY DEBIT</Text>
                        <Text style={styles.contactlessIcon}>((•))</Text>
                    </View>

                    <View style={styles.cardMiddleRow}>
                        <View style={styles.chipCircle}>
                            <Image
                                source={require('../../assets/asentli-logo.jpg')}
                                style={styles.chipLogo}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <View style={styles.cardNumberRow}>
                        <View style={styles.dotsRow}>
                            {[...Array(3)].map((_, groupIndex) => (
                                <View key={groupIndex} style={styles.dotsGroup}>
                                    {[...Array(4)].map((_, i) => (
                                        <View key={i} style={styles.dot} />
                                    ))}
                                </View>
                            ))}
                        </View>
                        <Text style={styles.cardLastDigits}>4291</Text>
                    </View>

                    <View style={styles.cardBottomRow}>
                        <View>
                            <Text style={styles.cardSmallLabel}>HEADLINE</Text>
                            <Text style={styles.cardHolder}>USERNAME</Text>
                        </View>
                        <View>
                            <Text style={styles.cardSmallLabel}>EXPIRATION</Text>
                            <Text style={styles.cardExpiry}>08/27</Text>
                        </View>
                    </View>
                </View>

                {/* Pay basket button */}
                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payIcon}>🧺</Text>
                    <Text style={styles.payText}>Pay basket</Text>
                </TouchableOpacity>

                {/* Balance card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>$342.50</Text>

                    <View style={styles.movementRow}>
                        <View style={[styles.movementIconCircle, { backgroundColor: '#B9D89A' }]}>
                            <Text style={styles.movementIconText}>💰</Text>
                        </View>
                        <Text style={styles.movementLabel}>Income</Text>
                        <Text style={styles.incomeAmount}>+$850</Text>
                    </View>

                    <View style={styles.movementRow}>
                        <View style={[styles.movementIconCircle, { backgroundColor: '#FF9391'  }]}>
                            <Text style={styles.movementIconText}>📉</Text>
                        </View>
                        <Text style={styles.movementLabel}>Expenses</Text>
                        <Text style={styles.expenseAmount}>-$507</Text>
                    </View>
                </View>

                {/* Basic Basket Progress */}
                <View style={styles.progressHeaderRow}>
                    <Text style={styles.progressTitle}>Basic Basket{'\n'}Progress</Text>
                    <Text style={styles.progressPercent}>75% Done</Text>
                </View>

                <View style={styles.progressBox}>
                    <View style={styles.progressBarTrack}>
                        <View style={styles.progressBarFill} />
                    </View>

                    <View style={styles.progressStatsRow}>
                        <View>
                            <Text style={styles.progressStatLabel}>Goal</Text>
                            <Text style={styles.progressStatValue}>$120.00</Text>
                        </View>
                        <View>
                            <Text style={styles.progressStatLabel}>Current</Text>
                            <Text style={styles.progressStatValue}>$90.00</Text>
                        </View>
                    </View>

                    <View style={styles.progressStatsRow}>
                        <View>
                            <Text style={styles.progressStatLabel}>Days left</Text>
                            <Text style={styles.progressStatValue}>12 days</Text>
                        </View>
                        <View style={styles.doingWellBadge}>
                            <Text style={styles.doingWellText}>You're doing well!</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Movements */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Recent Movements</Text>
                    <Text style={styles.seeAll}>See all</Text>
                </View>

                {movements.map((m) => (
                    <View key={m.id} style={styles.movementCard}>
                        <View style={styles.movementCardIcon}>
                            <Text style={{ fontSize: 18 }}>{m.icon}</Text>
                        </View>
                        <View style={styles.movementCardInfo}>
                            <Text style={styles.movementCardName}>{m.name}</Text>
                            <Text style={styles.movementCardDate}>{m.date}</Text>
                        </View>
                        <View style={styles.movementCardRight}>
                            <Text
                                style={
                                    m.isExpense ? styles.movementCardAmountExpense : styles.movementCardAmountIncome
                                }
                            >
                                {m.amount}
                            </Text>
                            <View
                                style={[
                                    styles.movementTag,
                                    { backgroundColor: m.isExpense ? colors.lightGreen : 'transparent' },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.movementTagText,
                                        { color: m.isExpense ? colors.text : colors.textLight },
                                    ]}
                                >
                                    {m.tag}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
    backArrow: { fontSize: 22, color: colors.bottleGreen },
    headerTitle: { fontSize: 20, fontWeight: '800', color: colors.bottleGreen },
    bellIcon: { fontSize: 20 },

    content: { paddingHorizontal: 20, paddingBottom: 40 },

    greeting: { fontSize: 14, color: colors.textLight },
    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 20,
    },

    cardBox: {
        backgroundColor: colors.bottleGreen,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLabel: { color: '#8FA89C', fontSize: 11, letterSpacing: 1 },
    contactlessIcon: { color: '#8FA89C', fontSize: 16 },
    cardMiddleRow: { marginTop: 16, marginBottom: 16 },
    chipCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    chipLogo: { width: 30, height: 30 },
    cardNumberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dotsRow: { flexDirection: 'row', gap: 10 },
    dotsGroup: { flexDirection: 'row', gap: 4 },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#B8C9C0',
    },
    cardLastDigits: { color: colors.card, fontSize: 22, fontWeight: '700' },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardSmallLabel: { color: '#8FA89C', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
    cardHolder: { color: colors.card, fontSize: 14, fontWeight: '600' },
    cardExpiry: { color: colors.card, fontSize: 14, fontWeight: '600', textAlign: 'right' },

    payButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    payIcon: { fontSize: 16, marginRight: 8 },
    payText: { color: colors.card, fontSize: 16, fontWeight: '700' },

    balanceCard: {
        backgroundColor: colors.balanceGreen,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    balanceLabel: { fontSize: 13, color: '#4A5C40' },
    balanceAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.bottleGreen,
        marginTop: 4,
        marginBottom: 20,
    },
    movementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    movementIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    movementIconText: { fontSize: 14 },
    movementLabel: { flex: 1, fontSize: 14, color: colors.bottleGreen },
    incomeAmount: { fontSize: 14, fontWeight: '700', color: colors.bottleGreen },
    expenseAmount: { fontSize: 14, fontWeight: '700', color: '#C0562E' },

    progressHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    progressTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
    progressPercent: { fontSize: 15, fontWeight: '700', color: colors.primary },

    progressBox: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
    },
    progressBarTrack: {
        height: 8,
        backgroundColor: colors.lightGreen,
        borderRadius: 4,
        marginBottom: 20,
    },
    progressBarFill: {
        width: '75%',
        height: 8,
        backgroundColor: colors.saladGreen,
        borderRadius: 4,
    },
    progressStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressStatLabel: { fontSize: 12, color: colors.textLight, marginBottom: 4 },
    progressStatValue: { fontSize: 16, fontWeight: '700', color: colors.text },
    doingWellBadge: {
        backgroundColor: colors.lightGreen,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    doingWellText: { fontSize: 12, color: colors.bottleGreen, fontWeight: '600' },

    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
    seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

    movementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    movementCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.lightGreen,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    movementCardInfo: { flex: 1 },
    movementCardName: { fontSize: 15, fontWeight: '700', color: colors.text },
    movementCardDate: { fontSize: 12, color: colors.textLight, marginTop: 2 },
    movementCardRight: { alignItems: 'flex-end' },
    movementCardAmountIncome: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.saladGreen,
        marginBottom: 4,
    },
    movementCardAmountExpense: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 4,
    },
    movementTag: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    movementTagText: { fontSize: 10, fontWeight: '600' },
});