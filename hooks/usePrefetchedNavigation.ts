import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface PrefetchOptions {
  showLoadingState?: boolean;
  onLoadingStateChange?: (loading: boolean) => void;
}

export const usePrefetchedNavigation = (options: PrefetchOptions = {}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const { user } = useAuthContext();

  const navigateWithPrefetch = async (path: string) => {
    if (!user) {
      router.push(path);
      return;
    }

    try {
      setIsNavigating(true);
      if (options.onLoadingStateChange) {
        options.onLoadingStateChange(true);
      }

      // Get the appropriate API endpoint based on the path
      const apiEndpoint = getApiEndpointForPath(path);
      
      if (apiEndpoint) {
        // Prefetch the data
        const idToken = await user.getIdToken();
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          console.warn(`Failed to prefetch data for ${path}:`, response.statusText);
        }
      }

      // Navigate to the page
      router.push(path);
    } catch (error) {
      console.error('Error during prefetch navigation:', error);
      // Still navigate even if prefetch fails
      router.push(path);
    } finally {
      // Add a small delay to show loading state
      setTimeout(() => {
        setIsNavigating(false);
        if (options.onLoadingStateChange) {
          options.onLoadingStateChange(false);
        }
      }, 300);
    }
  };

  return {
    navigateWithPrefetch,
    isNavigating
  };
};

// Helper function to map paths to their corresponding API endpoints
const getApiEndpointForPath = (path: string): string | null => {
  const pathToApiMap: Record<string, string> = {
    '/user/dashboard': '/api/user/dashboard',
    '/user/topup-history': '/api/user/topup-history',
    '/user/spending-history': '/api/user/spending-history',
    '/user/account-settings': '/api/user/profile',
    '/admin/dashboard': '/api/admin/dashboard-metrics',
    '/admin/users': '/api/admin/users',
    '/admin/transactions': '/api/admin/transactions',
    '/admin/shop': '/api/admin/skins'
  };

  return pathToApiMap[path] || null;
};