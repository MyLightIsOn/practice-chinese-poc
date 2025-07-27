import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useDictionaryCount() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchCount();
  }, []);

  return { count, isLoading, error };
}
