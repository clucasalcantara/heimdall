"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Play,
  User,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function ScenarioTester() {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [customAmount, setCustomAmount] = useState("1000");
  const [customCountry, setCustomCountry] = useState("US");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const predefinedScenarios = [
    {
      id: "high_amount",
      name: "High Amount Transaction",
      description: "Test large transaction amounts ($10,000+)",
      icon: DollarSign,
      color: "text-red-400",
      expectedRisk: "High",
    },
    {
      id: "risky_country",
      name: "High-Risk Country",
      description: "Transaction from high-risk geographic location",
      icon: Globe,
      color: "text-orange-400",
      expectedRisk: "Medium-High",
    },
    {
      id: "velocity_attack",
      name: "Velocity Attack",
      description: "Multiple rapid transactions from same user",
      icon: Clock,
      color: "text-yellow-400",
      expectedRisk: "Critical",
    },
    {
      id: "new_user_large",
      name: "New User Large Purchase",
      description: "First-time user with large transaction",
      icon: User,
      color: "text-purple-400",
      expectedRisk: "Medium",
    },
    {
      id: "card_testing",
      name: "Card Testing Pattern",
      description: "Small amounts to test card validity",
      icon: CreditCard,
      color: "text-blue-400",
      expectedRisk: "High",
    },
  ];

  const runScenario = async (scenarioId: string) => {
    setIsRunning(true);

    try {
      let transactionData = {};

      switch (scenarioId) {
        case "high_amount":
          transactionData = {
            amount: 15000,
            country: "US",
            user_id: `test_user_${Date.now()}`,
            merchant_category: "luxury",
          };
          break;
        case "risky_country":
          transactionData = {
            amount: 500,
            country: "NG",
            user_id: `test_user_${Date.now()}`,
            merchant_category: "online",
          };
          break;
        case "velocity_attack":
          // Run multiple transactions quickly
          for (let i = 0; i < 5; i++) {
            await fetch("/api/generate-transaction", { method: "POST" });
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          break;
        case "new_user_large":
          transactionData = {
            amount: 5000,
            country: "US",
            user_id: `new_user_${Date.now()}`,
            merchant_category: "electronics",
          };
          break;
        case "card_testing":
          // Multiple small transactions
          for (let i = 0; i < 3; i++) {
            await fetch("/api/generate-transaction", { method: "POST" });
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
          break;
        default:
          transactionData = {
            amount: Number.parseInt(customAmount),
            country: customCountry,
            user_id: `custom_user_${Date.now()}`,
            merchant_category: "test",
          };
      }

      if (scenarioId !== "velocity_attack" && scenarioId !== "card_testing") {
        const response = await fetch("/api/generate-transaction", {
          method: "POST",
        });
        const result = await response.json();

        const scenario = predefinedScenarios.find((s) => s.id === scenarioId);
        setTestResults((prev) => [
          {
            id: Date.now(),
            scenario: scenario?.name || "Custom Test",
            result: result.transaction,
            timestamp: new Date().toLocaleString(),
            status: result.success ? "completed" : "failed",
          },
          ...prev.slice(0, 9),
        ]); // Keep last 10 results
      } else {
        // For multi-transaction scenarios
        setTestResults((prev) => [
          {
            id: Date.now(),
            scenario:
              predefinedScenarios.find((s) => s.id === scenarioId)?.name ||
              "Multi-Transaction Test",
            result: { message: "Multiple transactions generated" },
            timestamp: new Date().toLocaleString(),
            status: "completed",
          },
          ...prev.slice(0, 9),
        ]);
      }
    } catch (error) {
      console.error("Scenario test failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Predefined Scenarios */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Fraud Detection Scenarios
          </CardTitle>
          <CardDescription className="text-gray-400">
            Test predefined fraud patterns and edge cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {predefinedScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Card
                  key={scenario.id}
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`h-5 w-5 ${scenario.color}`} />
                      <Badge variant="outline" className="text-xs">
                        {scenario.expectedRisk}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-white mb-2">
                      {scenario.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {scenario.description}
                    </p>
                    <Button
                      onClick={() => runScenario(scenario.id)}
                      disabled={isRunning}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Run Test
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Scenario */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Custom Scenario</CardTitle>
          <CardDescription className="text-gray-400">
            Create and test custom fraud scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">
                Amount ($)
              </label>
              <Input
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">
                Country
              </label>
              <Select value={customCountry} onValueChange={setCustomCountry}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                  <SelectItem value="UA">Ukraine</SelectItem>
                  <SelectItem value="BR">Brazil</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                  <SelectItem value="RU">Russia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button
                onClick={() => runScenario("custom")}
                disabled={isRunning}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Run Custom Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Test Results</CardTitle>
          <CardDescription className="text-gray-400">
            Recent scenario test results and fraud detection outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No test results yet. Run a scenario to see results.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className="rounded-md border border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">
                        {result.scenario}
                      </h4>
                      {result.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
                      {result.timestamp}
                    </span>
                  </div>
                  {result.result.riskScore && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-300">
                        Risk Score:{" "}
                        <span className="font-semibold text-white">
                          {result.result.riskScore}%
                        </span>
                      </span>
                      <span className="text-gray-300">
                        Decision:{" "}
                        <span className="font-semibold text-white capitalize">
                          {result.result.decision}
                        </span>
                      </span>
                      <span className="text-gray-300">
                        Amount:{" "}
                        <span className="font-semibold text-white">
                          ${result.result.amount}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
