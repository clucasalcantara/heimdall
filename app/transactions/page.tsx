"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, Plus, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TransactionDetailsDialog } from "@/components/transaction-details-dialog";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Filter states
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [riskRange, setRiskRange] = useState([0, 100]);
  const [limit, setLimit] = useState(50);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(decisionFilter !== "all" && { decision: decisionFilter }),
        ...(countryFilter !== "all" && { country: countryFilter }),
        minRisk: riskRange[0].toString(),
        maxRisk: riskRange[1].toString(),
      });

      const response = await fetch(`/api/dashboard/transactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [decisionFilter, countryFilter, riskRange, limit]);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleGenerateTransaction = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-transaction", {
        method: "POST",
      });
      if (response.ok) {
        // Wait a moment then refresh to show the new transaction
        setTimeout(() => {
          fetchTransactions();
        }, 500);
      }
    } catch (error) {
      console.error("Error generating transaction:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const countries = [
    { value: "all", label: "All Countries" },
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "BR", label: "Brazil" },
    { value: "MX", label: "Mexico" },
    { value: "NG", label: "Nigeria" },
    { value: "UA", label: "Ukraine" },
    { value: "ID", label: "Indonesia" },
    { value: "VN", label: "Vietnam" },
    { value: "CN", label: "China" },
    { value: "RU", label: "Russia" },
    { value: "IN", label: "India" },
    { value: "JP", label: "Japan" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Transaction Monitor</h1>
          <p className="text-gray-400">
            Monitor and review all transactions in real-time
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Decision
                </label>
                <Select
                  value={decisionFilter}
                  onValueChange={setDecisionFilter}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Decisions</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="decline">Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Country
                </label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center">
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Risk Score Range: {riskRange[0]} - {riskRange[1]}
                </label>
                <Slider
                  value={riskRange}
                  onValueChange={setRiskRange}
                  max={100}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200 mb-2 block">
                  Limit
                </label>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => setLimit(Number.parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="25">25 transactions</SelectItem>
                    <SelectItem value="50">50 transactions</SelectItem>
                    <SelectItem value="100">100 transactions</SelectItem>
                    <SelectItem value="200">200 transactions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <CardDescription className="text-gray-400">
                Showing {transactions.length} transactions • Auto-refreshes
                every 15s
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
                <Plus
                  className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`}
                />
                Generate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
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
                <p className="text-gray-400 mb-4">
                  No transactions found matching your filters
                </p>
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
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        User
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        Country
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        Risk Score
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-200">
                        Decision
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any) => (
                      <tr
                        key={tx.id}
                        className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer text-gray-300 transition-colors"
                        onClick={() => handleRowClick(tx)}
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          {tx.id.slice(0, 8)}...
                        </td>
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
      </div>

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}

function RiskScoreBadge({ score }: { score: number }) {
  let color = "bg-green-900 text-green-300 border-green-700";
  if (score > 70) {
    color = "bg-red-900 text-red-300 border-red-700";
  } else if (score > 30) {
    color = "bg-yellow-900 text-yellow-300 border-yellow-700";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${color}`}
    >
      {score}
    </span>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  switch (decision) {
    case "approve":
      return (
        <Badge
          variant="outline"
          className="bg-green-900 text-green-300 border-green-700 hover:bg-green-900"
        >
          Approve
        </Badge>
      );
    case "review":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-900 text-yellow-300 border-yellow-700 hover:bg-yellow-900"
        >
          Review
        </Badge>
      );
    case "decline":
      return (
        <Badge
          variant="outline"
          className="bg-red-900 text-red-300 border-red-700 hover:bg-red-900"
        >
          Decline
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {decision}
        </Badge>
      );
  }
}
