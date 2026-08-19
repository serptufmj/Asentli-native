import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const handleLoginSuccess = () => {
    console.log('Login exitoso ✅ (aquí después navegaremos a Home)');
  };

  return (
    <View style={styles.flex}>
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});