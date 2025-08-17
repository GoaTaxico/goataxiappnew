import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useFavorites(userId?: string) {
  const { data: favorites, isLoading, error, refetch } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          driver:drivers(
            *,
            profile:profiles(
              id,
              full_name,
              phone,
              whatsapp,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    favorites: favorites || [],
    isLoading,
    error,
    refetch,
  };
}

export function useFavoriteActions() {
  const queryClient = useQueryClient();

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async ({ userId, driverId }: { userId: string; driverId: string }) => {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          driver_id: driverId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async ({ userId, driverId }: { userId: string; driverId: string }) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('driver_id', driverId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Check if driver is favorited
  const checkIsFavoritedMutation = useMutation({
    mutationFn: async ({ userId, driverId }: { userId: string; driverId: string }) => {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('driver_id', driverId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return !!data;
    },
  });

  return {
    // Mutations
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    checkIsFavorited: checkIsFavoritedMutation.mutate,
    
    // Loading states
    addLoading: addToFavoritesMutation.isPending,
    removeLoading: removeFromFavoritesMutation.isPending,
    checkLoading: checkIsFavoritedMutation.isPending,
    
    // Error states
    addError: addToFavoritesMutation.error,
    removeError: removeFromFavoritesMutation.error,
    checkError: checkIsFavoritedMutation.error,
  };
}
