import type { Transaction } from "./decision-engine"

export interface MLFeatures {
  // Amount features
  amount_log: number
  amount_zscore: number
  amount_percentile: number

  // Time features
  hour_of_day: number
  day_of_week: number
  is_weekend: number
  is_night: number

  // Geographic features
  country_risk_score: number
  currency_mismatch: number

  // Behavioral features
  user_transaction_count: number
  user_avg_amount: number
  amount_deviation_from_user_avg: number
  merchant_category_encoded: number

  // Velocity features
  transactions_last_hour: number
  amount_last_hour: number
  ip_transactions_last_hour: number

  // Email features
  email_domain_risk: number
  email_length: number
  email_has_numbers: number
}

export class MLFraudModel {
  private userStats: Map<string, { totalAmount: number; transactionCount: number; avgAmount: number }> = new Map()
  private globalStats = { totalAmount: 0, transactionCount: 0, amounts: [] as number[] }
  private countryRiskScores: Record<string, number> = {
    US: 0.1,
    CA: 0.15,
    GB: 0.2,
    DE: 0.2,
    FR: 0.25,
    BR: 0.4,
    MX: 0.45,
    XX: 0.9, // High risk
    YY: 0.85,
    ZZ: 0.8,
  }
  private merchantCategoryScores: Record<string, number> = {
    retail: 0.1,
    food: 0.15,
    gas: 0.2,
    online: 0.3,
    travel: 0.35,
    entertainment: 0.4,
    gambling: 0.8,
    adult: 0.75,
    crypto: 0.7,
  }
  private emailDomainRisks: Record<string, number> = {
    "gmail.com": 0.1,
    "yahoo.com": 0.2,
    "hotmail.com": 0.25,
    "outlook.com": 0.2,
    "tempmail.com": 0.9,
    "10minutemail.com": 0.95,
    "guerrillamail.com": 0.9,
    "mailinator.com": 0.85,
  }

  extractFeatures(
    transaction: Transaction,
    userHistory: Transaction[],
    ipHistory: Transaction[],
    timestamp: Date,
  ): MLFeatures {
    // Update global stats
    this.updateGlobalStats(transaction)

    // Update user stats
    this.updateUserStats(transaction)

    const userStat = this.userStats.get(transaction.user_id) || { totalAmount: 0, transactionCount: 0, avgAmount: 0 }

    // Time features
    const hour = timestamp.getHours()
    const dayOfWeek = timestamp.getDay()

    // Recent transaction counts
    const oneHourAgo = new Date(timestamp.getTime() - 60 * 60 * 1000)
    const recentUserTransactions = userHistory.filter((t) => new Date(t.timestamp || 0) > oneHourAgo)
    const recentIpTransactions = ipHistory.filter((t) => new Date(t.timestamp || 0) > oneHourAgo)

    // Amount statistics
    const amountLog = Math.log(transaction.amount + 1)
    const amountZScore = this.calculateZScore(transaction.amount, this.globalStats.amounts)
    const amountPercentile = this.calculatePercentile(transaction.amount, this.globalStats.amounts)

    // Email features
    const emailDomain = transaction.email.split("@")[1]?.toLowerCase() || ""
    const emailLength = transaction.email.length
    const emailHasNumbers = /\d/.test(transaction.email) ? 1 : 0

    return {
      // Amount features
      amount_log: amountLog,
      amount_zscore: amountZScore,
      amount_percentile: amountPercentile,

      // Time features
      hour_of_day: hour / 24, // Normalize to 0-1
      day_of_week: dayOfWeek / 7, // Normalize to 0-1
      is_weekend: dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0,
      is_night: hour >= 22 || hour <= 6 ? 1 : 0,

      // Geographic features
      country_risk_score: this.countryRiskScores[transaction.billing_address.country] || 0.5,
      currency_mismatch: this.checkCurrencyMismatch(transaction) ? 1 : 0,

      // Behavioral features
      user_transaction_count: Math.log(userStat.transactionCount + 1),
      user_avg_amount: Math.log(userStat.avgAmount + 1),
      amount_deviation_from_user_avg:
        userStat.avgAmount > 0 ? Math.abs(transaction.amount - userStat.avgAmount) / userStat.avgAmount : 0,
      merchant_category_encoded: this.merchantCategoryScores[transaction.merchant_category] || 0.5,

      // Velocity features
      transactions_last_hour: Math.log(recentUserTransactions.length + 1),
      amount_last_hour: Math.log(recentUserTransactions.reduce((sum, t) => sum + t.amount, 0) + 1),
      ip_transactions_last_hour: Math.log(recentIpTransactions.length + 1),

      // Email features
      email_domain_risk: this.emailDomainRisks[emailDomain] || 0.3,
      email_length: Math.min(emailLength / 50, 1), // Normalize, cap at 50
      email_has_numbers: emailHasNumbers,
    }
  }

  // Simplified ML model using weighted features
  predictFraudScore(features: MLFeatures): number {
    // Feature weights (would be learned from training data in real ML model)
    const weights = {
      amount_log: 0.15,
      amount_zscore: 0.12,
      amount_percentile: 0.08,
      hour_of_day: 0.05,
      day_of_week: 0.03,
      is_weekend: 0.04,
      is_night: 0.06,
      country_risk_score: 0.18,
      currency_mismatch: 0.08,
      user_transaction_count: -0.05, // More transactions = less risky
      user_avg_amount: 0.02,
      amount_deviation_from_user_avg: 0.12,
      merchant_category_encoded: 0.1,
      transactions_last_hour: 0.15,
      amount_last_hour: 0.1,
      ip_transactions_last_hour: 0.08,
      email_domain_risk: 0.14,
      email_length: 0.02,
      email_has_numbers: 0.03,
    }

    let score = 0
    let totalWeight = 0

    // Calculate weighted score
    for (const [feature, weight] of Object.entries(weights)) {
      const featureValue = features[feature as keyof MLFeatures]
      score += featureValue * weight
      totalWeight += Math.abs(weight)
    }

    // Normalize score
    score = score / totalWeight

    // Apply sigmoid function to get probability between 0 and 1
    const sigmoidScore = 1 / (1 + Math.exp(-score * 10))

    // Add some randomness to simulate model uncertainty
    const uncertainty = (Math.random() - 0.5) * 0.1
    const finalScore = Math.max(0, Math.min(1, sigmoidScore + uncertainty))

    return finalScore
  }

  private updateGlobalStats(transaction: Transaction) {
    this.globalStats.totalAmount += transaction.amount
    this.globalStats.transactionCount += 1
    this.globalStats.amounts.push(transaction.amount)

    // Keep only last 10000 amounts for memory efficiency
    if (this.globalStats.amounts.length > 10000) {
      this.globalStats.amounts = this.globalStats.amounts.slice(-10000)
    }
  }

  private updateUserStats(transaction: Transaction) {
    const userId = transaction.user_id
    const existing = this.userStats.get(userId) || { totalAmount: 0, transactionCount: 0, avgAmount: 0 }

    existing.totalAmount += transaction.amount
    existing.transactionCount += 1
    existing.avgAmount = existing.totalAmount / existing.transactionCount

    this.userStats.set(userId, existing)
  }

  private calculateZScore(value: number, dataset: number[]): number {
    if (dataset.length === 0) return 0

    const mean = dataset.reduce((sum, val) => sum + val, 0) / dataset.length
    const variance = dataset.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataset.length
    const stdDev = Math.sqrt(variance)

    return stdDev > 0 ? (value - mean) / stdDev : 0
  }

  private calculatePercentile(value: number, dataset: number[]): number {
    if (dataset.length === 0) return 0.5

    const sorted = [...dataset].sort((a, b) => a - b)
    const index = sorted.findIndex((val) => val >= value)

    return index === -1 ? 1 : index / sorted.length
  }

  private checkCurrencyMismatch(transaction: Transaction): boolean {
    const countryCurrencyMap: Record<string, string[]> = {
      US: ["USD"],
      CA: ["CAD", "USD"],
      BR: ["BRL"],
      GB: ["GBP"],
      DE: ["EUR"],
      FR: ["EUR"],
    }

    const expectedCurrencies = countryCurrencyMap[transaction.billing_address.country]
    return expectedCurrencies ? !expectedCurrencies.includes(transaction.currency) : false
  }

  getModelStats() {
    return {
      totalTransactions: this.globalStats.transactionCount,
      totalAmount: this.globalStats.totalAmount,
      uniqueUsers: this.userStats.size,
      avgTransactionAmount:
        this.globalStats.transactionCount > 0 ? this.globalStats.totalAmount / this.globalStats.transactionCount : 0,
      amountDataPoints: this.globalStats.amounts.length,
    }
  }

  // Method to get feature importance (for explainability)
  getFeatureImportance(): Record<string, number> {
    return {
      country_risk_score: 0.18,
      amount_log: 0.15,
      transactions_last_hour: 0.15,
      email_domain_risk: 0.14,
      amount_zscore: 0.12,
      amount_deviation_from_user_avg: 0.12,
      merchant_category_encoded: 0.1,
      amount_last_hour: 0.1,
      // ... other features
    }
  }
}
