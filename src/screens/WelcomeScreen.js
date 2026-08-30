
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function WelcomeScreen({ onSignUp, onSignIn }) {
    return (
        <LinearGradient
            colors={[colors.gradientTop, '#FFFFFF']}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../../assets/asentli-logo.jpg')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.brand}>ASENTLI</Text>
                <Text style={styles.tagline}>FINTECH FAMILIAR</Text>

                <View style={styles.buttonsWrapper}>
                    <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
                        <Text style={styles.signUpText}>Sign up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
                        <Text style={styles.signInText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: colors.backgroundLogo,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    logoImage: {
        width: 90,
        height: 90,
    },
    brand: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.bottleGreen,
        letterSpacing: 1,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 12,
        color: colors.textLight,
        letterSpacing: 2,
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonsWrapper: {
        width: '100%',
    },
    signUpButton: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 14,
    },
    signUpText: {
        color: colors.card,
        fontSize: 16,
        fontWeight: '600',
    },
    signInButton: {
        width: '100%',
        backgroundColor: colors.card,
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    signInText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});