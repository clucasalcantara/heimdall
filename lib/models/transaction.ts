import type { ObjectId } from "mongodb";

// Base transaction interface
export interface TransactionDocument {
  _id?: ObjectId;
  transaction_id: string;
  user_id: string;
  amount: number;
  currency: string;
  merchant_id: string;
  merchant_category: string;
  email: string;
  ip_address: string;
  billing_address: {
    country: string;
    city: string;
    postal_code?: string;
    street?: string;
  };
  payment_method: {
    type: string;
    last_four: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
  };
  device_info?: {
    user_agent?: string;
    screen_resolution?: string;
    timezone?: string;
    language?: string;
  };
  timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

// Fraud analysis result
export interface FraudAnalysisDocument {
  _id?: ObjectId;
  transaction_id: string;
  overall_score: number;
  ml_score: number;
  rule_score: number;
  risk_level: "Low" | "Medium" | "High" | "Critical";
  recommendation: "Approve" | "Review" | "Decline";
  confidence: number;
  processing_time_ms: number;
  explanation: string;

  // Triggered rules
  triggered_rules: string[];
  rule_details: Array<{
    rule_name: string;
    triggered: boolean;
    score: number;
    severity: "low" | "medium" | "high" | "critical";
    category: string;
    reason: string;
  }>;

  // ML features
  features: Array<{
    name: string;
    value: number | string;
    importance: number;
  }>;

  // Model versions for tracking
  ml_model_version: string;
  rules_engine_version: string;

  created_at: Date;
}

// User behavior tracking
export interface UserBehaviorDocument {
  _id?: ObjectId;
  user_id: string;
  total_transactions: number;
  total_amount: number;
  avg_amount: number;
  first_transaction: Date;
  last_transaction: Date;
  countries_used: string[];
  merchants_used: string[];
  payment_methods_used: string[];
  fraud_score_history: Array<{
    score: number;
    timestamp: Date;
  }>;
  risk_flags: string[];
  created_at: Date;
  updated_at: Date;
}

// IP address tracking
export interface IPBehaviorDocument {
  _id?: ObjectId;
  ip_address: string;
  total_transactions: number;
  unique_users: number;
  countries: string[];
  avg_risk_score: number;
  first_seen: Date;
  last_seen: Date;
  is_blacklisted: boolean;
  blacklist_reason?: string;
  created_at: Date;
  updated_at: Date;
}

// System statistics for dashboard
export interface SystemStatsDocument {
  _id?: ObjectId;
  date: Date; // Daily stats
  total_transactions: number;
  approved_count: number;
  reviewed_count: number;
  declined_count: number;
  fraud_rate: number;
  avg_processing_time_ms: number;
  accuracy: number;

  // Risk distribution
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };

  // Geographic stats
  top_countries: Array<{
    country: string;
    transaction_count: number;
    avg_risk_score: number;
  }>;

  // Performance metrics
  api_response_times: {
    p50: number;
    p95: number;
    p99: number;
  };

  created_at: Date;
}

// Feedback for model improvement
export interface FeedbackDocument {
  _id?: ObjectId;
  transaction_id: string;
  actual_fraud: boolean;
  predicted_fraud: boolean;
  feedback_type:
    | "false_positive"
    | "false_negative"
    | "true_positive"
    | "true_negative";
  notes?: string;
  reviewer_id?: string;
  created_at: Date;
}

// Rule configuration
export interface RuleConfigDocument {
  _id?: ObjectId;
  rule_name: string;
  rule_type: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  conditions: Record<string, any>;
  action: "flag" | "review" | "decline";
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

// Indexes for optimal performance
export const COLLECTION_INDEXES = {
  transactions: [
    { key: { transaction_id: 1 }, unique: true },
    { key: { user_id: 1, timestamp: -1 } },
    { key: { ip_address: 1, timestamp: -1 } },
    { key: { timestamp: -1 } },
    { key: { "billing_address.country": 1, timestamp: -1 } },
    { key: { merchant_id: 1, timestamp: -1 } },
    { key: { amount: 1, timestamp: -1 } },
  ],

  fraud_analysis: [
    { key: { transaction_id: 1 }, unique: true },
    { key: { risk_level: 1, created_at: -1 } },
    { key: { recommendation: 1, created_at: -1 } },
    { key: { overall_score: -1, created_at: -1 } },
    { key: { created_at: -1 } },
  ],

  user_behavior: [
    { key: { user_id: 1 }, unique: true },
    { key: { last_transaction: -1 } },
    { key: { total_transactions: -1 } },
    { key: { avg_amount: -1 } },
  ],

  ip_behavior: [
    { key: { ip_address: 1 }, unique: true },
    { key: { is_blacklisted: 1 } },
    { key: { avg_risk_score: -1 } },
    { key: { last_seen: -1 } },
  ],

  system_stats: [
    { key: { date: -1 }, unique: true },
    { key: { created_at: -1 } },
  ],

  feedback: [
    { key: { transaction_id: 1 } },
    { key: { feedback_type: 1, created_at: -1 } },
    { key: { created_at: -1 } },
  ],

  rule_config: [
    { key: { rule_name: 1 }, unique: true },
    { key: { enabled: 1 } },
    { key: { rule_type: 1 } },
  ],
};
