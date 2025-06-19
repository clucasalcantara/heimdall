"use client";

import {
  AlertTriangle,
  CheckCircle,
  Play,
  RefreshCw,
  Shield,
  StopCircle,
  TestTube2,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { LoadTestDashboard } from "@/components/load-test-dashboard";
import { RebornChallengeDemo } from "@/components/rebord-challenge-demo";
import { ScenarioTester } from "@/components/scenario-tester";
import { useState } from "react";

export default function TestingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("reborn-challenge");

  const handleStartTest = () => {
    setIsRunning(true);
  };

  const handleStopTest = () => {
    setIsRunning(false);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sistema de Testes"
        subheading="Validação completa do sistema antifraude e demonstração técnica"
      >
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-900/20 text-blue-400 border-blue-700"
          >
            <TestTube2 className="mr-1 h-3 w-3" />
            Testing Environment
          </Badge>
          <Button
            variant={isRunning ? "destructive" : "default"}
            onClick={isRunning ? handleStopTest : handleStartTest}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Test
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Test
              </>
            )}
          </Button>
        </div>
      </DashboardHeader>

      <Tabs
        defaultValue="reborn-challenge"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reborn-challenge">Desafio Reborn</TabsTrigger>
          <TabsTrigger value="load-testing">Testes de Carga</TabsTrigger>
          <TabsTrigger value="scenarios" className="hidden">
            Fraud Scenarios
          </TabsTrigger>
          <TabsTrigger value="integration" className="hidden">
            Integration Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reborn-challenge">
          <RebornChallengeDemo />
        </TabsContent>

        <TabsContent value="load-testing">
          <LoadTestDashboard />
        </TabsContent>

        <TabsContent value="scenarios" className="mt-4 hidden">
          <ScenarioTester />
        </TabsContent>

        <TabsContent value="integration" className="mt-4 hidden">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-green-400" />
                  API Integration Tests
                </CardTitle>
                <CardDescription className="text-gray-400">
                  End-to-end API testing and validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Transaction Analysis API
                        </div>
                        <div className="text-sm text-gray-400">
                          POST /api/analyze - Core fraud detection
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-900 text-green-300 border-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          PASSED
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Dashboard Statistics
                        </div>
                        <div className="text-sm text-gray-400">
                          GET /api/dashboard/stats - KPI metrics
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-900 text-green-300 border-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          PASSED
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Transaction Feed
                        </div>
                        <div className="text-sm text-gray-400">
                          GET /api/dashboard/transactions - Live feed
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-900 text-yellow-300 border-yellow-700">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          WARNING
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                  System Component Tests
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Individual component validation and health checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Rules Engine
                        </div>
                        <div className="text-sm text-gray-400">
                          42 rules, 8 categories tested
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-900 text-green-300 border-green-700">
                          100%
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">ML Model</div>
                        <div className="text-sm text-gray-400">
                          Feature extraction and prediction
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-900 text-green-300 border-green-700">
                          96%
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          Database Connection
                        </div>
                        <div className="text-sm text-gray-400">
                          MongoDB operations and queries
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-900 text-green-300 border-green-700">
                          98%
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
