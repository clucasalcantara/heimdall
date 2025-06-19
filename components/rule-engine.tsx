"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Trash2 } from "lucide-react"

// Sample rules
const initialRules = [
  {
    id: "rule_001",
    name: "High Amount Transaction",
    description: "Flag transactions with unusually high amounts",
    condition: "amount &gt; 1000",
    action: "review",
    enabled: true,
  },
  {
    id: "rule_002",
    name: "High Risk Country",
    description: "Block transactions from high-risk countries",
    condition: "country IN ['Nigeria', 'Ukraine']",
    action: "block",
    enabled: true,
  },
  {
    id: "rule_003",
    name: "New User High Amount",
    description: "Review transactions from new users with high amounts",
    condition: "user_age_days &lt; 30 AND amount &gt; 500",
    action: "review",
    enabled: true,
  },
  {
    id: "rule_004",
    name: "Velocity Check",
    description: "Block users with too many transactions in a short time",
    condition: "transaction_velocity_1h &gt; 5",
    action: "block",
    enabled: false,
  },
]

export function RuleEngine() {
  const [rules, setRules] = useState(initialRules)
  const [editingRule, setEditingRule] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("rules")

  const handleEditRule = (rule: any) => {
    setEditingRule({ ...rule })
    setActiveTab("editor")
  }

  const handleCreateRule = () => {
    setEditingRule({
      id: `rule_${Math.floor(Math.random() * 10000)}`,
      name: "",
      description: "",
      condition: "",
      action: "review",
      enabled: true,
    })
    setActiveTab("editor")
  }

  const handleSaveRule = () => {
    if (!editingRule) return

    const isNew = !rules.find((r) => r.id === editingRule.id)

    if (isNew) {
      setRules([...rules, editingRule])
    } else {
      setRules(rules.map((r) => (r.id === editingRule.id ? editingRule : r)))
    }

    setActiveTab("rules")
    setEditingRule(null)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, enabled } : r)))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fraud Detection Rules</CardTitle>
        <Button onClick={handleCreateRule}>
          <Plus className="mr-2 h-4 w-4" />
          New Rule
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules">Rules List</TabsTrigger>
            <TabsTrigger value="editor" disabled={!editingRule}>
              Rule Editor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rules">
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="rounded-md border p-4 transition-all hover:border-primary/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                      />
                      <h3 className="font-medium">{rule.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="rounded-md bg-muted px-2 py-1 text-xs">
                      <span className="font-medium">Condition:</span> {rule.condition}
                    </div>
                    <div className="rounded-md bg-muted px-2 py-1 text-xs">
                      <span className="font-medium">Action:</span> <span className="capitalize">{rule.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="editor">
            {editingRule && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                    placeholder="Enter rule name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingRule.description}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what this rule does"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Textarea
                    id="condition"
                    value={editingRule.condition}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        condition: e.target.value,
                      })
                    }
                    placeholder="e.g. amount &gt; 1000 AND country IN ['Nigeria']"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use logical operators (AND, OR) and comparison operators (=, &gt;, &lt;, IN)
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action">Action</Label>
                  <Select
                    value={editingRule.action}
                    onValueChange={(value) => setEditingRule({ ...editingRule, action: value })}
                  >
                    <SelectTrigger id="action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={editingRule.enabled}
                    onCheckedChange={(checked) => setEditingRule({ ...editingRule, enabled: checked })}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab("rules")
                      setEditingRule(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRule}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Rule
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
