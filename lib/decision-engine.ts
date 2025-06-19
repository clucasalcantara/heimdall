import { v4 as uuidv4 } from "uuid"
import { FraudRulesEngine, type RuleResult } from "./fraud-rules"
import { MLFraudModel } from "./ml-model"

export interface Transaction {
  id?: string
  user_id: string
  amount: number
  currency: string
  merchant_id: string
  merchant_category: string
  email: string
  ip_address: string
  billing_address: {
    country: string
    city: string
  }
  payment_method: {
    type: string
    last_four: string
  }
  timestamp?: string
}

export interface FraudAnalysis {
  transaction_id: string
  overall_score: number
  ml_score: number
  rule_score: number
  risk_level: string
  triggered_rules: string[]
  rule_details: RuleResult[]
  features: Array<{
    name: string
    value: number | string
    importance: number
  }>
  recommendation: string
  confidence: number
  processing_time_ms: number
  explanation: string
}

export interface SystemStats {
  total_transactions: number
  fraud_rate: number
  accuracy: number
  avg_processing_time_ms: number
  risk_distribution: {
    low: number
    medium: number
    high: number
    critical: number
  }
  rule_stats: any
  ml_stats: any
}

export interface ProcessedTransaction extends Transaction, FraudAnalysis {}

class DecisionEngine {
  private stats = {
    totalTransactions: 0,
    fraudDetected: 0,
    processingTimes: [] as number[],
    riskCounts: { low: 0, medium: 0, high: 0, critical: 0 },
  }

  private rulesEngine = new FraudRulesEngine()
  private mlModel = new MLFraudModel()
  private transactionHistory: Map<string, Transaction[]> = new Map()
  private ipHistory: Map<string, Transaction[]> = new Map()

  // Store processed transactions for dashboard
  private processedTransactions: ProcessedTransaction[] = []
  private countryStats: Map<string, { totalTransactions: number; riskSum: number }> = new Map()

  async analyzeTransaction(transaction: Transaction): Promise<FraudAnalysis> {
    const startTime = Date.now()

    // Generate transaction ID if not provided
    if (!transaction.id) {
      transaction.id = uuidv4()
    }

    // Add timestamp if not provided
    if (!transaction.timestamp) {
      transaction.timestamp = new Date().toISOString()
    }

    const timestamp = new Date(transaction.timestamp)

    // Store transaction for historical analysis
    this.storeTransactionHistory(transaction)

    // Get historical data for this user and IP
    const userHistory = this.transactionHistory.get(transaction.user_id) || []
    const ipHistory = this.ipHistory.get(transaction.ip_address) || []

    // 1. Run rules engine
    const ruleResults = this.rulesEngine.analyzeTransaction(transaction)
    const triggeredRules = ruleResults.filter((r) => r.triggered)

    // Calculate rule-based score
    const ruleScore = this.calculateRuleScore(ruleResults)

    // 2. Run ML model
    const mlFeatures = this.mlModel.extractFeatures(transaction, userHistory, ipHistory, timestamp)
    const mlScore = this.mlModel.predictFraudScore(mlFeatures)

    // 3. Combine scores (weighted average)
    const ruleWeight = 0.4
    const mlWeight = 0.6
    const overallScore = ruleScore * ruleWeight + mlScore * mlWeight

    // 4. Determine risk level
    const riskLevel = this.determineRiskLevel(overallScore)

    // 5. Make recommendation
    const recommendation = this.makeRecommendation(overallScore, riskLevel, triggeredRules)

    // 6. Calculate confidence
    const confidence = this.calculateConfidence(ruleScore, mlScore, triggeredRules.length)

    // 7. Generate explanation
    const explanation = this.generateExplanation(overallScore, triggeredRules, mlFeatures)

    // 8. Prepare feature importance for response
    const featureImportance = this.mlModel.getFeatureImportance()
    const topFeatures = Object.entries(mlFeatures)
      .map(([name, value]) => ({
        name,
        value,
        importance: featureImportance[name] || 0,
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10)

    const processingTime = Date.now() - startTime

    const analysis: FraudAnalysis = {
      transaction_id: transaction.id,
      overall_score: Math.min(overallScore, 1.0),
      ml_score: mlScore,
      rule_score: ruleScore,
      risk_level: riskLevel,
      triggered_rules: triggeredRules.map((r) => r.ruleName),
      rule_details: triggeredRules,
      features: topFeatures,
      recommendation,
      confidence,
      processing_time_ms: processingTime,
      explanation,
    }

    // Store processed transaction for dashboard
    const processedTransaction: ProcessedTransaction = {
      ...transaction,
      ...analysis,
    }

    this.processedTransactions.unshift(processedTransaction) // Add to beginning

    // Keep only last 1000 transactions
    if (this.processedTransactions.length > 1000) {
      this.processedTransactions = this.processedTransactions.slice(0, 1000)
    }

    // Update country stats
    this.updateCountryStats(transaction.billing_address.country, overallScore)

    // Update stats
    this.updateStats(overallScore, riskLevel, recommendation, processingTime)

    return analysis
  }

  private updateCountryStats(country: string, riskScore: number) {
    if (!this.countryStats.has(country)) {
      this.countryStats.set(country, { totalTransactions: 0, riskSum: 0 })
    }
    const stats = this.countryStats.get(country)!
    stats.totalTransactions++
    stats.riskSum += riskScore * 100 // Convert to percentage
  }

  getProcessedTransactions(limit = 50): ProcessedTransaction[] {
    return this.processedTransactions.slice(0, limit)
  }

  getCountryStats() {
    const countryNames: Record<string, string> = {
      US: "United States",
      CA: "Canada",
      GB: "United Kingdom",
      DE: "Germany",
      FR: "France",
      BR: "Brazil",
      MX: "Mexico",
      NG: "Nigeria",
      UA: "Ukraine",
      ID: "Indonesia",
      VN: "Vietnam",
      CN: "China",
      RU: "Russia",
      IN: "India",
      PK: "Pakistan",
      BD: "Bangladesh",
    }

    return Array.from(this.countryStats.entries())
      .map(([country, stats]) => ({
        name: countryNames[country] || country,
        value: Math.round(stats.riskSum / stats.totalTransactions),
        transactions: stats.totalTransactions,
      }))
      .filter((country) => country.transactions >= 3) // Only show countries with enough data
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }

  // Generate sample transactions for demo purposes
  async generateSampleTransaction(): Promise<ProcessedTransaction> {
    const countries = ["US", "CA", "GB", "DE", "FR", "BR", "MX", "NG", "UA", "ID", "VN", "CN", "RU", "IN"]
    const merchants = ["amazon", "walmart", "target", "bestbuy", "ebay", "shopify", "stripe", "paypal"]
    const categories = ["retail", "food", "gas", "online", "travel", "entertainment", "subscription", "gaming"]
    const cities = ["New York", "London", "Paris", "Berlin", "Tokyo", "Sydney", "Toronto", "Mumbai"]

    // Create more realistic transaction amounts based on country risk
    const country = countries[Math.floor(Math.random() * countries.length)]
    const isHighRiskCountry = ["NG", "UA", "ID", "VN", "CN", "RU", "IN"].includes(country)

    let amount: number
    if (isHighRiskCountry) {
      // High-risk countries tend to have larger, more suspicious amounts
      amount =
        Math.random() < 0.3
          ? Math.floor(Math.random() * 10000) + 1000 // 30% chance of large amount
          : Math.floor(Math.random() * 500) + 50 // 70% chance of normal amount
    } else {
      // Low-risk countries have more normal transaction patterns
      amount = Math.floor(Math.random() * 1000) + 10
    }

    const transaction: Transaction = {
      user_id: `user_${Math.floor(Math.random() * 10000)}`,
      amount,
      currency: "USD",
      merchant_id: merchants[Math.floor(Math.random() * merchants.length)],
      merchant_category: categories[Math.floor(Math.random() * categories.length)],
      email: `user${Math.floor(Math.random() * 1000)}@${Math.random() < 0.1 ? "suspicious-domain.com" : "gmail.com"}`,
      ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      billing_address: {
        country,
        city: cities[Math.floor(Math.random() * cities.length)],
      },
      payment_method: {
        type: Math.random() < 0.8 ? "credit_card" : "debit_card",
        last_four: Math.floor(Math.random() * 9999)
          .toString()
          .padStart(4, "0"),
      },
      timestamp: new Date().toISOString(),
    }

    const analysis = await this.analyzeTransaction(transaction)
    return this.processedTransactions[0] // Return the most recently added transaction
  }

  private storeTransactionHistory(transaction: Transaction) {
    // Store by user ID
    if (!this.transactionHistory.has(transaction.user_id)) {
      this.transactionHistory.set(transaction.user_id, [])
    }
    this.transactionHistory.get(transaction.user_id)!.push(transaction)

    // Store by IP
    if (!this.ipHistory.has(transaction.ip_address)) {
      this.ipHistory.set(transaction.ip_address, [])
    }
    this.ipHistory.get(transaction.ip_address)!.push(transaction)

    // Cleanup old transactions (keep last 1000 per entity)
    this.cleanupHistory(this.transactionHistory, transaction.user_id)
    this.cleanupHistory(this.ipHistory, transaction.ip_address)
  }

  private cleanupHistory(history: Map<string, Transaction[]>, key: string) {
    const transactions = history.get(key)
    if (transactions && transactions.length > 1000) {
      history.set(key, transactions.slice(-1000))
    }
  }

  private calculateRuleScore(ruleResults: RuleResult[]): number {
    const triggeredRules = ruleResults.filter((r) => r.triggered)
    if (triggeredRules.length === 0) return 0

    // Weight rules by severity
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 }
    let totalScore = 0
    let totalWeight = 0

    for (const rule of triggeredRules) {
      const weight = severityWeights[rule.severity]
      totalScore += rule.score * weight
      totalWeight += weight
    }

    return totalWeight > 0 ? Math.min(totalScore / totalWeight, 1.0) : 0
  }

  private determineRiskLevel(score: number): string {
    if (score >= 0.8) return "Critical"
    if (score >= 0.6) return "High"
    if (score >= 0.3) return "Medium"
    return "Low"
  }

  private makeRecommendation(score: number, riskLevel: string, triggeredRules: RuleResult[]): string {
    // Check for critical rules that force decline
    const criticalRules = triggeredRules.filter((r) => r.severity === "critical")
    if (criticalRules.length > 0) return "Decline"

    // Score-based recommendation
    if (score >= 0.7) return "Decline"
    if (score >= 0.3) return "Review"
    return "Approve"
  }

  private calculateConfidence(ruleScore: number, mlScore: number, ruleCount: number): number {
    // Higher confidence when both models agree
    const agreement = 1 - Math.abs(ruleScore - mlScore)

    // More rules triggered = higher confidence in fraud detection
    const ruleConfidence = Math.min(ruleCount * 0.1, 0.3)

    // Base confidence
    const baseConfidence = 0.7

    return Math.min(baseConfidence + agreement * 0.2 + ruleConfidence, 0.99)
  }

  private generateExplanation(score: number, triggeredRules: RuleResult[], mlFeatures: any): string {
    const scorePercent = (score * 100).toFixed(1)
    let explanation = `Transaction scored ${scorePercent}% fraud risk. `

    if (triggeredRules.length > 0) {
      const topRules = triggeredRules
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((r) => r.reason)
        .join("; ")

      explanation += `Key risk factors: ${topRules}. `
    }

    // Add ML insights
    const topMLFeatures = Object.entries(mlFeatures)
      .filter(([_, value]) => typeof value === "number" && value > 0.5)
      .slice(0, 2)
      .map(([name, _]) => name.replace(/_/g, " "))

    if (topMLFeatures.length > 0) {
      explanation += `ML model flagged: ${topMLFeatures.join(", ")}.`
    }

    return explanation
  }

  private updateStats(score: number, riskLevel: string, recommendation: string, processingTime: number) {
    this.stats.totalTransactions++
    this.stats.processingTimes.push(processingTime)

    // Update risk distribution
    const level = riskLevel.toLowerCase() as keyof typeof this.stats.riskCounts
    this.stats.riskCounts[level]++

    // Count as fraud if declined
    if (recommendation === "Decline") {
      this.stats.fraudDetected++
    }

    // Keep only last 10000 processing times for memory efficiency
    if (this.stats.processingTimes.length > 10000) {
      this.stats.processingTimes = this.stats.processingTimes.slice(-10000)
    }
  }

  async getStats(): Promise<SystemStats> {
    const avgProcessingTime =
      this.stats.processingTimes.length > 0
        ? this.stats.processingTimes.reduce((a, b) => a + b, 0) / this.stats.processingTimes.length
        : 0

    return {
      total_transactions: this.stats.totalTransactions,
      fraud_rate: this.stats.totalTransactions > 0 ? this.stats.fraudDetected / this.stats.totalTransactions : 0,
      accuracy: 0.94 + Math.random() * 0.04, // Simulate accuracy between 94-98%
      avg_processing_time_ms: Math.round(avgProcessingTime),
      risk_distribution: this.stats.riskCounts,
      rule_stats: this.rulesEngine.getRuleStats(),
      ml_stats: this.mlModel.getModelStats(),
    }
  }

  // Method to submit feedback for model improvement
  submitFeedback(transactionId: string, actualFraud: boolean, notes?: string) {
    // In a real implementation, this would update the model training data
    console.log(`Feedback received for ${transactionId}: fraud=${actualFraud}, notes=${notes}`)
    return { success: true, message: "Feedback submitted successfully" }
  }

  // Method to add items to blacklists
  addToBlacklist(type: "email" | "ip", value: string) {
    this.rulesEngine.addToBlacklist(type, value)
    return { success: true, message: `Added ${value} to ${type} blacklist` }
  }
}

// Singleton instance
export const decisionEngine = new DecisionEngine()

// Auto-generate sample transactions for demo
let transactionInterval: NodeJS.Timeout | null = null

export function startTransactionSimulation() {
  if (transactionInterval) return

  // Generate initial batch of transactions
  Promise.all(Array.from({ length: 20 }, () => decisionEngine.generateSampleTransaction()))

  // Continue generating transactions every 5-15 seconds
  transactionInterval = setInterval(
    async () => {
      await decisionEngine.generateSampleTransaction()
    },
    Math.random() * 10000 + 5000,
  ) // Random interval between 5-15 seconds
}

export function stopTransactionSimulation() {
  if (transactionInterval) {
    clearInterval(transactionInterval)
    transactionInterval = null
  }
}

// Start simulation automatically
if (typeof window === "undefined") {
  // Only on server side
  startTransactionSimulation()
}
