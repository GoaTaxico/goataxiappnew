import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  isSupported: boolean;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isOnline: false, // Start with false to avoid hydration mismatch
    hasUpdate: false,
    isSupported: false, // Start with false to avoid hydration mismatch
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
    // Update state with actual browser values after hydration
    setState(prev => ({
      ...prev,
      isOnline: navigator.onLine,
      isSupported: 'serviceWorker' in navigator && 'PushManager' in window,
    }));
  }, []);

  // Update the app
  const updateApp = useCallback(() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  // Show update notification
  const showUpdateNotification = useCallback(() => {
    toast(
      (t) => (
        <div className="flex items-center space-x-3">
          <span>New version available!</span>
          <button
            onClick={() => {
              updateApp();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      ),
      { duration: 10000 }
    );
  }, [updateApp]);

  // Check if app is installed
  const checkInstallation = useCallback(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      setState(prev => ({ ...prev, isInstalled }));
    }
  }, [isHydrated]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!state.isSupported || !isHydrated) return;

    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      setRegistration(reg);

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, hasUpdate: true }));
              showUpdateNotification();
            }
          });
        }
      });

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({ ...prev, hasUpdate: false }));
        toast.success('App updated successfully!');
      });

      console.log('Service Worker registered:', reg);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, [state.isSupported, showUpdateNotification, isHydrated]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!state.isSupported || !isHydrated) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [state.isSupported, isHydrated]);

  // Send push notification
  const sendPushNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!state.isSupported || Notification.permission !== 'granted' || !isHydrated) return false;

    try {
      const notification = new Notification(title, {
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        ...options,
      } as NotificationOptions & { vibrate?: number[] });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }, [state.isSupported, isHydrated]);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    if (!state.isSupported || !registration || !isHydrated) return null;

    try {
      const permission = await requestNotificationPermission();
      if (!permission) return null;

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error('VAPID public key not found');
        return null;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }, [state.isSupported, registration, requestNotificationPermission, isHydrated]);

  // Install PWA
  const installPWA = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).deferredPrompt && isHydrated) {
      (window as any).deferredPrompt.prompt();
      (window as any).deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setState(prev => ({ ...prev, isInstalled: true }));
          toast.success('App installed successfully!');
        }
        (window as any).deferredPrompt = null;
      });
    }
  }, [isHydrated]);

  // Handle online/offline status
  useEffect(() => {
    if (!isHydrated) return;

    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isHydrated]);

  // Handle beforeinstallprompt event
  useEffect(() => {
    if (!isHydrated) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isHydrated]);

  // Initialize PWA
  useEffect(() => {
    if (!isHydrated) return;
    
    checkInstallation();
    registerServiceWorker();
  }, [checkInstallation, registerServiceWorker, isHydrated]);

  return {
    ...state,
    registration,
    updateApp,
    requestNotificationPermission,
    sendPushNotification,
    subscribeToPushNotifications,
    installPWA,
    isHydrated,
  };
}

// Hook for background sync
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setIsSupported('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype);
  }, []);

  // Background sync is not widely supported, commenting out for now
  // const registerBackgroundSync = useCallback(async (tag: string) => {
  //   if (!isSupported) return false;

  //   try {
  //     const registration = await navigator.serviceWorker.ready;
  //     await registration.sync.register(tag);
  //     return true;
  //   } catch (error) {
  //     console.error('Error registering background sync:', error);
  //     return false;
  //   }
  // }, [isSupported]);

  return {
    isSupported,
    isHydrated,
    // registerBackgroundSync,
  };
}

// Hook for offline storage
export function useOfflineStorage() {
  const [isSupported, setIsSupported] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setIsSupported('indexedDB' in window);
  }, []);

  const storeData = useCallback(async (key: string, data: any) => {
    if (!isSupported || !isHydrated) return false;

    try {
      const db = await openDB('goa-taxi-offline', 1, (db) => {
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'key' });
        }
      });

      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      const request = store.put({ key, data, timestamp: Date.now() });
      
      return new Promise<boolean>((resolve, reject) => {
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error storing data offline:', error);
      return false;
    }
  }, [isSupported, isHydrated]);

  const getData = useCallback(async (key: string) => {
    if (!isSupported || !isHydrated) return null;

    try {
      const db = await openDB('goa-taxi-offline', 1);
      const transaction = db.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');
      const request = store.get(key);
      
      return new Promise<any>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  }, [isSupported, isHydrated]);

  const clearData = useCallback(async (key?: string) => {
    if (!isSupported || !isHydrated) return false;

    try {
      const db = await openDB('goa-taxi-offline', 1);
      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      
      if (key) {
        const request = store.delete(key);
        return new Promise<boolean>((resolve, reject) => {
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        });
      } else {
        const request = store.clear();
        return new Promise<boolean>((resolve, reject) => {
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  }, [isSupported, isHydrated]);

  return {
    isSupported,
    isHydrated,
    storeData,
    getData,
    clearData,
  };
}

// Helper function to open IndexedDB
async function openDB(name: string, version: number, upgradeCallback?: (db: IDBDatabase) => void): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      if (upgradeCallback) {
        upgradeCallback(request.result);
      }
    };
  });
}
