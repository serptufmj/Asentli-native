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

export default function HomeScreen() {
    return (
        <View style={styles.flex}>

           
            <View style={styles.header}>

                <View>
                    <Text style={styles.greeting}>
                        Hello, Ronald!
                    </Text>

                    <Text style={styles.goodMorning}>
                        Good morning 🌞
                    </Text>
                </View>

                <TouchableOpacity style={styles.notificationButton}>
                    <Text style={styles.bellIcon}>🔔</Text>
                </TouchableOpacity>

            </View>


            
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >

                <View style={styles.balanceBox}>

                    <Text style={styles.balanceLabel}>
                        AVAILABLE BALANCE
                    </Text>

                    <Text style={styles.balanceAmount}>
                        $500<Text style={styles.balanceDecimal}>.00</Text>
                    </Text>

                    <View style={styles.balanceButtons}>

                        {/* DEPOSIT */}
                        <TouchableOpacity
                            style={styles.depositButton}
                            onPress={() => console.log('Deposit')}
                        >
                            <Text style={styles.depositText}>
                                + Deposit
                            </Text>
                        </TouchableOpacity>


                        {/* SEND */}
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => console.log('Send')}
                        >
                            <Text style={styles.sendText}>
                                ▷ Send
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>


               
                <View style={styles.portfolioBox}>

                    <Text style={styles.portfolioTitle}>
                        Portfolio Operations
                    </Text>


                    {/* RECORD INCOME */}
                    <TouchableOpacity
                        style={styles.operation}
                        onPress={() => console.log('Record Income')}
                    >

                        <View
                            style={[
                                styles.operationIcon,
                                styles.incomeIcon,
                            ]}
                        >
                            {/* IMAGEN */}
                            <Image
                                source={require('../../assets/income.png')}
                                style={styles.operationImage}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.operationInfo}>

                            <Text style={styles.operationTitle}>
                                Record Income
                            </Text>

                            <Text style={styles.operationDescription}>
                                Add extra money, bonuses, and remittances received.
                            </Text>

                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>

                    </TouchableOpacity>


                    
                    <TouchableOpacity
                        style={styles.operation}
                        onPress={() => console.log('Salary Transfer')}
                    >

                        <View
                            style={[
                                styles.operationIcon,
                                styles.salaryIcon,
                            ]}
                        >
                            {/* IMAGEN */}
                            <Image
                                source={require('../../assets/transfer.png')}
                                style={styles.operationImage}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.operationInfo}>

                            <Text style={styles.operationTitle}>
                                Salary Transfer
                            </Text>

                            <Text style={styles.operationDescription}>
                                Set up the automatic deposit for your monthly pay.
                            </Text>

                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>

                    </TouchableOpacity>


                  
                    <TouchableOpacity
                        style={styles.operation}
                        onPress={() => console.log('Top up from Bank')}
                    >

                        <View
                            style={[
                                styles.operationIcon,
                                styles.bankIcon,
                            ]}
                        >
                            {/* IMAGEN */}
                            <Image
                                source={require('../../assets/bank.png')}
                                style={styles.operationImage}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.operationInfo}>

                            <Text style={styles.operationTitle}>
                                Top up from Bank
                            </Text>

                            <Text style={styles.operationDescription}>
                                Link your local bank accounts for quick top-ups.
                            </Text>

                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>

                    </TouchableOpacity>

                </View>


              
                <View style={styles.summaryRow}>

                    {/* AHORROS */}
                    <View style={styles.savingsCard}>

                        <View style={styles.smallImageContainer}>
                            <Text style={styles.smallIcon}>
                                📈
                            </Text>
                        </View>

                        <Text style={styles.summaryTitle}>
                            +12% vs previous month
                        </Text>

                        <Text style={styles.summaryDescription}>
                            Your savings for the Basic Basket are growing.
                        </Text>

                    </View>


                    {/* BASIC BASKET */}
                    <View style={styles.goalCard}>

                        <View style={styles.smallImageContainer}>
                            <Text style={styles.smallIcon}>
                                🛒
                            </Text>
                        </View>

                        <Text style={styles.summaryTitle}>
                            Goal: Basic Basket
                        </Text>

                        <Text style={styles.summaryDescription}>
                            75% of your monthly goal reached.
                        </Text>

                    </View>

                </View>

            </ScrollView>


            {/* ================= MENÚ INFERIOR ================= */}
            <View style={styles.bottomNav}>

                {/* HOME */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => console.log('Home')}
                >
                    <Text style={styles.navIcon}>
                        ⌂
                    </Text>

                    <Text style={styles.navActive}>
                        Home
                    </Text>
                </TouchableOpacity>


                {/* STATISTICS */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => console.log('Statistics')}
                >
                    <Text style={styles.navIcon}>
                        ▥
                    </Text>

                    <Text style={styles.navText}>
                        Statistics
                    </Text>
                </TouchableOpacity>


                {/* BASKET */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => console.log('Basket')}
                >
                    <Text style={styles.navIcon}>
                        🛒
                    </Text>

                    <Text style={styles.navText}>
                        Basket
                    </Text>
                </TouchableOpacity>


                {/* PROFILE */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => console.log('Profile')}
                >
                    <Text style={styles.navIcon}>
                        ♙
                    </Text>

                    <Text style={styles.navText}>
                        Profile
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}


/* =========================================================
                        STYLES
========================================================= */

const styles = StyleSheet.create({

    /* ================= GENERAL ================= */

    flex: {
        flex: 1,
        backgroundColor: colors.card,
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },


    /* ================= HEADER ================= */

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },

    greeting: {
        fontSize: 14,
        color: colors.text,
    },

    goodMorning: {
        fontSize: 13,
        color: colors.textLight,
        marginTop: 2,
    },

    notificationButton: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bellIcon: {
        fontSize: 20,
    },


    /* ================= BALANCE ================= */

    balanceBox: {
        borderWidth: 1,
        borderColor: '#1685FF',
        borderStyle: 'dotted',
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginBottom: 22,
    },

    balanceLabel: {
        fontSize: 10,
        letterSpacing: 1,
        color: colors.text,
    },

    balanceAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FF5B00',
        marginTop: 7,
        marginBottom: 16,
    },

    balanceDecimal: {
        fontSize: 14,
    },

    balanceButtons: {
        flexDirection: 'row',
        gap: 12,
    },

    depositButton: {
        width: 82,
        height: 28,
        borderRadius: 20,
        backgroundColor: '#FF5B00',
        alignItems: 'center',
        justifyContent: 'center',
    },

    depositText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },

    sendButton: {
        width: 82,
        height: 28,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF5B00',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sendText: {
        color: '#FF5B00',
        fontSize: 11,
        fontWeight: '600',
    },


    /* ================= PORTFOLIO ================= */

    portfolioBox: {
        borderWidth: 1,
        borderColor: '#1685FF',
        borderStyle: 'dotted',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 4,
        marginBottom: 22,
    },

    portfolioTitle: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 8,
        fontWeight: '500',
    },

    operation: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    operationIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        overflow: 'hidden',
    },

    incomeIcon: {
        backgroundColor: '#DDF7C8',
    },

    salaryIcon: {
        backgroundColor: '#FFE0D5',
    },

    bankIcon: {
        backgroundColor: '#D5F3E8',
    },

    operationImage: {
        width: 21,
        height: 21,
    },

    operationInfo: {
        flex: 1,
    },

    operationTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 2,
    },

    operationDescription: {
        fontSize: 9,
        color: colors.textLight,
        lineHeight: 12,
    },

    arrow: {
        fontSize: 22,
        color: colors.text,
        marginLeft: 5,
    },


    /* ================= SUMMARY CARDS ================= */

    summaryRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 20,
    },

    savingsCard: {
        flex: 1,
        minHeight: 105,
        backgroundColor: '#C8FFE8',
        borderRadius: 18,
        padding: 10,
    },

    goalCard: {
        flex: 1,
        minHeight: 105,
        backgroundColor: '#FFE0CF',
        borderRadius: 18,
        padding: 10,
    },

    smallImageContainer: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        marginBottom: 4,
    },

    smallIcon: {
        fontSize: 17,
    },

    summaryTitle: {
        fontSize: 9,
        fontWeight: '700',
        color: colors.text,
        lineHeight: 12,
    },

    summaryDescription: {
        fontSize: 8,
        color: colors.textLight,
        lineHeight: 11,
        marginTop: 5,
    },


    /* ================= BOTTOM NAVIGATION ================= */

    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 65,
        backgroundColor: colors.bottleGreen,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 55,
    },

    navIcon: {
        fontSize: 18,
        color: '#AAAAAA',
        marginBottom: 3,
    },

    navText: {
        fontSize: 9,
        color: '#AAAAAA',
    },

    navActive: {
        fontSize: 9,
        color: '#FFFFFF',
    },

});