import { NextResponse } from "next/server";
import { dbService } from "@/lib/services/database";

export async function GET() {
  try {
    await dbService.initialize();
    const countryStats = await dbService.getCountryStats();

    // If no real data, return empty array (will trigger sample data generation)
    if (countryStats.length === 0) {
      return NextResponse.json([]);
    }

    const formattedStats = countryStats.map((stat) => ({
      name: getCountryName(stat._id),
      value: Math.round(stat.avg_risk_score * 100),
      transactions: stat.transaction_count,
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error("Error fetching country stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch country stats" },
      { status: 500 }
    );
  }
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
