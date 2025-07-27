"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DictionaryContextType {
  count: number | null;
  isLoading: boolean;
  error: string | null;
  incrementCount: () => void;
  decrementCount: () => void;
  refreshCount: () => Promise<void>;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export function DictionaryProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      const supabase = createClient();

      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setCount(null);
        setIsLoading(false);
        return;
      }

      // Count the user's vocabulary entries
      const { count: entryCount, error: countError } = await supabase
        .from('vocab_entry')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (countError) {
        console.error('Error fetching dictionary count:', countError);
        setError('Failed to load dictionary count');
      } else {
        setCount(entryCount || 0);
      }
    } catch (err) {
      console.error('Error in dictionary count hook:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const incrementCount = () => {
    if (count !== null) {
      setCount(count + 1);
    }
  };

  const decrementCount = () => {
    if (count !== null && count > 0) {
      setCount(count - 1);
    }
  };

  const refreshCount = async () => {
    await fetchCount();
  };

  return (
    <DictionaryContext.Provider value={{ count, isLoading, error, incrementCount, decrementCount, refreshCount }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
