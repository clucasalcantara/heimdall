"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { TransactionDetailsDialog } from "./transaction-details-dialog";
import { useState } from "react";

// Generate more sample data
const generateTransactions = (count: number) => {
  const countries = [
    "United States",
    "Germany",
    "Nigeria",
    "France",
    "Japan",
    "Brazil",
    "Canada",
    "Ukraine",
    "Indonesia",
    "United Kingdom",
  ];

  const transactions = [];

  for (let i = 0; i < count; i++) {
    const riskScore = Math.floor(Math.random() * 100);
    let decision = "approve";

    if (riskScore > 70) {
      decision = "block";
    } else if (riskScore > 30) {
      decision = "review";
    }

    const amount = Math.floor(Math.random() * 5000) + 10;
    const formattedAmount =
      amount > 999 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;

    const minutesAgo = Math.floor(Math.random() * 60) + 1;

    transactions.push({
      id: `TX${100000 + i}`,
      user: `user_${1000 + Math.floor(Math.random() * 9000)}`,
      country: countries[Math.floor(Math.random() * countries.length)],
      amount: formattedAmount,
      time: `${minutesAgo} mins ago`,
      riskScore,
      decision,
    });
  }

  return transactions;
};

const allTransactions = generateTransactions(200); // Generate more transactions

export function TransactionFeed() {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    decision: "all",
    country: "all",
    riskRange: [0, 100],
    limit: 25,
  });

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const filteredTransactions = allTransactions
    .filter((tx) => {
      if (filters.decision !== "all" && tx.decision !== filters.decision) {
        return false;
      }

      if (filters.country !== "all" && tx.country !== filters.country) {
        return false;
      }

      if (
        tx.riskScore < filters.riskRange[0] ||
        tx.riskScore > filters.riskRange[1]
      ) {
        return false;
      }

      return true;
    })
    .slice(0, filters.limit); // Apply limit here

  const uniqueCountries = Array.from(
    new Set(allTransactions.map((tx) => tx.country))
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="mb-4 md:mb-6">
        <CardContent className="pt-4 md:pt-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="decision" className="text-sm font-medium">
                Decision
              </Label>
              <Select
                value={filters.decision}
                onValueChange={(value) =>
                  setFilters({ ...filters, decision: value })
                }
              >
                <SelectTrigger id="decision" className="mt-1">
                  <SelectValue placeholder="All Decisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              <Select
                value={filters.country}
                onValueChange={(value) =>
                  setFilters({ ...filters, country: value })
                }
              >
                <SelectTrigger id="country" className="mt-1">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Label className="text-sm font-medium">
                Risk Score Range: {filters.riskRange[0]} -{" "}
                {filters.riskRange[1]}
              </Label>
              <Slider
                defaultValue={[0, 100]}
                min={0}
                max={100}
                step={1}
                value={filters.riskRange}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    riskRange: value as [number, number],
                  })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="limit" className="text-sm font-medium">
                Limit
              </Label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) =>
                  setFilters({ ...filters, limit: Number.parseInt(value) })
                }
              >
                <SelectTrigger id="limit" className="mt-1">
                  <SelectValue placeholder="25 transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 transactions</SelectItem>
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

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {allTransactions.length}{" "}
              transactions
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 md:px-4 py-3 text-left font-medium">
                    ID
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium hidden sm:table-cell">
                    User
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium">
                    Country
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium">
                    Amount
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium hidden md:table-cell">
                    Time
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium">
                    Risk
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left font-medium">
                    Decision
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`border-b hover:bg-muted/50 cursor-pointer ${
                      tx.decision === "block"
                        ? "bg-red-50/50"
                        : tx.decision === "review"
                        ? "bg-yellow-50/50"
                        : ""
                    }`}
                    onClick={() => handleRowClick(tx)}
                  >
                    <td className="px-2 md:px-4 py-3 font-mono text-xs">
                      {tx.id.slice(0, 6)}...
                    </td>
                    <td className="px-2 md:px-4 py-3 hidden sm:table-cell text-xs md:text-sm">
                      {tx.user}
                    </td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm">
                      {tx.country}
                    </td>
                    <td className="px-2 md:px-4 py-3 font-semibold text-xs md:text-sm">
                      {tx.amount}
                    </td>
                    <td className="px-2 md:px-4 py-3 hidden md:table-cell text-xs">
                      {tx.time}
                    </td>
                    <td className="px-2 md:px-4 py-3">
                      <RiskScoreBadge score={tx.riskScore} />
                    </td>
                    <td className="px-2 md:px-4 py-3">
                      <DecisionBadge decision={tx.decision} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}

function RiskScoreBadge({ score }: { score: number }) {
  let color = "bg-green-100 text-green-800";
  if (score > 70) {
    color = "bg-red-100 text-red-800";
  } else if (score > 30) {
    color = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span
      className={`inline-block rounded-full px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-medium ${color}`}
    >
      {score}
    </span>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const baseClasses = "text-xs px-1.5 md:px-2 py-0.5 md:py-1";

  switch (decision) {
    case "approve":
      return (
        <Badge
          variant="outline"
          className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-100`}
        >
          Approve
        </Badge>
      );
    case "review":
      return (
        <Badge
          variant="outline"
          className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-100`}
        >
          Review
        </Badge>
      );
    case "block":
      return (
        <Badge
          variant="outline"
          className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-100`}
        >
          Block
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          {decision}
        </Badge>
      );
  }
}
