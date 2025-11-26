// Country types
export interface Country {
  id: string;
  name: string;
  code: string;
  phone_code: string;
  flag: string;
  currency: string;
  is_active: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string | null;
  profile_picture?: string;
  verified: boolean;
  is_active: boolean;
  date_joined: string;
}

// Fund types
export interface Fund {
  id: string;
  creator: User;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  status: 'open' | 'closed' | 'completed';
  visibility: 'public' | 'private';
  image?: string;
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  days_remaining: number;
}

// Contribution types
export interface Contribution {
  id: string;
  fund: string;
  fund_title: string;
  contributor?: string;
  contributor_email?: string;
  amount: number;
  message?: string;
  payment_method: 'mobile_money' | 'card' | 'cash';
  transaction_id?: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

// Transaction types
export interface Transaction {
  id: string;
  user: string;
  user_email: string;
  contribution?: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  provider: 'orange_money' | 'mtn_money' | 'moov_money' | 'wave' | 'visa';
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  user: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
