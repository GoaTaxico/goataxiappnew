import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'driver' | 'system';
  data: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationCount {
  total: number;
  unread: number;
}

// Fetch notifications for a user
export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!userId,
  });
};

// Fetch unread notifications count
export const useUnreadNotificationsCount = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count', userId],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    },
    enabled: !!userId,
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, notificationId) => {
      // Update the specific notification in cache
      queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        );
      });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Update all notifications in cache
      queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map(notification => ({ ...notification, is_read: true }));
      });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', error);
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, notificationId) => {
      // Remove the notification from cache
      queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.filter(notification => notification.id !== notificationId);
      });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      
      toast.success('Notification deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', error);
    },
  });
};

// Send notification (admin function)
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      title,
      message,
      type = 'system',
      data = {}
    }: {
      userId: string;
      title: string;
      message: string;
      type?: 'booking' | 'driver' | 'system';
      data?: any;
    }): Promise<void> => {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          data,
          is_read: false
        });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, { userId }) => {
      // Invalidate notifications for the user
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', userId] });
      
      toast.success('Notification sent successfully');
    },
    onError: (error) => {
      toast.error('Failed to send notification');
      console.error('Error sending notification:', error);
    },
  });
};

// Get notification statistics
export const useNotificationStats = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', 'stats', userId],
    queryFn: async (): Promise<NotificationCount> => {
      // Get total count
      const { count: total, error: totalError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (totalError) {
        throw new Error(totalError.message);
      }

      // Get unread count
      const { count: unread, error: unreadError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (unreadError) {
        throw new Error(unreadError.message);
      }

      return {
        total: total || 0,
        unread: unread || 0
      };
    },
    enabled: !!userId,
  });
};
