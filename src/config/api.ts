export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

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
