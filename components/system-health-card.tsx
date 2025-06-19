"use client";

import { Activity, Database, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function SystemHealthCard() {
  const [healthStatus, setHealthStatus] = useState({
    api: "healthy",
    database: "healthy",
    ml_model: "healthy",
    rules_engine: "healthy",
  });

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        const data = await response.json();
        setHealthStatus({
          api: data.status === "healthy" ? "healthy" : "warning",
          database: data.components?.database || "healthy",
          ml_model: data.components?.ml_model || "healthy",
          rules_engine: data.components?.rules_engine || "healthy",
        });
      } else {
        // Set warning status if health check fails
        setHealthStatus({
          api: "warning",
          database: "warning",
          ml_model: "warning",
          rules_engine: "warning",
        });
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setHealthStatus({
        api: "error",
        database: "error",
        ml_model: "error",
        rules_engine: "error",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return "●";
      case "warning":
        return "⚠";
      case "error":
        return "●";
      default:
        return "●";
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-green-400" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-gray-300">API Gateway</span>
            </div>
            <span
              className={`${getStatusColor(
                healthStatus.api
              )} font-mono text-sm`}
            >
              {getStatusIcon(healthStatus.api)} {healthStatus.api}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="mr-2 h-4 w-4 text-green-400" />
              <span className="text-gray-300">Database</span>
            </div>
            <span
              className={`${getStatusColor(
                healthStatus.database
              )} font-mono text-sm`}
            >
              {getStatusIcon(healthStatus.database)} {healthStatus.database}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-purple-400" />
              <span className="text-gray-300">ML Model</span>
            </div>
            <span
              className={`${getStatusColor(
                healthStatus.ml_model
              )} font-mono text-sm`}
            >
              {getStatusIcon(healthStatus.ml_model)} {healthStatus.ml_model}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="mr-2 h-4 w-4 text-orange-400" />
              <span className="text-gray-300">Rules Engine</span>
            </div>
            <span
              className={`${getStatusColor(
                healthStatus.rules_engine
              )} font-mono text-sm`}
            >
              {getStatusIcon(healthStatus.rules_engine)}{" "}
              {healthStatus.rules_engine}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
