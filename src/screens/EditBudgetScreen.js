import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import { PillButton } from '../components/ui';
import { useBudget, useSetBudget } from '../hooks/useExpenseData';
import { formatMoney } from '../lib/dates';

export default function EditBudgetScreen({ onBack, onSaved }) {
  const { data: budget, isLoading } = useBudget();
  const setBudget = useSetBudget();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const prefilled = useRef(false);

  // Prefill once, when the current budget first loads.
  useEffect(() => {
    if (prefilled.current || isLoading || !budget) return;
    prefilled.current = true;
    if (budget.monthlyTotal > 0) setAmount(String(budget.monthlyTotal));
  }, [isLoading, budget]);

  const parsed = Number(amount.replace(',', '.'));

  const handleSave = () => {
    setError('');
    setFormError('');
    if (!amount.trim() || !Number.isFinite(parsed) || parsed < 0) {
      setError('Ingresá un monto válido (0 o más)');
      return;
    }
    setBudget.mutate(Math.round(parsed * 100) / 100, {
      onSuccess: () => onSaved?.(),
      onError: (e) => setFormError(e?.message || 'No se pudo guardar el presupuesto.'),
    });
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Edit Budget" onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.help}>
            Definí cuánto quiere gastar tu familia por mes. Las pantallas de presupuesto y
            estadísticas usan este número.
          </Text>

          <Text style={styles.label}>Presupuesto mensual</Text>
          <View style={[styles.amountBox, error && styles.boxError]}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={colors.textLight}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {!isLoading && budget?.monthlyTotal > 0 && (
            <Text style={styles.current}>Actual: {formatMoney(budget.monthlyTotal)}</Text>
          )}

          {!!formError && <Text style={[styles.errorText, { marginTop: 12 }]}>{formError}</Text>}

          <PillButton
            label={setBudget.isPending ? 'Guardando…' : 'Save budget'}
            variant="orange"
            onPress={handleSave}
            style={{ marginTop: 24, opacity: setBudget.isPending ? 0.6 : 1 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 40 },
  help: { fontSize: 13, color: colors.textLight, lineHeight: 19, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  boxError: { borderColor: colors.error },
  currency: { fontSize: 26, fontWeight: '800', color: colors.textLight, marginRight: 6 },
  amountInput: { flex: 1, fontSize: 30, fontWeight: '800', color: colors.text, paddingVertical: 8 },
  current: { fontSize: 12, color: colors.textLight, marginTop: 10 },
  errorText: { color: colors.error, fontSize: 12, marginTop: 6 },
});
