import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PaymentInitiationData {
  fund_id: string;
  amount: number;
  phone: string;
  provider: 'orange_money' | 'mtn_money' | 'moov_money' | 'wave';
  message?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  contribution_id: string;
  transaction_id: string;
  reference: string;
  status: 'pending' | 'success' | 'failed';
  message: string;
  ussd_code?: string;
  phone?: string;
  provider?: string;
  amount?: string;
}

export interface PaymentConfirmationData {
  transaction_id: string;
  reference: string;
  action: 'confirm' | 'cancel';
}

export interface PaymentStatusResponse {
  status: 'pending' | 'success' | 'failed';
  contribution_id: string;
  amount: string;
  fund_title: string;
}

export const paymentService = {
  /**
   * Initie un paiement Mobile Money
   */
  async initiatePayment(data: PaymentInitiationData): Promise<PaymentInitiationResponse> {
    const response = await axiosInstance.post('/api/contributions/initiate_payment/', data);
    return response.data;
  },

  /**
   * Confirme ou annule un paiement
   */
  async confirmPayment(data: PaymentConfirmationData) {
    const response = await axiosInstance.post('/api/contributions/confirm_payment/', data);
    return response.data;
  },

  /**
   * Vérifie le statut d'un paiement
   */
  async checkPaymentStatus(transactionId: string, reference: string): Promise<PaymentStatusResponse> {
    const response = await axiosInstance.get('/api/contributions/check_payment_status/', {
      params: {
        transaction_id: transactionId,
        reference: reference,
      },
    });
    return response.data;
  },
};

