"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Plus } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { TransactionDetailsDialog } from "./transaction-details-dialog"

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [generating, setGenerating] = useState(false)

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/transactions?limit=20")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
    const interval = setInterval(fetchTransactions, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [fetchTransactions])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTransactions()
  }

  const handleGenerateTransaction = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/generate-transaction", { method: "POST" })
      if (response.ok) {
        // Wait a moment then refresh to show the new transaction
        setTimeout(() => {
          fetchTransactions()
        }, 500)
      }
    } catch (error) {
      console.error("Error generating transaction:", error)
    } finally {
      setGenerating(false)
    }
  }

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400">
              Latest transactions processed by the system • Auto-refreshes every 10s
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateTransaction}
              disabled={generating}
              className="border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              <Plus className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
              Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4 animate-pulse">
                  <div className="h-4 w-20 bg-gray-700 rounded"></div>
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  <div className="h-4 w-20 bg-gray-700 rounded"></div>
                  <div className="h-4 w-16 bg-gray-700 rounded"></div>
                  <div className="h-4 w-16 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No transactions yet</p>
              <Button
                onClick={handleGenerateTransaction}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate Sample Transaction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-medium text-gray-200">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-200">User</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-200">Country</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-200">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-200">Time</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-200">Risk Score</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-200">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer text-gray-300 transition-colors"
                      onClick={() => handleRowClick(tx)}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{tx.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3">{tx.user}</td>
                      <td className="px-4 py-3">{tx.country}</td>
                      <td className="px-4 py-3 font-semibold">{tx.amount}</td>
                      <td className="px-4 py-3 text-gray-400">{tx.time}</td>
                      <td className="px-4 py-3">
                        <RiskScoreBadge score={tx.riskScore} />
                      </td>
                      <td className="px-4 py-3">
                        <DecisionBadge decision={tx.decision} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <TransactionDetailsDialog transaction={selectedTransaction} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

function RiskScoreBadge({ score }: { score: number }) {
  let color = "bg-green-900 text-green-300 border-green-700"
  if (score > 70) {
    color = "bg-red-900 text-red-300 border-red-700"
  } else if (score > 30) {
    color = "bg-yellow-900 text-yellow-300 border-yellow-700"
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${color}`}>
      {score}
    </span>
  )
}

function DecisionBadge({ decision }: { decision: string }) {
  switch (decision) {
    case "approve":
      return (
        <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 hover:bg-green-900">
          Approve
        </Badge>
      )
    case "review":
      return (
        <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-700 hover:bg-yellow-900">
          Review
        </Badge>
      )
    case "decline":
      return (
        <Badge variant="outline" className="bg-red-900 text-red-300 border-red-700 hover:bg-red-900">
          Decline
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {decision}
        </Badge>
      )
  }
}
