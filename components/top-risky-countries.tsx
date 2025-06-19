"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export function TopRiskyCountries() {
  const [data, setData] = useState([
    { name: "Nigeria", value: 85, transactions: 45 },
    { name: "Ukraine", value: 72, transactions: 23 },
    { name: "Indonesia", value: 68, transactions: 31 },
    { name: "Brazil", value: 65, transactions: 67 },
    { name: "Vietnam", value: 62, transactions: 19 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountryData();
    const interval = setInterval(fetchCountryData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCountryData = async () => {
    try {
      const response = await fetch("/api/dashboard/countries");
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-purple-400">{data.value}% average risk</p>
          <p className="text-gray-300 text-sm">
            {data.transactions} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Top Risky Countries</CardTitle>
        <CardDescription className="text-gray-400">
          Countries with highest average risk scores
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#F9FAFB", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={{ stroke: "#374151" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#F9FAFB", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={{ stroke: "#374151" }}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
