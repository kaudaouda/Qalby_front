import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Fund, FundDetail, FundStatistics, Contributor, Contribution } from '../types';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fundService = {
  /**
   * Récupérer la liste des cagnottes
   */
  async getFunds(params?: {
    category?: string;
    status?: string;
    creator?: string;
    page?: number;
  }) {
    const response = await axiosInstance.get(API_ENDPOINTS.FUNDS, { params });
    return response.data;
  },

  /**
   * Récupérer les détails d'une cagnotte
   */
  async getFundDetail(id: string): Promise<FundDetail> {
    const response = await axiosInstance.get(API_ENDPOINTS.FUND_DETAIL(id));
    return response.data;
  },

  /**
   * Récupérer les statistiques d'une cagnotte
   */
  async getFundStatistics(id: string): Promise<FundStatistics> {
    const response = await axiosInstance.get(API_ENDPOINTS.FUND_STATISTICS(id));
    return response.data;
  },

  /**
   * Récupérer les contributions d'une cagnotte
   */
  async getFundContributions(id: string, page?: number) {
    const response = await axiosInstance.get(API_ENDPOINTS.FUND_CONTRIBUTIONS(id), {
      params: { page },
    });
    return response.data;
  },

  /**
   * Récupérer les contributeurs d'une cagnotte
   */
  async getFundContributors(id: string): Promise<Contributor[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.FUND_CONTRIBUTORS(id));
    return response.data;
  },

  /**
   * Récupérer mes cagnottes
   */
  async getMyFunds(): Promise<Fund[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.MY_FUNDS);
    return response.data;
  },

  /**
   * Créer une nouvelle cagnotte
   */
  async createFund(fundData: {
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    start_date: string;
    end_date: string;
    visibility: 'public' | 'private';
    image?: File;
  }) {
    const formData = new FormData();
    formData.append('title', fundData.title);
    formData.append('description', fundData.description);
    formData.append('category', fundData.category);
    formData.append('goal_amount', fundData.goal_amount.toString());
    formData.append('start_date', fundData.start_date);
    formData.append('end_date', fundData.end_date);
    formData.append('visibility', fundData.visibility);
    if (fundData.image) {
      formData.append('image', fundData.image);
    }

    const response = await axiosInstance.post(API_ENDPOINTS.FUNDS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Mettre à jour une cagnotte
   */
  async updateFund(id: string, fundData: Partial<{
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    end_date: string;
    status: 'open' | 'closed' | 'completed';
    visibility: 'public' | 'private';
    image?: File;
  }>) {
    const formData = new FormData();
    Object.entries(fundData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'image') {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await axiosInstance.patch(API_ENDPOINTS.FUND_DETAIL(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Supprimer une cagnotte
   */
  async deleteFund(id: string) {
    const response = await axiosInstance.delete(API_ENDPOINTS.FUND_DETAIL(id));
    return response.data;
  },
};


