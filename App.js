import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/forgotpasswordscreen';
import TermsScreen from './src/screens/TermsScreen';
import SplashScreen from './src/screens/SplashScreen';

import HomeScreen from './src/screens/HomeScreen';
import CardScreen from './src/screens/CardScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import AddExpenseScreen from './src/screens/AddExpenseScreen';
import EditBudgetScreen from './src/screens/EditBudgetScreen';

import BasketScreen from './src/screens/BasketScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import AffiliatedBusinessesScreen from './src/screens/AffiliatedBusinessesScreen';
import BudgetDetailsScreen from './src/screens/BudgetDetailsScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import PurchaseHistoryScreen from './src/screens/PurchaseHistoryScreen';
import AvailableOffersScreen from './src/screens/AvailableOffersScreen';
import PriceComparerScreen from './src/screens/PriceComparerScreen';
import ShoppingStoreScreen from './src/screens/ShoppingStoreScreen';
import DiscountsOffersScreen from './src/screens/DiscountsOffersScreen';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Copy .env.example to .env and ' +
      'restart the bundler with `npx expo start -c`.'
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <View style={styles.flex}>
          <RootGate />
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

/** Decides between splash / auth flow / main app based on the Clerk session. */
function RootGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  if (!isLoaded || (isSignedIn && !userLoaded)) return <SplashScreen />;

  if (!isSignedIn) return <AuthFlow />;

  const acceptedTerms = !!user?.unsafeMetadata?.acceptedTerms;
  return <MainApp needsTerms={!acceptedTerms} />;
}

/** Signed-out screens: welcome -> sign in / sign up / forgot password. */
function AuthFlow() {
  const [route, setRoute] = useState('welcome');

  if (route === 'signup') {
    return <SignUpScreen onSignInInstead={() => setRoute('signin')} />;
  }
  if (route === 'signin') {
    return (
      <LoginScreen
        onSignUp={() => setRoute('signup')}
        onForgotPassword={() => setRoute('forgot')}
      />
    );
  }
  if (route === 'forgot') {
    return <ForgotPasswordScreen onBack={() => setRoute('signin')} />;
  }
  return (
    <WelcomeScreen
      onSignUp={() => setRoute('signup')}
      onSignIn={() => setRoute('signin')}
    />
  );
}

/** Signed-in app. Same useState history-stack pattern as before. */
function MainApp({ needsTerms }) {
  const [termsDone, setTermsDone] = useState(!needsTerms);
  const [stack, setStack] = useState(['home']);
  const screen = stack[stack.length - 1];

  const go = (key) => {
    setStack((s) => {
      const current = s[s.length - 1];
      if (key === current) return s;
      const existing = s.indexOf(key);
      if (existing !== -1) return s.slice(0, existing + 1); // pop back to it
      return [...s, key];
    });
  };
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  if (needsTerms && !termsDone) {
    return <TermsScreen onAccept={() => setTermsDone(true)} />;
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen onNavigate={go} onAddExpense={() => go('addExpense')} />
      )}

      {screen === 'addExpense' && (
        <AddExpenseScreen onBack={back} onSaved={() => go('home')} />
      )}

      {screen === 'editBudget' && (
        <EditBudgetScreen onBack={back} onSaved={() => go('budgetDetails')} />
      )}

      {screen === 'card' && <CardScreen onBack={back} onNavigate={go} />}

      {screen === 'ai' && <AIAssistantScreen onBack={back} onNavigate={go} />}

      {screen === 'notifications' && (
        <NotificationsScreen onBack={back} onNavigate={go} />
      )}

      {screen === 'basket' && (
        <BasketScreen
          onBack={back}
          onNavigate={go}
          onOpenStore={() => go('shoppingStore')}
          onOpenComparator={() => go('priceComparer')}
          onOpenBudget={() => go('budgetDetails')}
        />
      )}

      {screen === 'statistics' && (
        <StatisticsScreen
          onBack={back}
          onNavigate={go}
          onOpenHistory={() => go('purchaseHistory')}
          onOpenRewards={() => go('rewards')}
        />
      )}

      {screen === 'affiliated' && (
        <AffiliatedBusinessesScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
          onOpenBusiness={() => go('discountsOffers')}
        />
      )}

      {screen === 'budgetDetails' && (
        <BudgetDetailsScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
          onEditBudget={() => go('editBudget')}
        />
      )}

      {screen === 'rewards' && (
        <RewardsScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
          onKeepShopping={() => go('shoppingStore')}
        />
      )}

      {screen === 'purchaseHistory' && (
        <PurchaseHistoryScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
        />
      )}

      {screen === 'availableOffers' && (
        <AvailableOffersScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
          onOpenOffer={() => go('discountsOffers')}
        />
      )}

      {screen === 'priceComparer' && (
        <PriceComparerScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
          onOpenStore={() => go('shoppingStore')}
        />
      )}

      {screen === 'shoppingStore' && (
        <ShoppingStoreScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
        />
      )}

      {screen === 'discountsOffers' && (
        <DiscountsOffersScreen
          onBack={back}
          onNavigate={go}
          onBell={() => go('notifications')}
          onViewMore={() => go('availableOffers')}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen onBack={back} onNavigate={go} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
