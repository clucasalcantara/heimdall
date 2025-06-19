import { NextResponse } from "next/server";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Heimdall Anti-Fraud API",
    version: "1.0.0",
    description: "Real-time fraud detection system with ML + Rules Engine",
    contact: {
      name: "Heimdall Team",
      email: "support@heimdall.com",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Development server",
    },
  ],
  paths: {
    "/analyze": {
      post: {
        summary: "Analyze transaction for fraud",
        description:
          "Analyzes a transaction using ML model and fraud rules to determine risk level",
        tags: ["Fraud Detection"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Transaction",
              },
              example: {
                user_id: "user_12345",
                amount: 1500.0,
                currency: "USD",
                merchant_id: "merchant_abc",
                merchant_category: "retail",
                email: "user@example.com",
                ip_address: "192.168.1.1",
                billing_address: {
                  country: "US",
                  city: "New York",
                },
                payment_method: {
                  type: "credit_card",
                  last_four: "1234",
                },
                timestamp: "2024-01-15T10:30:00Z",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Fraud analysis completed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FraudAnalysis",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health check",
        description: "Returns system health status and basic information",
        tags: ["System"],
        responses: {
          "200": {
            description: "System is healthy",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthCheck",
                },
              },
            },
          },
        },
      },
    },
    "/stats": {
      get: {
        summary: "System statistics",
        description:
          "Returns fraud detection statistics and performance metrics",
        tags: ["System"],
        responses: {
          "200": {
            description: "Statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SystemStats",
                },
              },
            },
          },
        },
      },
    },
    "/feedback": {
      post: {
        summary: "Submit feedback",
        description:
          "Submit feedback about fraud detection accuracy for model improvement",
        tags: ["Feedback"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Feedback",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Feedback submitted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Feedback submitted successfully",
                    },
                    transaction_id: { type: "string", example: "txn_12345" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Transaction: {
        type: "object",
        required: ["user_id", "amount", "currency", "email"],
        properties: {
          user_id: {
            type: "string",
            description: "Unique user identifier",
            example: "user_12345",
          },
          amount: {
            type: "number",
            minimum: 0,
            description: "Transaction amount",
            example: 1500.0,
          },
          currency: {
            type: "string",
            enum: ["USD", "EUR", "BRL", "GBP"],
            description: "Transaction currency",
            example: "USD",
          },
          merchant_id: {
            type: "string",
            description: "Merchant identifier",
            example: "merchant_abc",
          },
          merchant_category: {
            type: "string",
            enum: [
              "retail",
              "food",
              "gas",
              "online",
              "travel",
              "entertainment",
              "gambling",
              "adult",
              "crypto",
            ],
            description: "Merchant category",
            example: "retail",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@example.com",
          },
          ip_address: {
            type: "string",
            description: "User IP address",
            example: "192.168.1.1",
          },
          billing_address: {
            type: "object",
            properties: {
              country: {
                type: "string",
                description: "Country code",
                example: "US",
              },
              city: {
                type: "string",
                description: "City name",
                example: "New York",
              },
            },
          },
          payment_method: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "credit_card",
                  "debit_card",
                  "bank_transfer",
                  "digital_wallet",
                ],
                example: "credit_card",
              },
              last_four: {
                type: "string",
                pattern: "^[0-9]{4}$",
                example: "1234",
              },
            },
          },
          timestamp: {
            type: "string",
            format: "date-time",
            description: "Transaction timestamp (ISO 8601)",
            example: "2024-01-15T10:30:00Z",
          },
        },
      },
      FraudAnalysis: {
        type: "object",
        properties: {
          transaction_id: {
            type: "string",
            description: "Unique transaction identifier",
            example: "txn_1705312200000",
          },
          overall_score: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "Overall fraud score (0-1)",
            example: 0.35,
          },
          ml_score: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "Machine learning model score",
            example: 0.28,
          },
          rule_score: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "Rules engine score",
            example: 0.42,
          },
          risk_level: {
            type: "string",
            enum: ["Low", "Medium", "High", "Critical"],
            description: "Risk level classification",
            example: "Medium",
          },
          triggered_rules: {
            type: "array",
            items: { type: "string" },
            description: "List of triggered fraud rules",
            example: ["large_amount", "unusual_time"],
          },
          rule_details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ruleName: { type: "string", example: "large_amount" },
                triggered: { type: "boolean", example: true },
                score: { type: "number", example: 0.5 },
                reason: {
                  type: "string",
                  example:
                    "Transaction amount $1,500 exceeds large transaction threshold",
                },
                severity: {
                  type: "string",
                  enum: ["low", "medium", "high", "critical"],
                  example: "medium",
                },
                category: {
                  type: "string",
                  enum: [
                    "amount",
                    "velocity",
                    "geo",
                    "behavioral",
                    "device",
                    "merchant",
                  ],
                  example: "amount",
                },
              },
            },
          },
          features: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", example: "amount_log" },
                value: { type: "number", example: 7.313 },
                importance: { type: "number", example: 0.15 },
              },
            },
            description: "Top ML features used in analysis",
          },
          recommendation: {
            type: "string",
            enum: ["Approve", "Review", "Decline"],
            description: "Recommended action",
            example: "Review",
          },
          confidence: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "Confidence in the analysis",
            example: 0.87,
          },
          processing_time_ms: {
            type: "integer",
            description: "Processing time in milliseconds",
            example: 45,
          },
          explanation: {
            type: "string",
            description: "Human-readable explanation of the decision",
            example:
              "Transaction scored 35.0% fraud risk. Key risk factors: Transaction amount $1,500 exceeds large transaction threshold; Transaction at unusual hour: 2:00.",
          },
        },
      },
      HealthCheck: {
        type: "object",
        properties: {
          status: { type: "string", example: "healthy" },
          service: { type: "string", example: "heimdall" },
          version: { type: "string", example: "1.0.0" },
          description: {
            type: "string",
            example: "Heimdall Anti-Fraud Detection System",
          },
          timestamp: { type: "string", format: "date-time" },
          uptime: { type: "number", example: 3600.5 },
          environment: { type: "string", example: "development" },
        },
      },
      SystemStats: {
        type: "object",
        properties: {
          total_transactions: { type: "integer", example: 15420 },
          fraud_rate: { type: "number", example: 0.023 },
          accuracy: { type: "number", example: 0.96 },
          avg_processing_time_ms: { type: "number", example: 42.5 },
          risk_distribution: {
            type: "object",
            properties: {
              low: { type: "integer", example: 12500 },
              medium: { type: "integer", example: 2100 },
              high: { type: "integer", example: 650 },
              critical: { type: "integer", example: 170 },
            },
          },
          last_updated: { type: "string", format: "date-time" },
          system_health: {
            type: "object",
            properties: {
              status: { type: "string", example: "operational" },
              avg_latency_ms: { type: "number", example: 42.5 },
              sla_compliance: { type: "string", example: "compliant" },
            },
          },
        },
      },
      Feedback: {
        type: "object",
        required: ["transaction_id", "actual_fraud"],
        properties: {
          transaction_id: {
            type: "string",
            description: "Transaction ID to provide feedback for",
            example: "txn_1705312200000",
          },
          actual_fraud: {
            type: "boolean",
            description: "Whether the transaction was actually fraudulent",
            example: false,
          },
          notes: {
            type: "string",
            description: "Optional notes about the feedback",
            example: "Customer confirmed legitimate purchase",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error type",
            example: "Validation failed",
          },
          message: {
            type: "string",
            description: "Error message",
            example:
              "Missing required fields: user_id, amount, currency, email",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Fraud Detection",
      description: "Core fraud detection endpoints",
    },
    {
      name: "System",
      description: "System health and monitoring",
    },
    {
      name: "Feedback",
      description: "Model improvement and feedback",
    },
  ],
};

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
