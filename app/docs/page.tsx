"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Code,
  Copy,
  Eye,
  Play,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("/analyze");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null);

  useEffect(() => {
    // Load Swagger spec
    fetch("/api/docs")
      .then((res) => res.json())
      .then((spec) => setSwaggerSpec(spec))
      .catch((err) => console.error("Failed to load API spec:", err));

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

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PUT":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Nordic Header */}
      {/* Nordic Header with Golden Guardian theme */}
      <div className="relative bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white overflow-hidden">
        {/* Mystical background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23fbbf24 fillOpacity=0.1%3E%3Cpath d=M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 rounded-full opacity-30 animate-pulse"></div>
              <Eye className="relative h-8 w-8 text-amber-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
            </div>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent font-bold">
              HEIMDALL'S SACRED DOCUMENTATION
            </span>
            <Badge
              variant="outline"
              className="ml-2 border-amber-400 text-amber-400 bg-amber-400/10"
            >
              <Code className="h-3 w-3 mr-1" />
              v1.0.0
            </Badge>
          </h1>
          <p className="text-amber-200 mt-2 font-medium">
            ⚔️{" "}
            <strong className="text-amber-400">
              HEIMDALL IS ALWAYS WATCHING
            </strong>{" "}
            • OpenAPI 3.0 specification •
            <span className="text-blue-200">
              Divine wisdom across all Nine Realms
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="playground" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <TabsTrigger
              value="playground"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              ⚡ API Testing Grounds
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              📖 Sacred Documentation
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              🔮 Norse Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Panel */}
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Play className="h-5 w-5 text-blue-600" />
                    🌈 Bifrost Testing Portal
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Test Heimdall's divine endpoints interactively
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label
                      htmlFor="endpoint"
                      className="text-slate-700 font-medium"
                    >
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
                      <SelectTrigger className="border-slate-300 focus:border-blue-500">
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
                    <code className="bg-slate-100 px-3 py-2 rounded text-sm font-mono">
                      ᚱ /api{selectedEndpoint}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`/api${selectedEndpoint}`)}
                      className="border-slate-300"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {(selectedEndpoint === "/analyze" ||
                    selectedEndpoint === "/feedback") && (
                    <div>
                      <Label
                        htmlFor="requestBody"
                        className="text-slate-700 font-medium"
                      >
                        Runic Request Body
                      </Label>
                      <Textarea
                        id="requestBody"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="font-mono text-sm h-64 border-slate-300 focus:border-blue-500"
                        placeholder="Enter JSON request body..."
                      />
                    </div>
                  )}

                  <Button
                    onClick={executeRequest}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
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
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Eye className="h-5 w-5 text-amber-600" />
                    🔮 Divine Response
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Heimdall's wisdom will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {response ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">
                          🌈 Bifrost Response:
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(response)}
                          className="border-slate-300"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Runes
                        </Button>
                      </div>
                      <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono border border-slate-200">
                        {response}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-12">
                      <Eye className="h-12 w-12 mx-auto text-slate-300 mb-4" />
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

          <TabsContent value="docs" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* API Overview */}
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Shield className="h-5 w-5 text-blue-600" />
                    🌈 Bifrost API Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {"<"} 300ms
                      </div>
                      <div className="text-sm text-slate-600">
                        Lightning Response
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        99.9%
                      </div>
                      <div className="text-sm text-slate-600">
                        Divine Uptime SLA
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        1M+
                      </div>
                      <div className="text-sm text-slate-600">
                        Requests/minute
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-slate-800">
                      🌈 Bifrost Base URL
                    </h4>
                    <code className="bg-slate-100 px-3 py-2 rounded block border border-slate-200">
                      https://your-realm.com/api
                    </code>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-slate-800">
                      🛡️ Authentication
                    </h4>
                    <p className="text-sm text-slate-600">
                      Currently no authentication required for demo realm. In
                      production, use sacred API keys or divine JWT tokens
                      blessed by Heimdall.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints Documentation */}
              {endpoints.map((endpoint) => (
                <Card
                  key={endpoint.path}
                  className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg"
                >
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-blue-600">ᚱ {endpoint.path}</code>
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {endpoint.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {endpoint.path === "/analyze" && (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2 text-slate-800">
                            🔍 Divine Description
                          </h5>
                          <p className="text-sm text-slate-600">
                            Invokes Heimdall's all-seeing sight to analyze
                            transactions using Norse ML model and runic fraud
                            rules. Returns detailed analysis including threat
                            scores, triggered runes, and divine recommendations.
                          </p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2 text-slate-800">
                            ⚡ Required Sacred Fields
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              user_id
                            </code>
                            <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              amount
                            </code>
                            <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              currency
                            </code>
                            <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              email
                            </code>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2 text-slate-800">
                            🌈 Response Runes
                          </h5>
                          <div className="space-y-1 text-sm">
                            <div>
                              <code className="text-blue-600">
                                overall_score
                              </code>{" "}
                              - Combined threat score (0-1)
                            </div>
                            <div>
                              <code className="text-blue-600">risk_level</code>{" "}
                              - Low, Medium, High, Critical
                            </div>
                            <div>
                              <code className="text-blue-600">
                                recommendation
                              </code>{" "}
                              - Approve, Review, Decline
                            </div>
                            <div>
                              <code className="text-blue-600">
                                triggered_rules
                              </code>{" "}
                              - Array of triggered runic rules
                            </div>
                            <div>
                              <code className="text-blue-600">
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
                        <h5 className="font-medium mb-2 text-slate-800">
                          💚 Divine Description
                        </h5>
                        <p className="text-sm text-slate-600">
                          Returns Heimdall's vitality status, uptime across all
                          Nine Realms, and basic service information. Use this
                          endpoint for monitoring the Guardian's watchfulness.
                        </p>
                      </div>
                    )}

                    {endpoint.path === "/stats" && (
                      <div>
                        <h5 className="font-medium mb-2 text-slate-800">
                          📊 Divine Description
                        </h5>
                        <p className="text-sm text-slate-600">
                          Returns comprehensive realm statistics including fraud
                          rates across all Nine Realms, accuracy metrics,
                          performance data, and threat distribution witnessed by
                          Heimdall's all-seeing eye.
                        </p>
                      </div>
                    )}

                    {endpoint.path === "/feedback" && (
                      <div>
                        <h5 className="font-medium mb-2 text-slate-800">
                          📝 Divine Description
                        </h5>
                        <p className="text-sm text-slate-600">
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

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Code className="h-5 w-5 text-purple-600" />
                    🔮 Norse Integration Examples
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Sacred code examples for integrating with Heimdall's divine
                    API
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* JavaScript Example */}
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-600" />
                      JavaScript/TypeScript (Midgard Realm)
                    </h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
                      {`// Invoke Heimdall's sight for fraud detection
const analyzeTransaction = async (transactionData) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
                    <h4 className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      Python (Jotunheim Realm)
                    </h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
                      {`import requests
import json
from datetime import datetime

def invoke_heimdall_sight(transaction_data):
    """Invoke Heimdall's all-seeing eye for fraud detection"""
    
    url = "https://your-realm.com/api/analyze"
    headers = {
        "Content-Type": "application/json",
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
                    <h4 className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-600" />
                      cURL (Universal Bifrost)
                    </h4>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
                      {`# Invoke Heimdall's sight via sacred cURL runes
curl -X POST https://your-realm.com/api/analyze \\
  -H "Content-Type: application/json" \\
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

                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
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
