import { useCallback, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';

// Required so the auth popup can dismiss itself and hand control back to the app.
WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  useEffect(() => {
    // Android: pre-loads the browser so the OAuth screen opens instantly.
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

/**
 * Google sign-in via Clerk's hosted SSO flow (works in Expo Go and dev builds).
 * On success Clerk activates the session and the auth gate in App.js re-renders
 * into the signed-in stack.
 */
export function useGoogleAuth() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return true;
      }
      // No session: the user closed the popup, or the account needs extra steps.
      return false;
    } catch (err) {
      setError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          'No se pudo continuar con Google. Intentá de nuevo.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow]);

  return { signInWithGoogle, loading, error };
}
