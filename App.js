import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TermsScreen from './src/screens/TermsScreen';
import HomeScreen from './src/screens/HomeScreen';
import CardScreen from './src/screens/CardScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';

export default function App() {
  const [screen, setScreen] = useState('welcome');

  return (
    <View style={styles.flex}>
      {screen === 'welcome' && (
        <WelcomeScreen onContinue={() => setScreen('terms')} />
      )}
      {screen === 'terms' && <TermsScreen onAccept={() => setScreen('home')} />}
      {screen === 'home' && (
        <HomeScreen
          onMyCardPress={() => setScreen('card')}
          onAIAssistantPress={() => setScreen('ai')}
        />
      )}
      {screen === 'card' && <CardScreen onBack={() => setScreen('home')} />}
      {screen === 'ai' && <AIAssistantScreen onBack={() => setScreen('home')} />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});