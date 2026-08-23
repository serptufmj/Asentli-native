// src/screens/TermsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';

export default function TermsScreen({ onAccept }) {
  const [accepted, setAccepted] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms and conditions</Text>

      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>⚖️</Text>
      </View>

      <Text style={styles.subtitle}>
        Please read the terms carefully before using our family financial
        services.
      </Text>

      <View style={styles.box}>
        <Text style={styles.sectionTitle}>1. Acceptance</Text>
        <Text style={styles.sectionText}>
          By accessing and using the Asentli app, you agree to be bound by
          these terms and conditions of use, as well as all applicable laws
          in the Republic of El Salvador.
        </Text>

        <Text style={styles.sectionTitle}>2. Privacy</Text>
        <Text style={styles.sectionText}>
          We are committed to protecting the privacy of your family's
          finances. Your Basic Basket and savings information is used
          exclusively to generate personalized statistics and budget
          recommendations.
        </Text>

        <Text style={styles.sectionTitle}>3. Basic Basket Management</Text>
        <Text style={styles.sectionText}>
          The user is responsible for the accuracy of the prices entered.
          Asentli provides a monitoring platform and does not guarantee the
          availability of products at local stores.
        </Text>

        <Text style={styles.sectionTitle}>4. Security</Text>
        <Text style={styles.sectionText}>
          You are responsible for keeping your password confidential and
          for all activities that happen under your account.
        </Text>

        <Text style={styles.sectionTitle}>5. Updates</Text>
        <Text style={styles.sectionText}>
          Asentli reserves the right to review these terms at any time
          without prior notice.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAccepted(!accepted)}
      >
        <View style={[styles.checkbox, accepted && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>
          I confirm that I accept the Terms and Conditions
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setDontShowAgain(!dontShowAgain)}
      >
        <View
          style={[styles.checkbox, dontShowAgain && styles.checkboxChecked]}
        />
        <Text style={styles.checkboxLabel}>Do not show again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !accepted && styles.continueButtonDisabled,
        ]}
        disabled={!accepted}
        onPress={onAccept}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.bottleGreen,
    textAlign: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.lightGreen,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 28 },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  box: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 19,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonDisabled: {
    backgroundColor: colors.border,
  },
  continueText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
});