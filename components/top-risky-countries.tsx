"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"

export function TopRiskyCountries() {
  const [data, setData] = useState([
    { name: "Nigeria", value: 85, transactions: 45 },
    { name: "Ukraine", value: 72, transactions: 23 },
    { name: "Indonesia", value: 68, transactions: 31 },
    { name: "Brazil", value: 65, transactions: 67 },
    { name: "Vietnam", value: 62, transactions: 19 },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCountryData()
    const interval = setInterval(fetchCountryData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchCountryData = async () => {
    try {
      const response = await fetch("/api/dashboard/countries")
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
      }
    } catch (error) {
      console.error("Error fetching country data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Top Risky Countries</CardTitle>
        <CardDescription className="text-gray-400">Countries with highest average risk scores</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <ChartContainer
            config={{
              risk: {
                label: "Risk Score",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#F9FAFB" }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#F9FAFB" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#374151",
                    border: "1px solid #4B5563",
                    borderRadius: "6px",
                    color: "#F9FAFB",
                  }}
                  formatter={(value, name, props) => [`${value}% risk`, `${props.payload.transactions} transactions`]}
                />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
