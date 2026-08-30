import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSignUp } from '@clerk/clerk-expo';
import { colors } from '../theme/colors';
import { clerkErrorMessage } from '../lib/clerkErrors';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import GoogleButton from '../components/GoogleButton';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen({ onSignInInstead }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();

  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'El correo es obligatorio';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Correo no válido';

    if (!password) next.password = 'La contraseña es obligatoria';
    else if (password.length < 8) next.password = 'Debe tener al menos 8 caracteres';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignUp = async () => {
    setFormError('');
    if (!isLoaded || !validate()) return;
    setSubmitting(true);
    try {
      await signUp.create({ emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err) {
      setFormError(clerkErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setFormError('');
    if (!isLoaded) return;
    if (code.trim().length < 6) {
      setFormError('Ingresá el código de 6 dígitos que te enviamos por correo.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        // Auth gate takes over from here.
      } else {
        setFormError('No pudimos completar la verificación. Intentá de nuevo.');
      }
    } catch (err) {
      setFormError(clerkErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    setFormError('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    } catch (err) {
      setFormError(clerkErrorMessage(err));
    }
  };

  return (
    <LinearGradient colors={[colors.gradientTop, colors.gradientBottom]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/asentli-logo.jpg')} style={styles.logo} />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Fintech familiar</Text>

          <View style={styles.card}>
            {step === 'form' ? (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                    <Text style={styles.icon}>✉️</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor={colors.textLight}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                    <Text style={styles.icon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mínimo 8 caracteres"
                      placeholderTextColor={colors.textLight}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                      <Text style={styles.icon}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {!!formError && <Text style={styles.formError}>{formError}</Text>}

                <TouchableOpacity
                  style={[styles.button, submitting && styles.buttonDisabled]}
                  onPress={handleSignUp}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.card} />
                  ) : (
                    <Text style={styles.buttonText}>Sign up</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o</Text>
                  <View style={styles.dividerLine} />
                </View>

                <GoogleButton onPress={signInWithGoogle} loading={googleLoading} />
                {!!googleError && <Text style={styles.formError}>{googleError}</Text>}
              </>
            ) : (
              <>
                <Text style={styles.verifyText}>
                  Te enviamos un código de 6 dígitos a{'\n'}
                  <Text style={styles.verifyEmail}>{email.trim()}</Text>
                </Text>

                <View style={styles.field}>
                  <Text style={styles.label}>Código de verificación</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.icon}>🔑</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123456"
                      placeholderTextColor={colors.textLight}
                      keyboardType="number-pad"
                      maxLength={6}
                      value={code}
                      onChangeText={setCode}
                    />
                  </View>
                </View>

                {!!formError && <Text style={styles.formError}>{formError}</Text>}

                <TouchableOpacity
                  style={[styles.button, submitting && styles.buttonDisabled]}
                  onPress={handleVerify}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.card} />
                  ) : (
                    <Text style={styles.buttonText}>Verificar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={resendCode} style={styles.resend}>
                  <Text style={styles.resendText}>Reenviar código</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={onSignInInstead}>
              <Text style={styles.footerLink}>Iniciar sesión</Text>
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
    paddingVertical: 40,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  field: { marginBottom: 16 },
  label: { fontSize: 13, color: colors.text, marginBottom: 6, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputError: { borderColor: colors.error },
  icon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.text },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },
  formError: { color: colors.error, fontSize: 13, marginBottom: 12, textAlign: 'center' },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.card, fontSize: 15, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, color: colors.textLight, marginHorizontal: 10 },
  verifyText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  verifyEmail: { fontWeight: '700', color: colors.bottleGreen },
  resend: { alignItems: 'center', marginTop: 14 },
  resendText: { color: colors.link, fontSize: 13, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 13, color: colors.textLight },
  footerLink: { fontSize: 13, color: colors.link, fontWeight: '700' },
});
