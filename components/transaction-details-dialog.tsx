"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ShieldX } from "lucide-react"

interface TransactionDetailsDialogProps {
  transaction: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailsDialog({ transaction, open, onOpenChange }: TransactionDetailsDialogProps) {
  if (!transaction) return null

  const mockPayload = {
    transaction_id: transaction.id,
    user_id: transaction.user,
    merchant_id: "merchant_45678",
    amount: transaction.amount.replace("$", ""),
    currency: "USD",
    timestamp: new Date().toISOString(),
    ip_address: "192.168.1.1",
    device_id: "device_12345",
    country: transaction.country,
    payment_method: {
      type: "credit_card",
      last4: "4242",
      expiry: "04/25",
    },
  }

  const mockFeatures = {
    user_age_days: 120,
    transaction_velocity_24h: 3,
    transaction_velocity_1h: 1,
    distance_from_last_transaction_km: 0,
    amount_vs_average: 1.2,
    is_high_risk_country: transaction.riskScore > 70,
    is_new_payment_method: false,
    device_reputation_score: 0.9,
  }

  const mockRules = [
    {
      id: "rule_001",
      name: "High Amount Transaction",
      condition: "amount > 1000",
      triggered: Number.parseFloat(transaction.amount.replace("$", "").replace(",", "")) > 1000,
    },
    {
      id: "rule_002",
      name: "High Risk Country",
      condition: "country IN ['Nigeria', 'Ukraine']",
      triggered: ["Nigeria", "Ukraine"].includes(transaction.country),
    },
    {
      id: "rule_003",
      name: "New User High Amount",
      condition: "user_age_days < 30 AND amount > 500",
      triggered:
        mockFeatures.user_age_days < 30 &&
        Number.parseFloat(transaction.amount.replace("$", "").replace(",", "")) > 500,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Transaction {transaction.id}</DialogTitle>
          <DialogDescription>
            Processed {transaction.time} with risk score {transaction.riskScore}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="payload">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payload">Payload</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>
          <TabsContent value="payload" className="max-h-[400px] overflow-auto">
            <pre className="rounded-md bg-muted p-4 text-sm">{JSON.stringify(mockPayload, null, 2)}</pre>
          </TabsContent>
          <TabsContent value="features" className="max-h-[400px] overflow-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(mockFeatures).map(([key, value]) => (
                  <div key={key} className="rounded-md border p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="rules" className="max-h-[400px] overflow-auto">
            <div className="space-y-2">
              {mockRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`rounded-md border p-3 ${rule.triggered ? "border-red-300 bg-red-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{rule.name}</div>
                    {rule.triggered && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Triggered
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">Condition: {rule.condition}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex items-center text-sm">
            <span className="font-medium">Final Decision:</span>
            <span className="ml-2 capitalize">{transaction.decision}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <ShieldX className="h-4 w-4" />
              Mark as Fraud
            </Button>
            <Button className="gap-1">
              <CheckCircle className="h-4 w-4" />
              Mark as Legit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
