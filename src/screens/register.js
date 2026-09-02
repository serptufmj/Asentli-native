import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "../config/supabase";
import { colors } from "../theme/colors";

export default function RegisterScreen({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Correo no válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      const user = data.user;

      console.log(user);

      Alert.alert(
        "Registro exitoso",
        "La cuenta se creó correctamente"
      );

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      let mensaje = "";

      switch (error.code) {
        case "auth/email-already-in-use":
          mensaje = "Este correo ya está registrado";
          break;

        case "auth/invalid-email":
          mensaje = "Correo no válido";
          break;

        case "auth/weak-password":
          mensaje =
            "La contraseña debe tener al menos 8 caracteres";
          break;

        default:
          mensaje = "No se pudo crear la cuenta";
      }

      Alert.alert("Error", mensaje);
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={styles.flex}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>
              Crear cuenta
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
            />

            {errors.email && (
              <Text style={styles.error}>
                {errors.email}
              </Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {errors.password && (
              <Text style={styles.error}>
                {errors.password}
              </Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {errors.confirmPassword && (
              <Text style={styles.error}>
                {errors.confirmPassword}
              </Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24
  },

  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 10
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },

  error: {
    color: colors.error,
    marginTop: 5
  }
});