export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/users/register/',
  LOGIN: '/api/users/login/',
  LOGOUT: '/api/users/logout/',

  // Users
  USERS: '/api/users/',
  USER_ME: '/api/users/me/',
  USER_PROFILE: '/api/users/update_profile/',
  CHANGE_PASSWORD: '/api/users/change_password/',

  // Funds
  FUNDS: '/api/funds/',
  FUND_DETAIL: (id: string) => `/api/funds/${id}/`,
  FUND_STATISTICS: (id: string) => `/api/funds/${id}/statistics/`,
  FUND_CONTRIBUTIONS: (id: string) => `/api/funds/${id}/contributions/`,
  FUND_CONTRIBUTORS: (id: string) => `/api/funds/${id}/contributors/`,
  MY_FUNDS: '/api/funds/my_funds/',

  // Contributions
  CONTRIBUTIONS: '/api/contributions/',
  MY_CONTRIBUTIONS: '/api/contributions/my_contributions/',

  // Transactions
  TRANSACTIONS: '/api/transactions/',
  TRANSACTION_SUMMARY: '/api/transactions/summary/',

  // Notifications
  NOTIFICATIONS: '/api/notifications/',
  MARK_READ: '/api/notifications/:id/mark_read/',
  MARK_ALL_READ: '/api/notifications/mark_all_read/',
  UNREAD_COUNT: '/api/notifications/unread_count/',
};
