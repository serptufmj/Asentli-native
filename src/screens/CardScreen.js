import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import { useBudget, useMonthExpenses, useRecentExpenses } from '../hooks/useExpenseData';
import { sumAmount } from '../lib/expenseMath';
import { formatMoney, formatDateTime } from '../lib/dates';
import { categoryLabel } from '../constants/categories';

export default function CardScreen({ onBack, onNavigate }) {
    const go = (key) => onNavigate && onNavigate(key);

    const budgetQ = useBudget();
    const monthQ = useMonthExpenses();
    const recentQ = useRecentExpenses(5);

    const loading = budgetQ.isLoading || monthQ.isLoading;
    const monthlyTotal = budgetQ.data?.monthlyTotal ?? 0;
    const spent = sumAmount(monthQ.data ?? []);
    const available = monthlyTotal - spent;
    const recent = recentQ.data ?? [];

    return (
        <View style={styles.flex}>
            <ScreenHeader title="Asentli" onBack={onBack} onBell={() => go('notifications')} />

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
                <TouchableOpacity style={styles.payButton} onPress={() => go('basket')}>
                    <Ionicons name="basket" size={18} color={colors.card} style={{ marginRight: 8 }} />
                    <Text style={styles.payText}>Pay basket</Text>
                </TouchableOpacity>

                {/* Quick actions */}
                <View style={styles.quickRow}>
                    <TouchableOpacity style={styles.quickButton} onPress={() => go('priceComparer')}>
                        <Ionicons name="swap-horizontal" size={18} color={colors.bottleGreen} />
                        <Text style={styles.quickText}>Compare prices</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickButton} onPress={() => go('rewards')}>
                        <Ionicons name="cash-outline" size={18} color={colors.bottleGreen} />
                        <Text style={styles.quickText}>Cashback</Text>
                    </TouchableOpacity>
                </View>

                {/* Balance card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    {loading ? (
                        <ActivityIndicator color={colors.bottleGreen} style={{ alignSelf: 'flex-start', marginVertical: 12 }} />
                    ) : (
                        <Text style={styles.balanceAmount}>{formatMoney(available)}</Text>
                    )}

                    <View style={styles.movementRow}>
                        <View style={[styles.movementIconCircle, { backgroundColor: '#B9D89A' }]}>
                            <Text style={styles.movementIconText}>💰</Text>
                        </View>
                        <Text style={styles.movementLabel}>Income</Text>
                        <Text style={styles.incomeAmount}>{formatMoney(0)}</Text>
                    </View>

                    <View style={styles.movementRow}>
                        <View style={[styles.movementIconCircle, { backgroundColor: '#FF9391' }]}>
                            <Text style={styles.movementIconText}>📉</Text>
                        </View>
                        <Text style={styles.movementLabel}>Expenses (this month)</Text>
                        <Text style={styles.expenseAmount}>-{formatMoney(spent)}</Text>
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
                    <TouchableOpacity onPress={() => go('purchaseHistory')}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {recentQ.isLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
                ) : recent.length === 0 ? (
                    <EmptyState
                        compact
                        title="Sin movimientos todavía"
                        subtitle="Tus gastos registrados van a aparecer acá."
                    />
                ) : (
                    recent.map((m) => (
                        <View key={m.id} style={styles.movementCard}>
                            <View style={styles.movementCardIcon}>
                                <Text style={{ fontSize: 18 }}>🛒</Text>
                            </View>
                            <View style={styles.movementCardInfo}>
                                <Text style={styles.movementCardName}>
                                    {m.merchant || categoryLabel(m.category)}
                                </Text>
                                <Text style={styles.movementCardDate}>{formatDateTime(m.spent_at)}</Text>
                            </View>
                            <View style={styles.movementCardRight}>
                                <Text style={styles.movementCardAmountExpense}>-{formatMoney(m.amount)}</Text>
                                <View style={[styles.movementTag, { backgroundColor: colors.lightGreen }]}>
                                    <Text style={[styles.movementTagText, { color: colors.text }]}>
                                        {categoryLabel(m.category)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <BottomNav active="Home" onNavigate={onNavigate} />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.card },

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
        marginBottom: 12,
    },
    payText: { color: colors.card, fontSize: 16, fontWeight: '700' },

    quickRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    quickButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        paddingVertical: 14,
    },
    quickText: { fontSize: 13, fontWeight: '700', color: colors.bottleGreen },

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
