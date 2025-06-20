"use client";

import {
  Bar,
  BarChart,
  Cell,
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

interface CountryStat {
  name: string;
  value: number;
  transactions: number;
}

const COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"]; // Purple shades

export function TopRiskyCountries() {
  const [data, setData] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountryData();
    const interval = setInterval(fetchCountryData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCountryData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/countries");
      if (response.ok) {
        const newData: CountryStat[] = await response.json();
        // If API returns empty or no data, use sample data for demonstration
        if (newData && newData.length > 0) {
          setData(newData.sort((a, b) => b.value - a.value).slice(0, 5));
        } else {
          // Fallback to sample data if API returns nothing
          setData(
            [
              { name: "Germany", value: 75, transactions: 120 },
              { name: "Nigeria", value: 68, transactions: 85 },
              { name: "China", value: 62, transactions: 95 },
              { name: "Ukraine", value: 55, transactions: 60 },
              { name: "Vietnam", value: 50, transactions: 70 },
            ]
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
          );
        }
      } else {
        // Fallback to sample data on API error
        setData(
          [
            { name: "Germany", value: 75, transactions: 120 },
            { name: "Nigeria", value: 68, transactions: 85 },
            { name: "China", value: 62, transactions: 95 },
            { name: "Ukraine", value: 55, transactions: 60 },
            { name: "Vietnam", value: 50, transactions: 70 },
          ]
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
        );
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
      // Fallback to sample data on fetch error
      setData(
        [
          { name: "Germany", value: 75, transactions: 120 },
          { name: "Nigeria", value: 68, transactions: 85 },
          { name: "China", value: 62, transactions: 95 },
          { name: "Ukraine", value: 55, transactions: 60 },
          { name: "Vietnam", value: 50, transactions: 70 },
        ]
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      );
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-primary">{item.value}% average risk</p>
          <p className="text-muted-foreground">
            {item.transactions} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Top Risky Countries</CardTitle>
        <CardDescription>
          Countries with highest average risk scores
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                width={60} // Adjusted for potentially longer country names
                interval={0}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--accent))", fillOpacity: 0.3 }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
