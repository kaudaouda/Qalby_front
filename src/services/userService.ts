import { axiosInstance } from './authService';

export interface UserStats {
  funds_created: number;
  total_funds_amount: number;
  contributions_made: number;
  total_contributed: number;
}

export interface UserProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  username?: string;
  profile_picture?: File | null;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export const userService = {
  /**
   * Récupérer les statistiques de l'utilisateur connecté
   */
  getUserStatistics: async (): Promise<UserStats> => {
    const response = await axiosInstance.get('/api/users/users/statistics/');
    return response.data;
  },

  /**
   * Mettre à jour le profil de l'utilisateur connecté
   */
  updateProfile: async (data: UserProfileUpdate): Promise<any> => {
    const formData = new FormData();
    
    if (data.first_name !== undefined) formData.append('first_name', data.first_name);
    if (data.last_name !== undefined) formData.append('last_name', data.last_name);
    if (data.phone !== undefined) formData.append('phone', data.phone);
    if (data.username !== undefined) formData.append('username', data.username);
    if (data.profile_picture) formData.append('profile_picture', data.profile_picture);

    const response = await axiosInstance.put('/api/users/users/update_profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Changer le mot de passe de l'utilisateur connecté
   */
  changePassword: async (data: ChangePasswordData): Promise<any> => {
    const response = await axiosInstance.post('/api/users/users/change_password/', data);
    return response.data;
  },
};
