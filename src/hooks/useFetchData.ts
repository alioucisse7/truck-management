
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

interface FetchDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// Create a cache to store API responses
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TIMEOUT = 60000; // 1 minute cache validity

export function useFetchData<T>(endpoint: string): FetchDataState<T> {
  const [state, setState] = useState<FetchDataState<T>>({
    data: [],
    loading: true,
    error: null,
  });
  
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    const fetchData = async () => {
      try {
        // Check if we have a valid cached response
        const now = Date.now();
        if (apiCache[endpoint] && (now - apiCache[endpoint].timestamp) < CACHE_TIMEOUT) {
          if (isMountedRef.current) {
            setState({
              data: apiCache[endpoint].data,
              loading: false,
              error: null,
            });
          }
          return;
        }
        
        // If not in cache or expired, fetch from API
        setState(prev => ({ ...prev, loading: true }));
        const response = await api.get(endpoint);
        
        // Cache the response
        apiCache[endpoint] = {
          data: response.data,
          timestamp: now
        };
        
        if (isMountedRef.current) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMountedRef.current) {
          setState({
            data: [],
            loading: false,
            error: 'Failed to fetch data',
          });
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [endpoint]);

  return state;
}
