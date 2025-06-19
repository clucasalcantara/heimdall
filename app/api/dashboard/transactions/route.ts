import { NextResponse } from "next/server";
import { dbService } from "@/lib/services/database";

export async function GET(request: Request) {
  try {
    await dbService.initialize();

    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const decision = searchParams.get("decision");
    const country = searchParams.get("country");
    const minRisk = Number.parseInt(searchParams.get("minRisk") || "0");
    const maxRisk = Number.parseInt(searchParams.get("maxRisk") || "100");

    // Build query object for searchTransactions
    const query: any = {
      limit: isNaN(limit) ? 50 : limit,
      offset: 0,
    };

    if (decision && decision !== "all") {
      query.recommendation =
        decision.charAt(0).toUpperCase() + decision.slice(1);
    }

    if (country && country !== "all") {
      query.country = country;
    }

    // Note: searchTransactions doesn't support risk score filtering directly
    // We'll need to handle this in the response filtering if needed

    try {
      const transactions = await dbService.searchTransactions(query);

      // Filter by risk score if needed (since searchTransactions doesn't support it)
      let filteredTransactions = transactions;
      if (minRisk > 0 || maxRisk < 100) {
        filteredTransactions = transactions.filter((tx) => {
          const riskScore = (tx.analysis?.overall_score || 0) * 100;
          return riskScore >= minRisk && riskScore <= maxRisk;
        });
      }

      // Format for frontend
      const formattedTransactions = filteredTransactions.map((tx) => ({
        id: tx.transaction_id,
        user: tx.user_id,
        country: getCountryName(tx.billing_address.country),
        amount: `$${tx.amount.toLocaleString()}`,
        time: getTimeAgo(tx.timestamp),
        riskScore: Math.round((tx.analysis?.overall_score || 0) * 100),
        decision: (tx.analysis?.recommendation || "unknown").toLowerCase(),
        details: tx,
      }));

      return NextResponse.json(formattedTransactions);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error occurred while fetching transactions" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    BR: "Brazil",
    MX: "Mexico",
    NG: "Nigeria",
    UA: "Ukraine",
    ID: "Indonesia",
    VN: "Vietnam",
    CN: "China",
    RU: "Russia",
    IN: "India",
    PK: "Pakistan",
    BD: "Bangladesh",
    JP: "Japan",
  };
  return countryNames[code] || code;
}
