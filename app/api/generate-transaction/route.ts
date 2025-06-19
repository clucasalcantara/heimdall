import { NextResponse } from "next/server";
import { decisionEngine } from "@/lib/decision-engine";

export async function POST() {
  try {
    const transaction = await decisionEngine.generateSampleTransaction();
    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.transaction_id,
        user: transaction.user_id,
        country: transaction.billing_address.country,
        amount: transaction.amount,
        riskScore: Math.round(transaction.overall_score * 100),
        decision: transaction.recommendation.toLowerCase(),
      },
    });
  } catch (error) {
    console.error("Error generating transaction:", error);
    return NextResponse.json(
      { error: "Failed to generate transaction" },
      { status: 500 }
    );
  }
}
