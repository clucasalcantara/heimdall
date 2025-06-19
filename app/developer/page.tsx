"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Code,
  Copy,
  Eye,
  Key,
  Play,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DeveloperPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("/analyze");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("hmd_live_sk_1234567890abcdef");
  const [apiSecret, setApiSecret] = useState("hmd_secret_abcdef1234567890");
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    // Set default request body for /analyze
    setRequestBody(
      JSON.stringify(
        {
          user_id: "traveler_12345",
          amount: 1500.0,
          currency: "USD",
          merchant_id: "merchant_midgard",
          merchant_category: "retail",
          email: "traveler@midgard.realm",
          ip_address: "192.168.1.1",
          billing_address: {
            country: "US",
            city: "New Asgard",
          },
          payment_method: {
            type: "credit_card",
            last_four: "1234",
          },
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
  }, []);

  const endpoints = [
    {
      path: "/analyze",
      method: "POST",
      description: "🔍 Invoke Heimdall's sight to analyze transaction",
      tag: "Fraud Detection",
    },
    {
      path: "/health",
      method: "GET",
      description: "💚 Check Heimdall's vitality",
      tag: "System",
    },
    {
      path: "/stats",
      method: "GET",
      description: "📊 View realm statistics",
      tag: "System",
    },
    {
      path: "/feedback",
      method: "POST",
      description: "📝 Send wisdom to Heimdall",
      tag: "Feedback",
    },
  ];

  const executeRequest = async () => {
    setLoading(true);
    setResponse("");

    try {
      const endpoint = endpoints.find((e) => e.path === selectedEndpoint);
      const method = endpoint?.method || "GET";

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-API-Secret": apiSecret,
        },
      };

      if (method === "POST" && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(`/api${selectedEndpoint}`, options);
      const data = await res.json();

      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(
        JSON.stringify(
          { error: "Request failed", message: (error as Error).message },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateNewApiKey = () => {
    const newKey = `hmd_live_sk_${Math.random().toString(36).substring(2, 18)}`;
    const newSecret = `hmd_secret_${Math.random()
      .toString(36)
      .substring(2, 18)}`;
    setApiKey(newKey);
    setApiSecret(newSecret);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "POST":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PUT":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "DELETE":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const updateRequestBody = (endpoint: string) => {
    switch (endpoint) {
      case "/analyze":
        setRequestBody(
          JSON.stringify(
            {
              user_id: "traveler_12345",
              amount: 1500.0,
              currency: "USD",
              merchant_id: "merchant_midgard",
              merchant_category: "retail",
              email: "traveler@midgard.realm",
              ip_address: "192.168.1.1",
              billing_address: {
                country: "US",
                city: "New Asgard",
              },
              payment_method: {
                type: "credit_card",
                last_four: "1234",
              },
              timestamp: new Date().toISOString(),
            },
            null,
            2
          )
        );
        break;
      case "/feedback":
        setRequestBody(
          JSON.stringify(
            {
              transaction_id: "txn_1705312200000",
              actual_fraud: false,
              notes: "Traveler confirmed legitimate passage through Bifrost",
            },
            null,
            2
          )
        );
        break;
      default:
        setRequestBody("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="credentials" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="credentials">🔑 API Credentials</TabsTrigger>
            <TabsTrigger value="playground">⚡ API Playground</TabsTrigger>
            <TabsTrigger value="docs">📖 Documentation</TabsTrigger>
            <TabsTrigger value="swagger">🌈 Interactive API</TabsTrigger>
            <TabsTrigger value="examples">🔮 Code Examples</TabsTrigger>
          </TabsList>

          {/* API Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Keys Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    🔑 Sacred API Credentials
                  </CardTitle>
                  <CardDescription>
                    Your divine keys to access Heimdall's power
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey" className="font-medium">
                      API Key
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="apiKey"
                        value={apiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="apiSecret" className="font-medium">
                      API Secret
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="apiSecret"
                        type={showSecret ? "text" : "password"}
                        value={apiSecret}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiSecret)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Button onClick={generateNewApiKey} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Credentials
                  </Button>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>⚡ Keep your secrets safe!</strong> Never expose
                      your API secret in client-side code. Store it securely in
                      environment variables.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Usage Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    📊 Usage Statistics
                  </CardTitle>
                  <CardDescription>
                    Your API usage across all realms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        1,247
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requests Today
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        99.8%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Success Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        42ms
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg Response
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        8.5k
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Monthly Quota
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Monthly Usage
                      </span>
                      <span className="font-medium">1,247 / 10,000</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "12.47%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Authentication Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  🛡️ Authentication Examples
                </CardTitle>
                <CardDescription>
                  How to authenticate your requests to Heimdall's API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">cURL Example</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {`curl -X POST https://your-realm.com/api/analyze \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "X-API-Secret: ${apiSecret}" \\
  -d '{"user_id": "user_123", "amount": 100.00, "currency": "USD"}'`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">JavaScript Example</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {`const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}',
    'X-API-Secret': '${apiSecret}'
  },
  body: JSON.stringify(transactionData)
});`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Playground Tab */}
          <TabsContent value="playground" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    🌈 API Testing Portal
                  </CardTitle>
                  <CardDescription>
                    Test Heimdall's divine endpoints interactively
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="endpoint" className="font-medium">
                      Sacred Endpoint
                    </Label>
                    <Select
                      value={selectedEndpoint}
                      onValueChange={(value) => {
                        setSelectedEndpoint(value);
                        updateRequestBody(value);
                        setResponse("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {endpoints.map((endpoint) => (
                          <SelectItem key={endpoint.path} value={endpoint.path}>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={getMethodColor(endpoint.method)}
                              >
                                {endpoint.method}
                              </Badge>
                              <span>{endpoint.path}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={getMethodColor(
                        endpoints.find((e) => e.path === selectedEndpoint)
                          ?.method || "GET"
                      )}
                    >
                      {
                        endpoints.find((e) => e.path === selectedEndpoint)
                          ?.method
                      }
                    </Badge>
                    <code className="bg-muted px-3 py-2 rounded text-sm font-mono">
                      ᚱ /api{selectedEndpoint}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`/api${selectedEndpoint}`)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {(selectedEndpoint === "/analyze" ||
                    selectedEndpoint === "/feedback") && (
                    <div>
                      <Label htmlFor="requestBody" className="font-medium">
                        Runic Request Body
                      </Label>
                      <Textarea
                        id="requestBody"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="font-mono text-sm h-64"
                        placeholder="Enter JSON request body..."
                      />
                    </div>
                  )}

                  <Button
                    onClick={executeRequest}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Heimdall is watching...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4" />⚡ Invoke Divine Power
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Response Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    🔮 Divine Response
                  </CardTitle>
                  <CardDescription>
                    Heimdall's wisdom will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          🌈 Bifrost Response:
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(response)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Runes
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono">
                        {response}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Eye className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg">Heimdall awaits your invocation</p>
                      <p className="text-sm">
                        Select an endpoint and click "Invoke Divine Power" to
                        see the response
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* API Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    🌈 Bifrost API Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {"<"} 300ms
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Lightning Response
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        99.9%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Divine Uptime SLA
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        1M+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requests/minute
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">🌈 Bifrost Base URL</h4>
                    <code className="bg-muted px-3 py-2 rounded block">
                      https://your-realm.com/api
                    </code>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">🛡️ Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your API key in the Authorization header and API
                      secret in the X-API-Secret header for secure access to
                      Heimdall's divine power.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints Documentation */}
              {endpoints.map((endpoint) => (
                <Card key={endpoint.path}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-primary">ᚱ {endpoint.path}</code>
                    </CardTitle>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {endpoint.path === "/analyze" && (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">
                            🔍 Divine Description
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Invokes Heimdall's all-seeing sight to analyze
                            transactions using Norse ML model and runic fraud
                            rules. Returns detailed analysis including threat
                            scores, triggered runes, and divine recommendations.
                          </p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            ⚡ Required Sacred Fields
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <code className="bg-muted px-2 py-1 rounded">
                              user_id
                            </code>
                            <code className="bg-muted px-2 py-1 rounded">
                              amount
                            </code>
                            <code className="bg-muted px-2 py-1 rounded">
                              currency
                            </code>
                            <code className="bg-muted px-2 py-1 rounded">
                              email
                            </code>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            🌈 Response Runes
                          </h5>
                          <div className="space-y-1 text-sm">
                            <div>
                              <code className="text-primary">
                                overall_score
                              </code>{" "}
                              - Combined threat score (0-1)
                            </div>
                            <div>
                              <code className="text-primary">risk_level</code> -
                              Low, Medium, High, Critical
                            </div>
                            <div>
                              <code className="text-primary">
                                recommendation
                              </code>{" "}
                              - Approve, Review, Decline
                            </div>
                            <div>
                              <code className="text-primary">
                                triggered_rules
                              </code>{" "}
                              - Array of triggered runic rules
                            </div>
                            <div>
                              <code className="text-primary">
                                processing_time_ms
                              </code>{" "}
                              - Lightning processing time
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {endpoint.path === "/health" && (
                      <div>
                        <h5 className="font-medium mb-2">
                          💚 Divine Description
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Returns Heimdall's vitality status, uptime across all
                          Nine Realms, and basic service information. Use this
                          endpoint for monitoring the Guardian's watchfulness.
                        </p>
                      </div>
                    )}

                    {endpoint.path === "/stats" && (
                      <div>
                        <h5 className="font-medium mb-2">
                          📊 Divine Description
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Returns comprehensive realm statistics including fraud
                          rates across all Nine Realms, accuracy metrics,
                          performance data, and threat distribution witnessed by
                          Heimdall's all-seeing eye.
                        </p>
                      </div>
                    )}

                    {endpoint.path === "/feedback" && (
                      <div>
                        <h5 className="font-medium mb-2">
                          📝 Divine Description
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Send wisdom to Heimdall about fraud detection
                          accuracy. This helps improve the Norse ML model and
                          runic rules through divine feedback loops across all
                          realms.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Swagger UI Tab */}
          <TabsContent value="swagger" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  🌈 Interactive API Documentation
                </h2>
                <p className="text-muted-foreground mt-1">
                  Complete OpenAPI 3.0 specification with interactive examples •
                  Heimdall is watching
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open("/api/swagger", "_blank")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Open in New Tab
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
              <div className="swagger-container">
                <iframe
                  src="/api/swagger"
                  className="w-full border-0"
                  style={{ height: "calc(100vh - 280px)" }}
                  title="Swagger UI Documentation"
                  onLoad={() => {
                    console.log(
                      "🌈 Bifrost API Portal loaded - Heimdall is watching"
                    );
                  }}
                />
              </div>
            </div>
          </TabsContent>

          {/* Code Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    🔮 Norse Integration Examples
                  </CardTitle>
                  <CardDescription>
                    Sacred code examples for integrating with Heimdall's divine
                    API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* JavaScript Example */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      JavaScript/TypeScript (Midgard Realm)
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`// Invoke Heimdall's sight for fraud detection
const analyzeTransaction = async (transactionData) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${apiKey}',
        'X-API-Secret': '${apiSecret}',
        'X-Realm': 'midgard'
      },
      body: JSON.stringify({
        user_id: 'traveler_12345',
        amount: 1500.00,
        currency: 'USD',
        merchant_id: 'merchant_midgard',
        email: 'traveler@midgard.realm',
        ip_address: '192.168.1.1',
        billing_address: {
          country: 'US',
          city: 'New Asgard'
        },
        payment_method: {
          type: 'credit_card',
          last_four: '1234'
        },
        timestamp: new Date().toISOString()
      })
    });

    const analysis = await response.json();
    
    // Heimdall's divine judgment
    if (analysis.risk_level === 'Critical') {
      console.log('🔴 Heimdall denies passage:', analysis.explanation);
      return 'DECLINE';
    } else if (analysis.risk_level === 'High') {
      console.log('🟡 Heimdall requires scrutiny:', analysis.triggered_rules);
      return 'REVIEW';
    } else {
      console.log('🟢 Heimdall grants passage:', analysis.confidence);
      return 'APPROVE';
    }
  } catch (error) {
    console.error('Failed to reach Heimdall:', error);
    return 'ERROR';
  }
};`}
                    </pre>
                  </div>

                  {/* Python Example */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      Python (Jotunheim Realm)
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`import requests
import json
from datetime import datetime

def invoke_heimdall_sight(transaction_data):
    """Invoke Heimdall's all-seeing eye for fraud detection"""
    
    url = "https://your-realm.com/api/analyze"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${apiKey}",
        "X-API-Secret": "${apiSecret}",
        "X-Realm": "jotunheim"
    }
    
    payload = {
        "user_id": "traveler_67890",
        "amount": 2500.00,
        "currency": "USD", 
        "merchant_id": "merchant_jotunheim",
        "email": "giant@jotunheim.realm",
        "ip_address": "10.0.0.1",
        "billing_address": {
            "country": "NO",
            "city": "Utgard"
        },
        "payment_method": {
            "type": "debit_card",
            "last_four": "5678"
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        analysis = response.json()
        
        # Interpret Heimdall's divine judgment
        risk_level = analysis.get('risk_level', 'Unknown')
        recommendation = analysis.get('recommendation', 'Review')
        
        print(f"🌈 Heimdall's Verdict: {risk_level}")
        print(f"⚡ Divine Command: {recommendation}")
        print(f"🔮 Confidence: {analysis.get('confidence', 0) * 100:.1f}%")
        
        return analysis
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to reach Heimdall: {e}")
        return None`}
                    </pre>
                  </div>

                  {/* cURL Example */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      cURL (Universal Bifrost)
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`# Invoke Heimdall's sight via sacred cURL runes
curl -X POST https://your-realm.com/api/analyze \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "X-API-Secret: ${apiSecret}" \\
  -H "X-Realm: alfheim" \\
  -d '{
    "user_id": "elf_traveler_999",
    "amount": 750.00,
    "currency": "EUR",
    "merchant_id": "merchant_alfheim", 
    "merchant_category": "luxury",
    "email": "lightelf@alfheim.realm",
    "ip_address": "172.16.0.1",
    "billing_address": {
      "country": "SE",
      "city": "Ljosalfgard"
    },
    "payment_method": {
      "type": "credit_card",
      "last_four": "9999"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }'

# Expected divine response:
# {
#   "transaction_id": "txn_1705312200000",
#   "overall_score": 0.15,
#   "ml_score": 0.12,
#   "rule_score": 0.18,
#   "risk_level": "Low",
#   "recommendation": "Approve",
#   "confidence": 0.92,
#   "processing_time_ms": 245,
#   "explanation": "Heimdall grants safe passage - traveler shows noble patterns",
#   "triggered_rules": []
# }`}
                    </pre>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>⚡ Heimdall's Wisdom:</strong> Always handle API
                      errors gracefully and implement proper retry logic. The
                      Guardian's sight is powerful but requires respectful
                      invocation across all Nine Realms.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
