import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignIn } from '@clerk/clerk-expo';
import { colors } from '../theme/colors';
import { clerkErrorMessage } from '../lib/clerkErrors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ onBack }) {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [step, setStep] = useState('email'); // 'email' | 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sendCode = async () => {
    setError('');
    if (!email.trim()) return setError('El correo es obligatorio');
    if (!EMAIL_RE.test(email.trim())) return setError('Correo no válido');
    if (!isLoaded) return;

    setSubmitting(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep('reset');
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async () => {
    setError('');
    if (code.trim().length < 6) return setError('Ingresá el código de 6 dígitos.');
    if (password.length < 8) return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    if (!isLoaded) return;

    setSubmitting(true);
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        // Signed in with the new password — auth gate takes over.
      } else {
        setError('No pudimos completar el cambio. Intentá de nuevo.');
      }
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={[colors.gradientTop, colors.gradientBottom]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Recuperar contraseña</Text>

            {step === 'email' ? (
              <>
                <Text style={styles.description}>
                  Ingresá tu correo y te enviaremos un código para restablecer tu contraseña.
                </Text>

                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.button, submitting && styles.buttonDisabled]}
                  onPress={sendCode}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.card} />
                  ) : (
                    <Text style={styles.buttonText}>Enviar código</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.description}>
                  Revisá tu correo, ingresá el código y elegí una nueva contraseña.
                </Text>

                <Text style={styles.label}>Código</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  placeholderTextColor={colors.textLight}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                />

                <Text style={[styles.label, { marginTop: 14 }]}>Nueva contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.button, submitting && styles.buttonDisabled]}
                  onPress={resetPassword}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.card} />
                  ) : (
                    <Text style={styles.buttonText}>Cambiar contraseña</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backText}>← Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
  },
  inputError: { borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: 8 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.card, fontSize: 15, fontWeight: '700' },
  backButton: { alignItems: 'center', marginTop: 18 },
  backText: { color: colors.link, fontSize: 13, fontWeight: '600' },
});
