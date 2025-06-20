"use client";

import { ArrowDown, ArrowUp, Clock, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface DashboardStats {
  approved: { count: number; change: number; trend: string };
  reviewed: { count: number; change: number; trend: string };
  blocked: { count: number; change: number; trend: string };
  total_transactions: number;
  fraud_rate: number;
  accuracy: number;
  avg_processing_time: number;
}

export function KpiCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="col-span-3 text-center text-gray-400">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Approved
          </CardTitle>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats.approved.count.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">
            <span
              className={`flex items-center ${
                stats.approved.trend === "up"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {stats.approved.trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(stats.approved.change)}%
            </span>{" "}
            from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Reviewed
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats.reviewed.count.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">
            <span
              className={`flex items-center ${
                stats.reviewed.trend === "up"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {stats.reviewed.trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(stats.reviewed.change)}%
            </span>{" "}
            from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            Blocked
          </CardTitle>
          <ShieldX className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats.blocked.count.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">
            <span
              className={`flex items-center ${
                stats.blocked.trend === "up" ? "text-red-500" : "text-green-500"
              }`}
            >
              {stats.blocked.trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(stats.blocked.change)}%
            </span>{" "}
            from yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
