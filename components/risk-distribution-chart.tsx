"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

const COLORS = {
  low: "#10B981", // Green
  medium: "#F59E0B", // Orange
  high: "#EF4444", // Red
};

export function RiskDistributionChart() {
  const [data, setData] = useState([
    {
      name: "Low Risk",
      value: 65,
      range: "(0-30)",
      color: COLORS.low,
      count: 130,
    },
    {
      name: "Medium Risk",
      value: 25,
      range: "(31-70)",
      color: COLORS.medium,
      count: 50,
    },
    {
      name: "High Risk",
      value: 10,
      range: "(71-100)",
      color: COLORS.high,
      count: 20,
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRiskData();
    const interval = setInterval(fetchRiskData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/transactions");
      if (response.ok) {
        const transactions = await response.json();

        const total = transactions.length;
        if (total > 0) {
          const lowRisk = transactions.filter(
            (t: any) => t.risk_score <= 30
          ).length;
          const mediumRisk = transactions.filter(
            (t: any) => t.risk_score > 30 && t.risk_score <= 70
          ).length;
          const highRisk = transactions.filter(
            (t: any) => t.risk_score > 70
          ).length;

          setData([
            {
              name: "Low Risk",
              value: Math.round((lowRisk / total) * 100),
              range: "(0-30)",
              color: COLORS.low,
              count: lowRisk,
            },
            {
              name: "Medium Risk",
              value: Math.round((mediumRisk / total) * 100),
              range: "(31-70)",
              color: COLORS.medium,
              count: mediumRisk,
            },
            {
              name: "High Risk",
              value: Math.round((highRisk / total) * 100),
              range: "(71-100)",
              color: COLORS.high,
              count: highRisk,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching risk data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple SVG Pie Chart
  const createPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = 80;
    const centerX = 150;
    const centerY = 120;

    return data.map((item, index) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      currentAngle += angle;

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="#374151"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Risk Distribution</CardTitle>
        <CardDescription className="text-gray-400">
          Distribution of transactions by risk score
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="h-[240px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="h-[240px] flex items-center justify-center">
              <svg width="300" height="240" viewBox="0 0 300 240">
                {createPieChart()}
                {/* Center circle for donut effect */}
                <circle
                  cx="150"
                  cy="120"
                  r="40"
                  fill="#374151"
                  stroke="#4B5563"
                  strokeWidth="2"
                />
                <text
                  x="150"
                  y="115"
                  textAnchor="middle"
                  className="fill-white text-sm font-medium"
                >
                  Total
                </text>
                <text
                  x="150"
                  y="130"
                  textAnchor="middle"
                  className="fill-gray-300 text-xs"
                >
                  {data.reduce((sum, item) => sum + item.count, 0)}
                </text>
              </svg>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 text-sm">
                  {item.name} {item.range}
                </span>
                <span className="text-white text-sm font-medium">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
