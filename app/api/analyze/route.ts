import { type NextRequest, NextResponse } from "next/server";
import { decisionEngine, type Transaction } from "@/lib/decision-engine";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;

  try {
    const startTime = Date.now();
    logger.info(`Incoming fraud analysis request`, { requestId }, "api");

    // Parse request body
    const transaction: Transaction = await request.json();
    logger.debug(
      `Transaction data received`,
      {
        requestId,
        userId: transaction.user_id,
        amount: transaction.amount,
        currency: transaction.currency,
        country: transaction.billing_address?.country,
      },
      "api"
    );

    // Basic validation
    if (
      !transaction.user_id ||
      !transaction.amount ||
      !transaction.currency ||
      !transaction.email
    ) {
      logger.warn(
        `Validation failed - missing required fields`,
        {
          requestId,
          hasUserId: !!transaction.user_id,
          hasAmount: !!transaction.amount,
          hasCurrency: !!transaction.currency,
          hasEmail: !!transaction.email,
        },
        "api"
      );

      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Missing required fields: user_id, amount, currency, email",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(transaction.email)) {
      logger.warn(
        `Invalid email format`,
        { requestId, email: transaction.email },
        "api"
      );
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (transaction.amount <= 0) {
      logger.warn(
        `Invalid amount`,
        { requestId, amount: transaction.amount },
        "api"
      );
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Add timestamp if not provided
    if (!transaction.timestamp) {
      transaction.timestamp = new Date().toISOString();
    }

    logger.info(
      `Starting fraud analysis`,
      {
        requestId,
        transactionId: transaction.id || "auto-generated",
      },
      "api"
    );

    // Analyze transaction
    const fraudScore = await decisionEngine.analyzeTransaction(transaction);

    const processingTime = Date.now() - startTime;

    logger.info(
      `Fraud analysis completed`,
      {
        requestId,
        transactionId: fraudScore.transaction_id,
        overallScore: (fraudScore.overall_score * 100).toFixed(1) + "%",
        riskLevel: fraudScore.risk_level,
        recommendation: fraudScore.recommendation,
        processingTime: processingTime + "ms",
        triggeredRules: fraudScore.triggered_rules,
      },
      "api"
    );

    // Check SLA compliance
    if (processingTime > 300) {
      logger.error(
        `SLA breach detected - processing time exceeded 300ms`,
        {
          requestId,
          processingTime: processingTime + "ms",
          transactionId: fraudScore.transaction_id,
        },
        "api"
      );
    } else {
      logger.debug(
        `SLA compliant - processing completed in time`,
        {
          requestId,
          processingTime: processingTime + "ms",
        },
        "api"
      );
    }

    return NextResponse.json(fraudScore);
  } catch (error) {
    const processingTime = Date.now() - Date.now();
    logger.error(
      `Fraud analysis failed`,
      {
        requestId,
        error: (error as Error).message,
        stack: (error as Error).stack?.split("\n").slice(0, 3).join("\n"),
      },
      "api"
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to analyze transaction",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  logger.debug("CORS preflight request received", null, "api");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
