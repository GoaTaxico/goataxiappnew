import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading: userLoading, error: userError } = useQuery(
    'user',
    async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    }
  );

  // Get user profile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery(
    ['profile', user?.id],
    async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Get driver profile if user is a driver
  const { data: driver, isLoading: driverLoading, error: driverError } = useQuery(
    ['driver', user?.id],
    async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    },
    {
      enabled: !!user?.id && profile?.role === 'driver',
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Sign in mutation
  const signInMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('profile');
        queryClient.invalidateQueries('driver');
      },
    }
  );

  // Sign in with Google mutation
  const signInWithGoogleMutation = useMutation(
    async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return data;
    }
  );

  // Sign up mutation
  const signUpMutation = useMutation(
    async ({ email, password, metadata }: { email: string; password: string; metadata: any }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('profile');
      },
    }
  );

  // Sign out mutation
  const signOutMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.clear();
      },
    }
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('No user ID');
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
        queryClient.invalidateQueries('driver');
      },
    }
  );

  return {
    // Data
    user,
    profile,
    driver,
    
    // Loading states
    userLoading,
    profileLoading,
    driverLoading,
    isLoading: userLoading || profileLoading || driverLoading,
    
    // Error states
    userError,
    profileError,
    driverError,
    
    // Mutations
    signInMutation,
    signInWithGoogleMutation,
    signUpMutation,
    signOutMutation,
    updateProfileMutation,
    
    // Convenience methods
    signIn: signInMutation.mutate,
    signInWithGoogle: signInWithGoogleMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    
    // Mutation states
    signInLoading: signInMutation.isLoading,
    signInWithGoogleLoading: signInWithGoogleMutation.isLoading,
    signUpLoading: signUpMutation.isLoading,
    signOutLoading: signOutMutation.isLoading,
    updateProfileLoading: updateProfileMutation.isLoading,
    
    // Mutation errors
    signInError: signInMutation.error,
    signInWithGoogleError: signInWithGoogleMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,
    updateProfileError: updateProfileMutation.error,
  };
}
