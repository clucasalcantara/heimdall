import { logger } from "./logger"

export interface LoadTestConfig {
  concurrentUsers: number
  requestsPerUser: number
  rampUpTime: number // seconds
  testDuration: number // seconds
  batchSize?: number // requests per batch for progress updates
  logLevel?: "minimal" | "normal" | "verbose"
}

export interface LoadTestResult {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  requestsPerSecond: number
  errorRate: number
  responseTimes: number[]
  timestamps: number[]
  errors: Array<{
    timestamp: number
    error: string
    statusCode?: number
  }>
  percentiles: {
    p50: number
    p95: number
    p99: number
    p99_9: number
  }
  slaCompliance: {
    under100ms: number
    under300ms: number
    under1000ms: number
    over1000ms: number
  }
}

export interface LoadTestProgress {
  isRunning: boolean
  progress: number
  currentRPS: number
  completedRequests: number
  totalRequests: number
  elapsedTime: number
  estimatedTimeRemaining: number
  currentBatch: number
  totalBatches: number
  memoryUsage?: number
}

export class LoadTester {
  private abortController: AbortController | null = null
  private responseTimes: number[] = []
  private maxStoredResponses = 100000 // Limit memory usage

  async runLoadTest(config: LoadTestConfig, onProgress: (progress: LoadTestProgress) => void): Promise<LoadTestResult> {
    const startTime = Date.now()
    const totalRequests = config.concurrentUsers * config.requestsPerUser
    const batchSize = config.batchSize || Math.max(100, Math.floor(totalRequests / 1000))
    const logLevel = config.logLevel || "normal"

    logger.info(
      `🚀 Starting MASSIVE load test - ${totalRequests.toLocaleString()} requests`,
      {
        concurrentUsers: config.concurrentUsers,
        requestsPerUser: config.requestsPerUser,
        totalRequests,
        batchSize,
        logLevel,
      },
      "load-tester",
    )

    this.abortController = new AbortController()
    this.responseTimes = []

    const result: LoadTestResult = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Number.POSITIVE_INFINITY,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      errorRate: 0,
      responseTimes: [],
      timestamps: [],
      errors: [],
      percentiles: { p50: 0, p95: 0, p99: 0, p99_9: 0 },
      slaCompliance: { under100ms: 0, under300ms: 0, under1000ms: 0, over1000ms: 0 },
    }

    let completedRequests = 0
    let lastProgressUpdate = 0
    const errors: Array<{ timestamp: number; error: string; statusCode?: number }> = []

    // Generate test transaction data factory
    const generateTestTransaction = (userId: number, requestIndex: number) => {
      const amounts = [50, 150, 500, 1500, 5000, 15000, 50000]
      const countries = ["US", "BR", "GB", "DE", "FR", "XX", "YY"]
      const currencies = ["USD", "EUR", "BRL", "GBP"]
      const categories = ["retail", "food", "gas", "online", "travel", "entertainment"]

      return {
        user_id: `load_user_${userId}_${requestIndex}`,
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        merchant_id: `merchant_${Math.floor(Math.random() * 1000)}`,
        merchant_category: categories[Math.floor(Math.random() * categories.length)],
        email: `user${userId}@loadtest${requestIndex % 10}.com`,
        ip_address: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        billing_address: {
          country: countries[Math.floor(Math.random() * countries.length)],
          city: "Load Test City",
        },
        payment_method: {
          type: "credit_card",
          last_four: Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0"),
        },
        timestamp: new Date().toISOString(),
      }
    }

    // Progress tracking function
    const updateProgress = () => {
      const elapsedTime = (Date.now() - startTime) / 1000
      const currentRPS = completedRequests / elapsedTime
      const estimatedTimeRemaining = elapsedTime > 0 ? (totalRequests - completedRequests) / currentRPS : 0
      const currentBatch = Math.floor(completedRequests / batchSize) + 1
      const totalBatches = Math.ceil(totalRequests / batchSize)

      onProgress({
        isRunning: true,
        progress: (completedRequests / totalRequests) * 100,
        currentRPS,
        completedRequests,
        totalRequests,
        elapsedTime,
        estimatedTimeRemaining,
        currentBatch,
        totalBatches,
        memoryUsage: this.responseTimes.length,
      })
    }

    // Request completion handler
    const onRequestComplete = (responseTime: number, error?: Error, statusCode?: number) => {
      completedRequests++

      if (error) {
        result.failedRequests++
        if (errors.length < 1000) {
          // Limit stored errors
          errors.push({
            timestamp: Date.now(),
            error: error.message,
            statusCode,
          })
        }

        if (logLevel === "verbose") {
          logger.error(`Request failed: ${error.message}`, { statusCode }, "load-tester")
        }
      } else {
        result.successfulRequests++

        // Store response time with memory management
        if (this.responseTimes.length < this.maxStoredResponses) {
          this.responseTimes.push(responseTime)
        } else {
          // Replace random entry to maintain sample
          const randomIndex = Math.floor(Math.random() * this.maxStoredResponses)
          this.responseTimes[randomIndex] = responseTime
        }

        result.minResponseTime = Math.min(result.minResponseTime, responseTime)
        result.maxResponseTime = Math.max(result.maxResponseTime, responseTime)

        if (logLevel === "verbose" && responseTime > 300) {
          logger.warn(`SLA breach: ${responseTime}ms`, null, "load-tester")
        }
      }

      // Update progress in batches to avoid UI flooding
      if (completedRequests - lastProgressUpdate >= batchSize || completedRequests === totalRequests) {
        updateProgress()
        lastProgressUpdate = completedRequests

        if (logLevel !== "minimal") {
          const progressPercent = ((completedRequests / totalRequests) * 100).toFixed(1)
          const elapsedTime = (Date.now() - startTime) / 1000
          const currentRPS = completedRequests / elapsedTime

          logger.info(
            `Progress: ${completedRequests.toLocaleString()}/${totalRequests.toLocaleString()} (${progressPercent}%) - ${currentRPS.toFixed(1)} RPS`,
            {
              successRate: ((result.successfulRequests / completedRequests) * 100).toFixed(1) + "%",
              avgResponseTime:
                this.responseTimes.length > 0
                  ? (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(0) + "ms"
                  : "0ms",
            },
            "load-tester",
          )
        }
      }
    }

    // Create concurrent users with optimized batching
    const userPromises: Promise<void>[] = []
    const usersPerBatch = Math.min(50, config.concurrentUsers) // Limit concurrent users per batch

    for (let batchStart = 0; batchStart < config.concurrentUsers; batchStart += usersPerBatch) {
      const batchEnd = Math.min(batchStart + usersPerBatch, config.concurrentUsers)

      for (let user = batchStart; user < batchEnd; user++) {
        if (logLevel === "verbose") {
          logger.debug(`Starting user ${user + 1}/${config.concurrentUsers}`, null, "load-tester")
        }

        const userPromise = this.simulateUser(
          user,
          config.requestsPerUser,
          generateTestTransaction,
          onRequestComplete,
          logLevel,
        )

        userPromises.push(userPromise)

        // Ramp up delay
        if (config.rampUpTime > 0) {
          const rampDelay = (config.rampUpTime * 1000) / config.concurrentUsers
          await new Promise((resolve) => setTimeout(resolve, rampDelay))
        }
      }

      // Small delay between batches to prevent overwhelming
      if (batchEnd < config.concurrentUsers) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    logger.info(`All ${config.concurrentUsers} users started, waiting for completion...`, null, "load-tester")

    // Wait for all requests to complete
    await Promise.all(userPromises)

    // Calculate final results
    const totalTime = (Date.now() - startTime) / 1000
    result.totalRequests = totalRequests
    result.errors = errors
    result.responseTimes = this.responseTimes.slice(0, 10000) // Limit returned data
    result.averageResponseTime =
      this.responseTimes.length > 0 ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length : 0
    result.requestsPerSecond = totalRequests / totalTime
    result.errorRate = (result.failedRequests / totalRequests) * 100

    if (result.minResponseTime === Number.POSITIVE_INFINITY) {
      result.minResponseTime = 0
    }

    // Calculate percentiles
    if (this.responseTimes.length > 0) {
      const sortedTimes = [...this.responseTimes].sort((a, b) => a - b)
      result.percentiles = {
        p50: sortedTimes[Math.floor(sortedTimes.length * 0.5)],
        p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
        p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)],
        p99_9: sortedTimes[Math.floor(sortedTimes.length * 0.999)],
      }

      // Calculate SLA compliance
      result.slaCompliance = {
        under100ms: this.responseTimes.filter((t) => t < 100).length,
        under300ms: this.responseTimes.filter((t) => t < 300).length,
        under1000ms: this.responseTimes.filter((t) => t < 1000).length,
        over1000ms: this.responseTimes.filter((t) => t >= 1000).length,
      }
    }

    logger.info(
      `🎉 MASSIVE load test completed!`,
      {
        totalRequests: result.totalRequests.toLocaleString(),
        successRate: ((result.successfulRequests / result.totalRequests) * 100).toFixed(2) + "%",
        avgResponseTime: result.averageResponseTime.toFixed(0) + "ms",
        rps: result.requestsPerSecond.toFixed(1),
        errorRate: result.errorRate.toFixed(2) + "%",
        duration: totalTime.toFixed(1) + "s",
        p95ResponseTime: result.percentiles.p95.toFixed(0) + "ms",
        p99ResponseTime: result.percentiles.p99.toFixed(0) + "ms",
        slaCompliance: ((result.slaCompliance.under300ms / this.responseTimes.length) * 100).toFixed(1) + "%",
      },
      "load-tester",
    )

    return result
  }

  private async simulateUser(
    userId: number,
    requestsPerUser: number,
    generateTransaction: (userId: number, requestIndex: number) => any,
    onRequestComplete: (responseTime: number, error?: Error, statusCode?: number) => void,
    logLevel: string,
  ): Promise<void> {
    for (let i = 0; i < requestsPerUser; i++) {
      if (this.abortController?.signal.aborted) {
        if (logLevel === "verbose") {
          logger.warn(`User ${userId} aborted at request ${i + 1}/${requestsPerUser}`, null, "load-tester")
        }
        break
      }

      const transaction = generateTransaction(userId, i)
      const startTime = Date.now()

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
          signal: this.abortController?.signal,
        })

        const responseTime = Date.now() - startTime

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        await response.json() // Consume the response
        onRequestComplete(responseTime)
      } catch (error) {
        const responseTime = Date.now() - startTime
        onRequestComplete(responseTime, error as Error, 0)
      }

      // Minimal delay to prevent overwhelming
      if (i < requestsPerUser - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1))
      }
    }
  }

  stopTest(): void {
    logger.warn("🛑 MASSIVE load test stop requested", null, "load-tester")
    if (this.abortController) {
      this.abortController.abort()
    }
  }
}
