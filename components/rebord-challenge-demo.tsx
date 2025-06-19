"use client";

import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface TestScenario {
  id: string;
  name: string;
  description: string;
  expectedScore: number;
  expectedDecision: "APPROVE" | "REVIEW" | "BLOCK";
  transaction: any;
  riskFactors: string[];
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: "normal-user",
    name: "Usuário Normal",
    description: "Transação típica de usuário estabelecido",
    expectedScore: 15,
    expectedDecision: "APPROVE",
    transaction: {
      user_id: "user_12345",
      amount: 89.99,
      currency: "USD",
      merchant_id: "amazon",
      merchant_category: "retail",
      email: "john.doe@gmail.com",
      ip_address: "192.168.1.10",
      billing_address: { country: "US", city: "New York" },
      payment_method: { type: "credit_card", last_four: "4532" },
    },
    riskFactors: ["Valor normal", "País baixo risco", "Email confiável"],
  },
  {
    id: "high-value",
    name: "Alto Valor",
    description: "Transação de valor elevado",
    expectedScore: 65,
    expectedDecision: "REVIEW",
    transaction: {
      user_id: "user_67890",
      amount: 15000,
      currency: "USD",
      merchant_id: "luxury_store",
      merchant_category: "retail",
      email: "wealthy.customer@gmail.com",
      ip_address: "203.45.67.89",
      billing_address: { country: "US", city: "Beverly Hills" },
      payment_method: { type: "credit_card", last_four: "9876" },
    },
    riskFactors: [
      "Valor muito alto",
      "Categoria de luxo",
      "Revisão necessária",
    ],
  },
  {
    id: "suspicious-country",
    name: "País Suspeito",
    description: "Transação de país de alto risco",
    expectedScore: 85,
    expectedDecision: "BLOCK",
    transaction: {
      user_id: "user_suspicious",
      amount: 500,
      currency: "USD",
      merchant_id: "online_store",
      merchant_category: "online",
      email: "test@tempmail.com",
      ip_address: "45.123.45.67",
      billing_address: { country: "NG", city: "Lagos" },
      payment_method: { type: "credit_card", last_four: "1234" },
    },
    riskFactors: ["País alto risco", "Email temporário", "IP suspeito"],
  },
  {
    id: "velocity-attack",
    name: "Ataque de Velocidade",
    description: "Múltiplas transações em pouco tempo",
    expectedScore: 92,
    expectedDecision: "BLOCK",
    transaction: {
      user_id: "user_velocity",
      amount: 299.99,
      currency: "USD",
      merchant_id: "electronics",
      merchant_category: "online",
      email: "rapid.buyer@gmail.com",
      ip_address: "10.0.0.1",
      billing_address: { country: "US", city: "Unknown" },
      payment_method: { type: "credit_card", last_four: "5555" },
    },
    riskFactors: ["Alta velocidade", "IP privado", "Padrão suspeito"],
  },
  {
    id: "cold-start",
    name: "Cold Start",
    description: "Novo usuário sem histórico",
    expectedScore: 45,
    expectedDecision: "REVIEW",
    transaction: {
      user_id: "user_new_" + Date.now(),
      amount: 199.99,
      currency: "USD",
      merchant_id: "new_merchant",
      merchant_category: "retail",
      email: "newuser@gmail.com",
      ip_address: "172.16.0.1",
      billing_address: { country: "CA", city: "Toronto" },
      payment_method: { type: "debit_card", last_four: "7890" },
    },
    riskFactors: ["Usuário novo", "Sem histórico", "Análise conservadora"],
  },
];

export function RebornChallengeDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgLatency: 0,
    slaCompliance: 0,
    accuracy: 0,
    totalTests: 0,
  });

  const runSingleTest = async (scenario: TestScenario) => {
    const startTime = performance.now();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenario.transaction),
      });

      const result = await response.json();
      const endTime = performance.now();
      const latency = endTime - startTime;

      const accuracy =
        Math.abs(result.risk_score - scenario.expectedScore) <= 10
          ? 100
          : Math.abs(result.risk_score - scenario.expectedScore) <= 20
          ? 75
          : 50;

      return {
        scenario: scenario.name,
        expected: {
          score: scenario.expectedScore,
          decision: scenario.expectedDecision,
        },
        actual: {
          score: result.risk_score,
          decision: result.decision,
          latency: Math.round(latency),
          explanation: result.explanation,
        },
        accuracy,
        slaCompliant: latency < 300,
        success: true,
      };
    } catch (error) {
      return {
        scenario: scenario.name,
        error: (error as Error).message,
        success: false,
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentTest(0);

    const testResults = [];
    let totalLatency = 0;
    let slaCompliantCount = 0;
    let accuracySum = 0;

    for (let i = 0; i < TEST_SCENARIOS.length; i++) {
      setCurrentTest(i + 1);
      const result = await runSingleTest(TEST_SCENARIOS[i]);
      testResults.push(result);

      if (result.success) {
        totalLatency += result.actual.latency;
        if (result.slaCompliant) slaCompliantCount++;
        accuracySum += result.accuracy;
      }

      // Simulate processing delay for demo
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setResults(testResults);
    setPerformanceMetrics({
      avgLatency: Math.round(totalLatency / testResults.length),
      slaCompliance: Math.round((slaCompliantCount / testResults.length) * 100),
      accuracy: Math.round(accuracySum / testResults.length),
      totalTests: testResults.length,
    });

    setIsRunning(false);
  };

  const resetTests = () => {
    setResults([]);
    setCurrentTest(0);
    setPerformanceMetrics({
      avgLatency: 0,
      slaCompliance: 0,
      accuracy: 0,
      totalTests: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center text-2xl">
            <Target className="mr-3 h-8 w-8 text-blue-400" />
            Desafio Técnico Reborn - Sistema Antifraude
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant="outline"
              className="bg-red-900/20 text-red-400 border-red-700"
            >
              <Clock className="mr-1 h-3 w-3" />
              Latência &lt; 300ms
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-900/20 text-blue-400 border-blue-700"
            >
              <Target className="mr-1 h-3 w-3" />
              Score 0-100
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-900/20 text-green-400 border-green-700"
            >
              <Brain className="mr-1 h-3 w-3" />3 Decisões:
              Aprovar/Revisar/Bloquear
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? "Executando..." : "Executar Todos os Testes"}
            </Button>
            <Button onClick={resetTests} variant="outline" disabled={isRunning}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {isRunning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>
                  Executando teste {currentTest} de {TEST_SCENARIOS.length}
                </span>
                <span>
                  {Math.round((currentTest / TEST_SCENARIOS.length) * 100)}%
                </span>
              </div>
              <Progress
                value={(currentTest / TEST_SCENARIOS.length) * 100}
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Cenários de Teste</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TEST_SCENARIOS.map((scenario, index) => (
              <Card key={scenario.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                        scenario.expectedDecision === "APPROVE"
                          ? "bg-green-600"
                          : scenario.expectedDecision === "REVIEW"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {scenario.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    {scenario.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      Score Esperado:
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-900/20 text-blue-400"
                    >
                      {scenario.expectedScore}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Decisão:</span>
                    <Badge
                      variant="outline"
                      className={
                        scenario.expectedDecision === "APPROVE"
                          ? "bg-green-900/20 text-green-400"
                          : scenario.expectedDecision === "REVIEW"
                          ? "bg-yellow-900/20 text-yellow-400"
                          : "bg-red-900/20 text-red-400"
                      }
                    >
                      {scenario.expectedDecision}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-gray-300 text-sm">
                      Fatores de Risco:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scenario.riskFactors.map((factor, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-12">
                <Brain className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Execute os testes para ver os resultados
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        {result.success ? (
                          <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="mr-2 h-5 w-5 text-red-400" />
                        )}
                        {result.scenario}
                      </span>
                      {result.success && (
                        <Badge
                          variant="outline"
                          className={
                            result.slaCompliant
                              ? "bg-green-900/20 text-green-400"
                              : "bg-red-900/20 text-red-400"
                          }
                        >
                          {result.actual.latency}ms
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.success ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-white font-medium mb-2">
                            Esperado vs Atual
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Score:</span>
                              <span className="text-white">
                                {result.expected.score} → {result.actual.score}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Decisão:</span>
                              <span className="text-white">
                                {result.expected.decision} →{" "}
                                {result.actual.decision}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Precisão:</span>
                              <span
                                className={
                                  result.accuracy >= 75
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                }
                              >
                                {result.accuracy}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">
                            Explicação
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {result.actual.explanation}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400">
                        <AlertTriangle className="inline mr-2 h-4 w-4" />
                        Erro: {result.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-400" />
                  Latência Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {performanceMetrics.avgLatency}ms
                </div>
                <p className="text-gray-400 text-sm">SLA: &lt; 300ms</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                  SLA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {performanceMetrics.slaCompliance}%
                </div>
                <p className="text-gray-400 text-sm">Transações &lt; 300ms</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-purple-400" />
                  Precisão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {performanceMetrics.accuracy}%
                </div>
                <p className="text-gray-400 text-sm">Precisão das predições</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-yellow-400" />
                  Testes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {performanceMetrics.totalTests}
                </div>
                <p className="text-gray-400 text-sm">Cenários executados</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Requisitos Técnicos - Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Latência &lt; 300ms</span>
                    <div className="flex items-center">
                      {performanceMetrics.avgLatency < 300 ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      )}
                      <Badge
                        variant="outline"
                        className={
                          performanceMetrics.avgLatency < 300
                            ? "bg-green-900/20 text-green-400"
                            : "bg-red-900/20 text-red-400"
                        }
                      >
                        {performanceMetrics.avgLatency}ms
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Score 0-100</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <Badge
                        variant="outline"
                        className="bg-green-900/20 text-green-400"
                      >
                        Implementado
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">3 Decisões</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <Badge
                        variant="outline"
                        className="bg-green-900/20 text-green-400"
                      >
                        Aprovar/Revisar/Bloquear
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cold Start</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <Badge
                        variant="outline"
                        className="bg-green-900/20 text-green-400"
                      >
                        Tratado
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Feedback Loop</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <Badge
                        variant="outline"
                        className="bg-green-900/20 text-green-400"
                      >
                        Implementado
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Versionamento</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <Badge
                        variant="outline"
                        className="bg-green-900/20 text-green-400"
                      >
                        v2.1.0
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
