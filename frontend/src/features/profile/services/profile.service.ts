import { ApiClient } from '@/lib/api-client';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
  jobTitle?: string;
  bio?: string;
  roles?: string[];
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return ApiClient.get<UserProfile>('/profile');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<{ message: string; user: UserProfile }> {
    return ApiClient.put<{ message: string; user: UserProfile }>('/profile', data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return ApiClient.put<{ message: string }>('/profile/password', { currentPassword, newPassword });
  },

  async uploadAvatar(file: File): Promise<{ key: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'users');
    formData.append('type', 'users');

    const storageRes = await ApiClient.post<{ key: string; url: string }>('/storage/upload', formData);
    const avatarUrl = `/storage/view?key=${encodeURIComponent(storageRes.key)}`;

    await ApiClient.put<{ message: string; user: UserProfile }>('/profile', { avatarUrl });
    return { key: storageRes.key, url: storageRes.url || avatarUrl };
  },

  async removeAvatar(currentAvatarUrl?: string | null): Promise<void> {
    if (currentAvatarUrl?.includes('key=')) {
      try {
        const match = currentAvatarUrl.match(/key=([^&]+)/);
        if (match && match[1]) {
          const key = decodeURIComponent(match[1]);
          await ApiClient.delete(`/storage?key=${encodeURIComponent(key)}`);
        }
      } catch {
        // Ignored
      }
    }
    await ApiClient.put<{ message: string; user: UserProfile }>('/profile', { avatarUrl: null });
  },
};

