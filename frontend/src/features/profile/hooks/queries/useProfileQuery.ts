import { useQuery } from '@tanstack/react-query';
import { profileService, type UserProfile } from '../../services';
import { useAuthStore } from '@/shared/hooks/store/useAuthStore';

export type { UserProfile };

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfileQuery() {
  const updateUser = useAuthStore((state) => state.updateUser);

  const {
    data = null,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<UserProfile, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const profile = await profileService.getProfile();
      updateUser(profile);
      return profile;
    },
    staleTime: 1000 * 60 * 5,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar el perfil del usuario'
    : '';

  return {
    data,
    loading: isLoading,
    isFetching,
    error,
    refetch: async () => {
      await refetch();
    },
    setData: (updated: UserProfile | null) => {
      if (updated) updateUser(updated);
    },
  };
}
