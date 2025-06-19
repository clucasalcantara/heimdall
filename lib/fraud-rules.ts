import type { Transaction } from "./decision-engine"

export interface RuleResult {
  ruleName: string
  triggered: boolean
  score: number
  reason?: string
  severity: "low" | "medium" | "high" | "critical"
  category: "amount" | "velocity" | "geo" | "behavioral" | "device" | "merchant"
}

export class FraudRulesEngine {
  private transactionHistory: Map<string, Transaction[]> = new Map()
  private ipHistory: Map<string, Transaction[]> = new Map()
  private emailHistory: Map<string, Transaction[]> = new Map()
  private merchantHistory: Map<string, Transaction[]> = new Map()
  private blacklistedEmails = new Set([
    "fraud@test.com",
    "scammer@fake.com",
    "test@disposable.com",
    "temp@tempmail.com",
  ])
  private blacklistedIPs = new Set(["192.168.1.100", "10.0.0.1", "127.0.0.1"])
  private highRiskCountries = new Set(["XX", "YY", "ZZ", "NK", "IR"])
  private suspiciousEmailDomains = new Set([
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "disposable.com",
  ])

  analyzeTransaction(transaction: Transaction): RuleResult[] {
    const results: RuleResult[] = []
    const now = new Date(transaction.timestamp || new Date())

    // Store transaction for velocity checks
    this.storeTransaction(transaction)

    // 1. Amount-based rules
    results.push(...this.checkAmountRules(transaction))

    // 2. Velocity rules
    results.push(...this.checkVelocityRules(transaction, now))

    // 3. Geographic rules
    results.push(...this.checkGeographicRules(transaction))

    // 4. Behavioral rules
    results.push(...this.checkBehavioralRules(transaction, now))

    // 5. Device/IP rules
    results.push(...this.checkDeviceRules(transaction))

    // 6. Merchant rules
    results.push(...this.checkMerchantRules(transaction))

    // 7. Email rules
    results.push(...this.checkEmailRules(transaction))

    // 8. Time-based rules
    results.push(...this.checkTimeRules(transaction, now))

    return results
  }

  private storeTransaction(transaction: Transaction) {
    const userId = transaction.user_id
    const ip = transaction.ip_address
    const email = transaction.email
    const merchantId = transaction.merchant_id

    // Store by user ID
    if (!this.transactionHistory.has(userId)) {
      this.transactionHistory.set(userId, [])
    }
    this.transactionHistory.get(userId)!.push(transaction)

    // Store by IP
    if (!this.ipHistory.has(ip)) {
      this.ipHistory.set(ip, [])
    }
    this.ipHistory.get(ip)!.push(transaction)

    // Store by email
    if (!this.emailHistory.has(email)) {
      this.emailHistory.set(email, [])
    }
    this.emailHistory.get(email)!.push(transaction)

    // Store by merchant
    if (!this.merchantHistory.has(merchantId)) {
      this.merchantHistory.set(merchantId, [])
    }
    this.merchantHistory.get(merchantId)!.push(transaction)

    // Cleanup old transactions (keep last 1000 per entity)
    this.cleanupHistory(this.transactionHistory, userId)
    this.cleanupHistory(this.ipHistory, ip)
    this.cleanupHistory(this.emailHistory, email)
    this.cleanupHistory(this.merchantHistory, merchantId)
  }

  private cleanupHistory(history: Map<string, Transaction[]>, key: string) {
    const transactions = history.get(key)
    if (transactions && transactions.length > 1000) {
      history.set(key, transactions.slice(-1000))
    }
  }

  private checkAmountRules(transaction: Transaction): RuleResult[] {
    const results: RuleResult[] = []
    const amount = transaction.amount

    // Large amount rule
    if (amount > 10000) {
      results.push({
        ruleName: "large_amount",
        triggered: true,
        score: Math.min(amount / 50000, 0.6), // Scale up to 0.6 for $50k+
        reason: `Transaction amount $${amount.toLocaleString()} exceeds large transaction threshold`,
        severity: amount > 50000 ? "critical" : amount > 25000 ? "high" : "medium",
        category: "amount",
      })
    }

    // Unusual amount patterns (round numbers)
    if (amount % 1000 === 0 && amount >= 5000) {
      results.push({
        ruleName: "round_amount",
        triggered: true,
        score: 0.15,
        reason: `Suspicious round amount: $${amount.toLocaleString()}`,
        severity: "low",
        category: "amount",
      })
    }

    // Micro transactions (potential testing)
    if (amount < 1) {
      results.push({
        ruleName: "micro_transaction",
        triggered: true,
        score: 0.25,
        reason: `Micro transaction amount: $${amount}`,
        severity: "medium",
        category: "amount",
      })
    }

    return results
  }

  private checkVelocityRules(transaction: Transaction, now: Date): RuleResult[] {
    const results: RuleResult[] = []
    const userId = transaction.user_id
    const userTransactions = this.transactionHistory.get(userId) || []

    // Check transactions in last hour
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const recentTransactions = userTransactions.filter(
      (t) => new Date(t.timestamp || 0).getTime() > oneHourAgo.getTime(),
    )

    if (recentTransactions.length > 5) {
      results.push({
        ruleName: "high_velocity_user",
        triggered: true,
        score: Math.min(recentTransactions.length * 0.1, 0.8),
        reason: `${recentTransactions.length} transactions in last hour`,
        severity: recentTransactions.length > 10 ? "critical" : "high",
        category: "velocity",
      })
    }

    // Check amount velocity
    const totalAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0)
    if (totalAmount > 50000) {
      results.push({
        ruleName: "high_amount_velocity",
        triggered: true,
        score: Math.min(totalAmount / 200000, 0.7),
        reason: `$${totalAmount.toLocaleString()} in transactions within last hour`,
        severity: totalAmount > 100000 ? "critical" : "high",
        category: "velocity",
      })
    }

    // Check IP velocity
    const ipTransactions = this.ipHistory.get(transaction.ip_address) || []
    const recentIpTransactions = ipTransactions.filter(
      (t) => new Date(t.timestamp || 0).getTime() > oneHourAgo.getTime(),
    )

    if (recentIpTransactions.length > 10) {
      results.push({
        ruleName: "high_velocity_ip",
        triggered: true,
        score: Math.min(recentIpTransactions.length * 0.05, 0.6),
        reason: `${recentIpTransactions.length} transactions from IP in last hour`,
        severity: recentIpTransactions.length > 20 ? "critical" : "high",
        category: "velocity",
      })
    }

    return results
  }

  private checkGeographicRules(transaction: Transaction): RuleResult[] {
    const results: RuleResult[] = []
    const country = transaction.billing_address.country

    // High-risk country
    if (this.highRiskCountries.has(country)) {
      results.push({
        ruleName: "high_risk_country",
        triggered: true,
        score: 0.5,
        reason: `Transaction from high-risk country: ${country}`,
        severity: "high",
        category: "geo",
      })
    }

    // Currency mismatch
    const countryCurrencyMap: Record<string, string[]> = {
      US: ["USD"],
      BR: ["BRL"],
      GB: ["GBP"],
      DE: ["EUR"],
      FR: ["EUR"],
      CA: ["CAD", "USD"],
      MX: ["MXN", "USD"],
    }

    const expectedCurrencies = countryCurrencyMap[country]
    if (expectedCurrencies && !expectedCurrencies.includes(transaction.currency)) {
      results.push({
        ruleName: "currency_mismatch",
        triggered: true,
        score: 0.3,
        reason: `Currency ${transaction.currency} unusual for country ${country}`,
        severity: "medium",
        category: "geo",
      })
    }

    // Check for geographic inconsistency with user history
    const userTransactions = this.transactionHistory.get(transaction.user_id) || []
    const recentCountries = new Set(
      userTransactions
        .slice(-10)
        .map((t) => t.billing_address.country)
        .filter((c) => c !== country),
    )

    if (recentCountries.size > 0 && userTransactions.length > 5) {
      results.push({
        ruleName: "geographic_inconsistency",
        triggered: true,
        score: 0.4,
        reason: `Country change detected: previous countries [${Array.from(recentCountries).join(", ")}]`,
        severity: "medium",
        category: "geo",
      })
    }

    return results
  }

  private checkBehavioralRules(transaction: Transaction, now: Date): RuleResult[] {
    const results: RuleResult[] = []
    const userTransactions = this.transactionHistory.get(transaction.user_id) || []

    if (userTransactions.length > 1) {
      // Check for unusual merchant category
      const userCategories = userTransactions.map((t) => t.merchant_category)
      const categoryFreq = userCategories.reduce(
        (acc, cat) => {
          acc[cat] = (acc[cat] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const currentCategory = transaction.merchant_category
      const categoryCount = categoryFreq[currentCategory] || 0
      const totalTransactions = userTransactions.length

      // If this category represents less than 10% of user's history and they have 10+ transactions
      if (totalTransactions >= 10 && categoryCount / totalTransactions < 0.1) {
        results.push({
          ruleName: "unusual_merchant_category",
          triggered: true,
          score: 0.2,
          reason: `Unusual merchant category: ${currentCategory} (${((categoryCount / totalTransactions) * 100).toFixed(1)}% of history)`,
          severity: "low",
          category: "behavioral",
        })
      }

      // Check for unusual amount compared to user's history
      const amounts = userTransactions.map((t) => t.amount)
      const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
      const maxAmount = Math.max(...amounts)

      if (transaction.amount > avgAmount * 5 && transaction.amount > 1000) {
        results.push({
          ruleName: "unusual_amount_pattern",
          triggered: true,
          score: Math.min((transaction.amount / avgAmount) * 0.1, 0.5),
          reason: `Amount $${transaction.amount.toLocaleString()} is ${(transaction.amount / avgAmount).toFixed(1)}x user's average`,
          severity: transaction.amount > avgAmount * 10 ? "high" : "medium",
          category: "behavioral",
        })
      }
    }

    return results
  }

  private checkDeviceRules(transaction: Transaction): RuleResult[] {
    const results: RuleResult[] = []
    const ip = transaction.ip_address

    // Blacklisted IP
    if (this.blacklistedIPs.has(ip)) {
      results.push({
        ruleName: "blacklisted_ip",
        triggered: true,
        score: 0.9,
        reason: `IP address ${ip} is blacklisted`,
        severity: "critical",
        category: "device",
      })
    }

    // Private/Local IP ranges (suspicious for online transactions)
    if (ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
      results.push({
        ruleName: "private_ip_range",
        triggered: true,
        score: 0.4,
        reason: `Private IP address detected: ${ip}`,
        severity: "medium",
        category: "device",
      })
    }

    // Check for IP sharing across multiple users
    const ipTransactions = this.ipHistory.get(ip) || []
    const uniqueUsers = new Set(ipTransactions.map((t) => t.user_id))

    if (uniqueUsers.size > 5 && ipTransactions.length > 10) {
      results.push({
        ruleName: "shared_ip_multiple_users",
        triggered: true,
        score: Math.min(uniqueUsers.size * 0.1, 0.6),
        reason: `IP ${ip} used by ${uniqueUsers.size} different users`,
        severity: uniqueUsers.size > 10 ? "high" : "medium",
        category: "device",
      })
    }

    return results
  }

  private checkMerchantRules(transaction: Transaction): RuleResult[] {
    const results: RuleResult[] = []
    const merchantId = transaction.merchant_id
    const merchantTransactions = this.merchantHistory.get(merchantId) || []

    // High-risk merchant categories
    const highRiskCategories = ["gambling", "adult", "crypto", "cash_advance", "money_transfer"]
    if (highRiskCategories.includes(transaction.merchant_category)) {
      results.push({
        ruleName: "high_risk_merchant_category",
        triggered: true,
        score: 0.4,
        reason: `High-risk merchant category: ${transaction.merchant_category}`,
        severity: "medium",
        category: "merchant",
      })
    }

    // Check merchant velocity (too many transactions)
    if (merchantTransactions.length > 0) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const recentMerchantTransactions = merchantTransactions.filter(
        (t) => new Date(t.timestamp || 0).getTime() > oneHourAgo.getTime(),
      )

      if (recentMerchantTransactions.length > 100) {
        results.push({
          ruleName: "high_merchant_velocity",
          triggered: true,
          score: Math.min(recentMerchantTransactions.length * 0.005, 0.5),
          reason: `Merchant ${merchantId} processed ${recentMerchantTransactions.length} transactions in last hour`,
          severity: recentMerchantTransactions.length > 500 ? "high" : "medium",
          category: "merchant",
        })
      }
    }

    return results
  }

  private checkEmailRules(transaction: Transaction): RuleResult[] {
    const results: RuleResult[] = []
    const email = transaction.email

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      results.push({
        ruleName: "invalid_email_format",
        triggered: true,
        score: 0.6,
        reason: `Invalid email format: ${email}`,
        severity: "high",
        category: "behavioral",
      })
    }

    // Blacklisted email
    if (this.blacklistedEmails.has(email.toLowerCase())) {
      results.push({
        ruleName: "blacklisted_email",
        triggered: true,
        score: 0.95,
        reason: `Email ${email} is blacklisted`,
        severity: "critical",
        category: "behavioral",
      })
    }

    // Suspicious email domains
    const domain = email.split("@")[1]?.toLowerCase()
    if (domain && this.suspiciousEmailDomains.has(domain)) {
      results.push({
        ruleName: "suspicious_email_domain",
        triggered: true,
        score: 0.5,
        reason: `Suspicious email domain: ${domain}`,
        severity: "medium",
        category: "behavioral",
      })
    }

    // Disposable email patterns
    const disposablePatterns = ["temp", "disposable", "fake", "test", "spam", "trash"]
    if (disposablePatterns.some((pattern) => email.toLowerCase().includes(pattern))) {
      results.push({
        ruleName: "disposable_email_pattern",
        triggered: true,
        score: 0.4,
        reason: `Email contains disposable pattern: ${email}`,
        severity: "medium",
        category: "behavioral",
      })
    }

    return results
  }

  private checkTimeRules(transaction: Transaction, now: Date): RuleResult[] {
    const results: RuleResult[] = []
    const hour = now.getHours()
    const dayOfWeek = now.getDay() // 0 = Sunday

    // Unusual hours (late night/early morning)
    if (hour >= 2 && hour <= 5) {
      results.push({
        ruleName: "unusual_time_late_night",
        triggered: true,
        score: 0.3,
        reason: `Transaction at unusual hour: ${hour}:00`,
        severity: "medium",
        category: "behavioral",
      })
    }

    // Weekend high-value transactions
    if ((dayOfWeek === 0 || dayOfWeek === 6) && transaction.amount > 10000) {
      results.push({
        ruleName: "weekend_high_value",
        triggered: true,
        score: 0.25,
        reason: `High-value weekend transaction: $${transaction.amount.toLocaleString()}`,
        severity: "low",
        category: "behavioral",
      })
    }

    // Holiday patterns (simplified - would need actual holiday calendar)
    const isHoliday = this.isHoliday(now)
    if (isHoliday && transaction.amount > 5000) {
      results.push({
        ruleName: "holiday_transaction",
        triggered: true,
        score: 0.2,
        reason: `Transaction on holiday`,
        severity: "low",
        category: "behavioral",
      })
    }

    return results
  }

  private isHoliday(date: Date): boolean {
    // Simplified holiday check - in production, use a proper holiday calendar
    const month = date.getMonth() + 1
    const day = date.getDate()

    // Major US holidays
    const holidays = [
      [1, 1], // New Year's Day
      [7, 4], // Independence Day
      [12, 25], // Christmas
    ]

    return holidays.some(([m, d]) => month === m && day === d)
  }

  // Method to add items to blacklists (for dynamic updates)
  addToBlacklist(type: "email" | "ip", value: string) {
    if (type === "email") {
      this.blacklistedEmails.add(value.toLowerCase())
    } else if (type === "ip") {
      this.blacklistedIPs.add(value)
    }
  }

  // Method to get rule statistics
  getRuleStats() {
    return {
      totalTransactions: Array.from(this.transactionHistory.values()).reduce((sum, txns) => sum + txns.length, 0),
      uniqueUsers: this.transactionHistory.size,
      uniqueIPs: this.ipHistory.size,
      uniqueEmails: this.emailHistory.size,
      blacklistedEmails: this.blacklistedEmails.size,
      blacklistedIPs: this.blacklistedIPs.size,
    }
  }
}
