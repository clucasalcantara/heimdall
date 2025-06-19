"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"
import { useEffect, useState } from "react"

export function RiskDistributionChart() {
  const [data, setData] = useState([
    { name: "Low Risk (0-30)", value: 70, color: "#10b981" },
    { name: "Medium Risk (31-70)", value: 20, color: "#f59e0b" },
    { name: "High Risk (71-100)", value: 10, color: "#ef4444" },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRiskDistribution()
    const interval = setInterval(fetchRiskDistribution, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchRiskDistribution = async () => {
    try {
      const response = await fetch("/api/dashboard/risk-distribution")
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
      }
    } catch (error) {
      console.error("Error fetching risk distribution:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Risk Distribution</CardTitle>
        <CardDescription className="text-gray-400">Distribution of transactions by risk score</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <ChartContainer
            config={{
              low: {
                label: "Low Risk",
                color: "#10b981",
              },
              medium: {
                label: "Medium Risk",
                color: "#f59e0b",
              },
              high: {
                label: "High Risk",
                color: "#ef4444",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#374151",
                    border: "1px solid #4B5563",
                    borderRadius: "6px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend wrapperStyle={{ color: "#F9FAFB" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
