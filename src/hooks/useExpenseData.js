import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { supabase } from '../lib/supabase';
import { monthRange, periodRange } from '../lib/dates';

const EXPENSE_COLS = 'id, amount, category, merchant, spent_at, source, note';

/* ------------------------------------------------------------------ reads */

export function useExpensesInRange(from, to) {
  const { userId, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ['expenses', userId, from, to],
    enabled: Boolean(userId && isSignedIn && from && to),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select(EXPENSE_COLS)
        .eq('user_id', userId)
        .gte('spent_at', from)
        .lte('spent_at', to)
        .order('spent_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMonthExpenses() {
  const range = useMemo(() => monthRange(), []);
  return useExpensesInRange(range.from, range.to);
}

export function usePeriodExpenses(period) {
  const range = useMemo(() => periodRange(period), [period]);
  const current = useExpensesInRange(range.from, range.to);
  const previous = useExpensesInRange(range.prevFrom, range.prevTo);
  return { current, previous };
}

export function useRecentExpenses(limit = 50) {
  const { userId, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ['expenses-recent', userId, limit],
    enabled: Boolean(userId && isSignedIn),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select(EXPENSE_COLS)
        .eq('user_id', userId)
        .order('spent_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBudget() {
  const { userId, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ['budget', userId],
    enabled: Boolean(userId && isSignedIn),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('monthly_total')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return { monthlyTotal: Number(data?.monthly_total ?? 0) };
    },
  });
}

/* -------------------------------------------------------------- mutations */

export function useAddExpense() {
  const { userId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, category, merchant, spentAt, note }) => {
      const { error } = await supabase.from('expenses').insert({
        user_id: userId,
        amount,
        category,
        merchant: merchant?.trim() || null,
        spent_at: spentAt,
        note: note?.trim() || null,
        source: 'manual',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] });
      qc.invalidateQueries({ queryKey: ['expenses-recent'] });
    },
  });
}

export function useSetBudget() {
  const { userId } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (monthlyTotal) => {
      const { error } = await supabase.from('budgets').upsert(
        {
          user_id: userId,
          monthly_total: monthlyTotal,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget'] }),
  });
}
