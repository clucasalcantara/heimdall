import { NextResponse } from "next/server";

// Test endpoint to verify API is working
export async function GET() {
  const testTransaction = {
    user_id: "test_user_123",
    amount: 15000, // High amount to trigger rules
    currency: "USD",
    merchant_id: "merchant_test",
    merchant_category: "retail",
    email: "test@example.com",
    ip_address: "192.168.1.1",
    billing_address: {
      country: "XX", // High risk country
      city: "Test City",
    },
    payment_method: {
      type: "credit_card",
      last_four: "1234",
    },
  };

  try {
    // Test the analyze endpoint
    const analyzeResponse = await fetch(
      `${process.env.VERCEL_URL || "http://localhost:3000"}/api/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testTransaction),
      }
    );

    const analyzeResult = await analyzeResponse.json();

    return NextResponse.json({
      message: "API Test Successful",
      test_transaction: testTransaction,
      analysis_result: analyzeResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "API Test Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
