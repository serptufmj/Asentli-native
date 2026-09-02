import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';
import { PillButton } from '../components/ui';
import { CATEGORIES, KNOWN_MERCHANTS } from '../constants/categories';
import { useAddExpense } from '../hooks/useExpenseData';

function formatDay(d) {
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return isToday ? `Today · ${label}` : label;
}

export default function AddExpenseScreen({ onBack, onSaved }) {
  const addExpense = useAddExpense();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const parsedAmount = Number(amount.replace(',', '.'));

  const validate = () => {
    const next = {};
    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      next.amount = 'Ingresá un monto válido mayor a $0';
    }
    if (!category) next.category = 'Elegí una categoría';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    setFormError('');
    if (!validate()) return;

    // Keep the current time of day, but on the chosen calendar date.
    const spentAt = new Date(date);
    const now = new Date();
    spentAt.setHours(now.getHours(), now.getMinutes(), 0, 0);

    addExpense.mutate(
      {
        amount: Math.round(parsedAmount * 100) / 100,
        category,
        merchant,
        note,
        spentAt: spentAt.toISOString(),
      },
      {
        onSuccess: () => onSaved?.(),
        onError: (e) =>
          setFormError(e?.message || 'No se pudo guardar el gasto. Revisá tu conexión.'),
      }
    );
  };

  const onPickerChange = (event, selected) => {
    setShowPicker(Platform.OS === 'ios');
    if (event.type !== 'dismissed' && selected) setDate(selected);
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Add Expense" onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Amount */}
          <Text style={styles.label}>Monto</Text>
          <View style={[styles.amountBox, errors.amount && styles.boxError]}>
            <Text style={styles.amountCurrency}>$</Text>
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
          {!!errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

          {/* Category */}
          <Text style={[styles.label, { marginTop: 22 }]}>Categoría</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((c) => {
              const active = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.catChip, active && { backgroundColor: c.color, borderColor: c.color }]}
                  onPress={() => setCategory(c.key)}
                >
                  <Ionicons
                    name={c.icon}
                    size={16}
                    color={active ? colors.card : c.color}
                  />
                  <Text style={[styles.catChipText, active && { color: colors.card }]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {!!errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

          {/* Merchant */}
          <Text style={[styles.label, { marginTop: 22 }]}>Tienda / comercio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Súper Selectos"
            placeholderTextColor={colors.textLight}
            value={merchant}
            onChangeText={setMerchant}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestRow}
            keyboardShouldPersistTaps="handled"
          >
            {KNOWN_MERCHANTS.map((m) => (
              <TouchableOpacity key={m} style={styles.suggestChip} onPress={() => setMerchant(m)}>
                <Text style={styles.suggestChipText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date */}
          <Text style={[styles.label, { marginTop: 18 }]}>Fecha</Text>
          <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker(true)}>
            <Ionicons name="calendar-outline" size={18} color={colors.bottleGreen} />
            <Text style={styles.dateText}>{formatDay(date)}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textLight} />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              maximumDate={new Date()}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onPickerChange}
            />
          )}

          {/* Note */}
          <Text style={[styles.label, { marginTop: 18 }]}>Nota (opcional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Detalle del gasto…"
            placeholderTextColor={colors.textLight}
            value={note}
            onChangeText={setNote}
            multiline
          />

          {!!formError && <Text style={[styles.errorText, { marginTop: 14 }]}>{formError}</Text>}

          <PillButton
            label={addExpense.isPending ? 'Guardando…' : 'Save expense'}
            variant="orange"
            onPress={handleSave}
            style={{ marginTop: 24, opacity: addExpense.isPending ? 0.6 : 1 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 40 },

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
  amountCurrency: { fontSize: 26, fontWeight: '800', color: colors.textLight, marginRight: 6 },
  amountInput: { flex: 1, fontSize: 30, fontWeight: '800', color: colors.text, paddingVertical: 8 },

  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  catChipText: { fontSize: 13, fontWeight: '700', color: colors.text },

  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  noteInput: { minHeight: 64, textAlignVertical: 'top' },

  suggestRow: { gap: 8, paddingVertical: 10 },
  suggestChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.chipBg,
  },
  suggestChipText: { fontSize: 12, color: colors.chipText, fontWeight: '600' },

  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },

  errorText: { color: colors.error, fontSize: 12, marginTop: 6 },
});
