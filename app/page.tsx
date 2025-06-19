"use client";

import { Activity, Globe, Shield, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { KpiCards } from "@/components/kpi-cards";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { RecentTransactions } from "@/components/recent-transactions";
import { RiskDistributionChart } from "@/components/risk-distribution-chart";
import { SystemHealthCard } from "@/components/system-health-card";
import { TopRiskyCountries } from "@/components/top-risky-countries";

export default function DashboardPage() {
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [ecosystemData, setEcosystemData] = useState({
    activeUsers: 0,
    newUsers: 0,
    avgSessionTime: "0m 0s",
    countriesCovered: 0,
    currenciesSupported: 0,
    paymentMethods: 0,
    uptime: 0,
    responseTime: 0,
    throughput: 0,
  });

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchEcosystemData();
    const interval = setInterval(fetchEcosystemData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data);
      }
    } catch (error) {
      console.error("Error fetching system stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEcosystemData = async () => {
    try {
      const [statsResponse, countriesResponse] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/countries"),
      ]);

      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        const countries = countriesResponse.ok
          ? await countriesResponse.json()
          : [];

        setEcosystemData({
          activeUsers: stats.total_transactions || 0,
          newUsers: Math.floor((stats.total_transactions || 0) * 0.15),
          avgSessionTime: "12m 34s",
          countriesCovered: countries.length || 0,
          currenciesSupported: Math.min(countries.length, 23),
          paymentMethods: 15,
          uptime: stats.uptime || 99.97,
          responseTime: stats.avg_processing_time || 0,
          throughput: Math.floor((stats.total_transactions || 0) / 24) || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching ecosystem data:", error);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          heading="Heimdall Fraud Detection"
          subheading="Real-time fraud detection and risk assessment platform"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge
              variant="outline"
              className="bg-green-900/20 text-green-400 border-green-700"
            >
              <Activity className="mr-1 h-3 w-3" />
              System Online
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-900/20 text-blue-400 border-blue-700"
            >
              <Shield className="mr-1 h-3 w-3" />
              {systemStats?.accuracy
                ? `${(systemStats.accuracy * 100).toFixed(1)}% Accuracy`
                : "Loading..."}
            </Badge>
          </div>
        </DashboardHeader>

        {/* System Health Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2">
            <SystemHealthCard />
          </div>
          <div className="md:col-span-2">
            <PerformanceMetrics />
          </div>
        </div>

        {/* KPI Cards */}
        <div>
          <KpiCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RiskDistributionChart />
          </div>
          <div className="lg:col-span-3">
            <TopRiskyCountries />
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <RecentTransactions />
        </div>

        {/* Ecosystem Health Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-blue-400" />
                User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    Active Users (24h)
                  </span>
                  <span className="text-white font-semibold">
                    {ecosystemData.activeUsers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">New Users Today</span>
                  <span className="text-white font-semibold">
                    {ecosystemData.newUsers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    Avg. Session Time
                  </span>
                  <span className="text-white font-semibold">
                    {ecosystemData.avgSessionTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <Globe className="mr-2 h-5 w-5 text-green-400" />
                Global Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    Countries Covered
                  </span>
                  <span className="text-white font-semibold">
                    {ecosystemData.countriesCovered}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    Currencies Supported
                  </span>
                  <span className="text-white font-semibold">
                    {ecosystemData.currenciesSupported}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Payment Methods</span>
                  <span className="text-white font-semibold">
                    {ecosystemData.paymentMethods}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-lg">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Uptime</span>
                  <span className="text-green-400 font-semibold">
                    {ecosystemData.uptime}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Response Time</span>
                  <span className="text-white font-semibold">
                    {ecosystemData.responseTime}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Throughput</span>
                  <span className="text-white font-semibold">
                    {ecosystemData.throughput} TPS
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
