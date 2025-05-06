
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T>(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async (promise: Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await promise;
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }
      
      options.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      
      if (options.errorMessage || errorMsg) {
        toast({
          variant: "destructive",
          title: "Error",
          description: options.errorMessage || errorMsg,
        });
      }
      
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options, toast]);

  return { execute, loading, error };
}
