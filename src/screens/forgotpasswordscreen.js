import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRecovery = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setError('');
    setMessage('');


    if (!email.trim()) {
      setError('El correo es obligatorio');
      return;
    }


    if (!emailRegex.test(email.trim())) {
      setError('Correo no válido');
      return;
    }

    setMessage(
      'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.'
    );
  };

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={styles.container}
    >
      <View style={styles.card}>

        <Text style={styles.title}>
          Recuperar contraseña
        </Text>

        <Text style={styles.description}>
          Ingresa tu correo electrónico y te enviaremos un enlace para
          recuperar tu contraseña.
        </Text>

        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
          ]}
          placeholder="name@example.com"
          placeholderTextColor={colors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        {message ? (
          <Text style={styles.messageText}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRecovery}
        >
          <Text style={styles.buttonText}>
            Enviar enlace
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backText}>
            ← Volver al inicio de sesión
          </Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  inputError: {
    borderColor: colors.error,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },

  messageText: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 8,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 18,
  },

  backText: {
    color: colors.link,
    fontSize: 13,
    fontWeight: '600',
  },
});