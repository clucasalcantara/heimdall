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

const transactions = generateTransactions(50);

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

  const filteredTransactions = transactions
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
    .slice(0, filters.limit);

  const uniqueCountries = Array.from(
    new Set(transactions.map((tx) => tx.country))
  );

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="decision">Decision</Label>
              <Select
                value={filters.decision}
                onValueChange={(value) =>
                  setFilters({ ...filters, decision: value })
                }
              >
                <SelectTrigger id="decision">
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
              <Label htmlFor="country">Country</Label>
              <Select
                value={filters.country}
                onValueChange={(value) =>
                  setFilters({ ...filters, country: value })
                }
              >
                <SelectTrigger id="country">
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
            <div className="md:col-span-2">
              <Label>
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
              <Label htmlFor="limit">Limit</Label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) =>
                  setFilters({ ...filters, limit: Number.parseInt(value) })
                }
              >
                <SelectTrigger id="limit">
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
          <div className="flex items-center justify-between p-4 border-b">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} transactions
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">User</th>
                  <th className="px-4 py-3 text-left font-medium">Country</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Risk Score
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Decision</th>
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
                    <td className="px-4 py-3">{tx.id}</td>
                    <td className="px-4 py-3">{tx.user}</td>
                    <td className="px-4 py-3">{tx.country}</td>
                    <td className="px-4 py-3">{tx.amount}</td>
                    <td className="px-4 py-3">{tx.time}</td>
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
        </CardContent>
      </Card>

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
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
      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${color}`}
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
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          Approve
        </Badge>
      );
    case "review":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
          Review
        </Badge>
      );
    case "block":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 hover:bg-red-100"
        >
          Block
        </Badge>
      );
    default:
      return <Badge variant="outline">{decision}</Badge>;
  }
}
