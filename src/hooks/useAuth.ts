import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        loading: false,
        error: null,
      });
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        setState({
          user: null,
          loading: false,
          error: 'Neplatné přihlašovací údaje',
        });
        return false;
      }

      // Simple password check (in production, use proper hashing)
      if (data.password_hash !== password) {
        setState({
          user: null,
          loading: false,
          error: 'Neplatné přihlašovací údaje',
        });
        return false;
      }

      const user: User = {
        id: data.id,
        username: data.username,
        created_at: data.created_at,
      };

      localStorage.setItem('user', JSON.stringify(user));
      setState({
        user,
        loading: false,
        error: null,
      });
      return true;
    } catch {
      setState({
        user: null,
        loading: false,
        error: 'Chyba při přihlašování',
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setState({
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    logout,
    isAuthenticated: !!state.user,
  };
}
