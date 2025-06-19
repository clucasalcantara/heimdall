import { type NextRequest, NextResponse } from "next/server";
import { decisionEngine } from "@/lib/decision-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.transaction_id || typeof body.actual_fraud !== "boolean") {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Missing required fields: transaction_id, actual_fraud",
        },
        { status: 400 }
      );
    }

    // Validate transaction_id format (should be UUID-like)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (
      !body.transaction_id.startsWith("txn_") &&
      !uuidRegex.test(body.transaction_id)
    ) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Invalid transaction_id format",
        },
        { status: 400 }
      );
    }

    // Submit feedback to decision engine
    const result = decisionEngine.submitFeedback(
      body.transaction_id,
      body.actual_fraud,
      body.notes
    );

    console.log(
      `Feedback submitted for transaction ${body.transaction_id}: fraud=${body.actual_fraud}`
    );

    return NextResponse.json({
      status: "success",
      message: "Feedback submitted successfully",
      transaction_id: body.transaction_id,
    });
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to submit feedback",
      },
      { status: 500 }
    );
  }
}
