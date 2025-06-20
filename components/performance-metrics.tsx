"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    response_time: 0,
    throughput: 0,
    accuracy: 0,
    uptime: 99.97,
  });

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setMetrics({
          response_time: data.avg_processing_time || 0,
          throughput: Math.floor(data.total_transactions / 24) || 0, // Transactions per hour converted to rough TPS
          accuracy: (data.accuracy || 0) * 100,
          uptime: data.uptime || 99.97,
        });
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      // Set zero values on error
      setMetrics({
        response_time: 0,
        throughput: 0,
        accuracy: 0,
        uptime: 0,
      });
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="mr-1 h-4 w-4 text-green-400" />
              <span className="text-gray-300 text-sm">Response Time</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics.response_time}ms
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="mr-1 h-4 w-4 text-yellow-400" />
              <span className="text-gray-300 text-sm">Throughput</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics.throughput} TPS
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="mr-1 h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics.accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="mr-1 h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Uptime</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics.uptime}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
