"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadTester, type LoadTestConfig, type LoadTestResult, type LoadTestProgress } from "@/lib/load-tester"
import { Play, Square, TrendingUp, AlertTriangle, Target, Gauge } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoadTestDashboard() {
  const [config, setConfig] = useState<LoadTestConfig>({
    concurrentUsers: 1000,
    requestsPerUser: 1000,
    rampUpTime: 60,
    testDuration: 300,
    batchSize: 1000,
    logLevel: "normal",
  })

  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState<LoadTestProgress>({
    isRunning: false,
    progress: 0,
    currentRPS: 0,
    completedRequests: 0,
    totalRequests: 0,
    elapsedTime: 0,
    estimatedTimeRemaining: 0,
    currentBatch: 0,
    totalBatches: 0,
  })
  const [results, setResults] = useState<LoadTestResult | null>(null)
  const [loadTester] = useState(() => new LoadTester())

  const totalRequests = config.concurrentUsers * config.requestsPerUser

  const presetConfigs = {
    small: { concurrentUsers: 10, requestsPerUser: 100, rampUpTime: 5, testDuration: 30 },
    medium: { concurrentUsers: 100, requestsPerUser: 1000, rampUpTime: 30, testDuration: 120 },
    large: { concurrentUsers: 500, requestsPerUser: 2000, rampUpTime: 60, testDuration: 300 },
    massive: { concurrentUsers: 1000, requestsPerUser: 1000, rampUpTime: 60, testDuration: 300 },
    extreme: { concurrentUsers: 2000, requestsPerUser: 500, rampUpTime: 120, testDuration: 600 },
  }

  const startLoadTest = async () => {
    setIsRunning(true)
    setResults(null)
    setProgress({
      isRunning: true,
      progress: 0,
      currentRPS: 0,
      completedRequests: 0,
      totalRequests,
      elapsedTime: 0,
      estimatedTimeRemaining: 0,
      currentBatch: 0,
      totalBatches: Math.ceil(totalRequests / (config.batchSize || 1000)),
    })

    try {
      const result = await loadTester.runLoadTest(config, (progressUpdate) => {
        setProgress(progressUpdate)
      })

      setResults(result)
    } catch (error) {
      console.error("Load test failed:", error)
    } finally {
      setIsRunning(false)
      setProgress((prev) => ({ ...prev, isRunning: false }))
    }
  }

  const stopLoadTest = () => {
    loadTester.stopTest()
    setIsRunning(false)
    setProgress((prev) => ({ ...prev, isRunning: false }))
  }

  const applyPreset = (preset: keyof typeof presetConfigs) => {
    setConfig({ ...config, ...presetConfigs[preset] })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 100) return "text-green-600"
    if (responseTime < 300) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (responseTime: number) => {
    if (responseTime < 100) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (responseTime < 300) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const getScaleWarning = () => {
    if (totalRequests >= 1000000) {
      return "extreme"
    } else if (totalRequests >= 100000) {
      return "high"
    } else if (totalRequests >= 10000) {
      return "medium"
    }
    return "low"
  }

  const scaleWarning = getScaleWarning()

  return (
    <div className="space-y-6">
      {/* Scale Warning */}
      {scaleWarning !== "low" && (
        <Alert className={scaleWarning === "extreme" ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {scaleWarning === "extreme" && (
              <span className="text-red-700">
                <strong>EXTREME SCALE:</strong> {formatNumber(totalRequests)} requests will generate significant load.
                This may take {formatTime((totalRequests / 1000) * 0.3)} or longer to complete.
              </span>
            )}
            {scaleWarning === "high" && (
              <span className="text-yellow-700">
                <strong>HIGH SCALE:</strong> {formatNumber(totalRequests)} requests will take considerable time and
                resources.
              </span>
            )}
            {scaleWarning === "medium" && (
              <span className="text-yellow-700">
                <strong>MEDIUM SCALE:</strong> {formatNumber(totalRequests)} requests - monitor system resources.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Configuração do Load Test
            </CardTitle>
            <CardDescription>Configure para até 1 milhão de requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-100">
            {/* Presets */}
            <div>
              <Label className="text-sm font-medium text-gray-200">Presets Rápidos:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => applyPreset("small")} disabled={isRunning}>
                  Small (1K)
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset("medium")} disabled={isRunning}>
                  Medium (100K)
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset("large")} disabled={isRunning}>
                  Large (1M)
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset("massive")} disabled={isRunning}>
                  Massive (1M)
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset("extreme")} disabled={isRunning}>
                  Extreme (1M)
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-200" htmlFor="concurrentUsers">
                  Usuários Simultâneos
                </Label>
                <Input
                  id="concurrentUsers"
                  type="number"
                  value={config.concurrentUsers}
                  onChange={(e) => setConfig({ ...config, concurrentUsers: Number.parseInt(e.target.value) || 1 })}
                  disabled={isRunning}
                  max={10000}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-200" htmlFor="requestsPerUser">
                  Requests por Usuário
                </Label>
                <Input
                  id="requestsPerUser"
                  type="number"
                  value={config.requestsPerUser}
                  onChange={(e) => setConfig({ ...config, requestsPerUser: Number.parseInt(e.target.value) || 1 })}
                  disabled={isRunning}
                  max={10000}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-200" htmlFor="rampUpTime">
                  Ramp-up Time (s)
                </Label>
                <Input
                  id="rampUpTime"
                  type="number"
                  value={config.rampUpTime}
                  onChange={(e) => setConfig({ ...config, rampUpTime: Number.parseInt(e.target.value) || 0 })}
                  disabled={isRunning}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-200" htmlFor="batchSize">
                  Batch Size
                </Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={config.batchSize}
                  onChange={(e) => setConfig({ ...config, batchSize: Number.parseInt(e.target.value) || 1000 })}
                  disabled={isRunning}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-200" htmlFor="logLevel">
                  Log Level
                </Label>
                <Select
                  value={config.logLevel}
                  onValueChange={(value: "minimal" | "normal" | "verbose") => setConfig({ ...config, logLevel: value })}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="verbose">Verbose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-200">Total de Requests</Label>
                <div className="h-10 flex items-center px-3 bg-gray-800 border border-gray-600 rounded-md text-sm font-bold text-white mt-1">
                  {formatNumber(totalRequests)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={startLoadTest} disabled={isRunning} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Executando..." : "Iniciar Teste"}
              </Button>
              {isRunning && (
                <Button onClick={stopLoadTest} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Parar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Progresso em Tempo Real
            </CardTitle>
            <CardDescription>Acompanhe o progresso do teste massivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Geral</span>
                <span>{progress.progress.toFixed(2)}%</span>
              </div>
              <Progress value={progress.progress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Requests Completados:</span>
                <div className="font-semibold text-lg">
                  {formatNumber(progress.completedRequests)} / {formatNumber(progress.totalRequests)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">RPS Atual:</span>
                <div className="font-semibold text-lg text-blue-600">{progress.currentRPS.toFixed(1)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tempo Decorrido:</span>
                <div className="font-semibold">{formatTime(progress.elapsedTime)}</div>
              </div>
              <div>
                <span className="text-gray-600">Tempo Restante:</span>
                <div className="font-semibold">{formatTime(progress.estimatedTimeRemaining)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Batch Atual:</span>
                <div className="font-semibold">
                  {progress.currentBatch} / {progress.totalBatches}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-semibold">
                  {progress.isRunning ? (
                    <Badge className="bg-blue-100 text-blue-800">Executando</Badge>
                  ) : (
                    <Badge variant="outline">Parado</Badge>
                  )}
                </div>
              </div>
            </div>

            {progress.memoryUsage && (
              <div className="text-xs text-gray-500">Samples em memória: {formatNumber(progress.memoryUsage)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resultados do Load Test Massivo
            </CardTitle>
            <CardDescription>
              Métricas de performance para {formatNumber(results.totalRequests)} requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{formatNumber(results.totalRequests)}</div>
                <div className="text-sm text-gray-600">Total de Requests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{formatNumber(results.successfulRequests)}</div>
                <div className="text-sm text-gray-600">Sucessos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{formatNumber(results.failedRequests)}</div>
                <div className="text-sm text-gray-600">Falhas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{results.requestsPerSecond.toFixed(1)}</div>
                <div className="text-sm text-gray-600">RPS Médio</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Tempo de Resposta</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Médio:</span>
                    <span className={getPerformanceColor(results.averageResponseTime)}>
                      {results.averageResponseTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>P95:</span>
                    <span className={getPerformanceColor(results.percentiles.p95)}>
                      {results.percentiles.p95.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>P99:</span>
                    <span className={getPerformanceColor(results.percentiles.p99)}>
                      {results.percentiles.p99.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>P99.9:</span>
                    <span className={getPerformanceColor(results.percentiles.p99_9)}>
                      {results.percentiles.p99_9.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">SLA Compliance</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{"< 100ms"}:</span>
                    <span className="text-green-600">{formatNumber(results.slaCompliance.under100ms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{"< 300ms"}:</span>
                    <span className="text-yellow-600">{formatNumber(results.slaCompliance.under300ms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{"< 1000ms"}:</span>
                    <span className="text-orange-600">{formatNumber(results.slaCompliance.under1000ms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{"> 1000ms"}:</span>
                    <span className="text-red-600">{formatNumber(results.slaCompliance.over1000ms)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Performance Geral</h4>
                <div className="space-y-2">
                  {getPerformanceBadge(results.averageResponseTime)}
                  <div className="text-2xl font-bold text-red-600">{results.errorRate.toFixed(3)}%</div>
                  <div className="text-xs text-gray-600">Taxa de Erro</div>
                </div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Erros Encontrados ({formatNumber(results.errors.length)})
                </h4>
                <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {results.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm text-red-800 mb-1">
                      <span className="font-mono text-xs text-gray-600">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                      {" - "}
                      {error.error}
                      {error.statusCode && ` (${error.statusCode})`}
                    </div>
                  ))}
                  {results.errors.length > 10 && (
                    <div className="text-xs text-gray-600 mt-2">
                      ... e mais {formatNumber(results.errors.length - 10)} erros
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
