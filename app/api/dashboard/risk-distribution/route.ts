import { NextResponse } from "next/server";
import { dbService } from "@/lib/services/database";

export async function GET() {
  try {
    await dbService.initialize();
    const stats = await dbService.getDashboardStats();

    const total =
      (stats.risk_low || 0) +
      (stats.risk_medium || 0) +
      (stats.risk_high || 0) +
      (stats.risk_critical || 0);

    if (total === 0) {
      // Return default distribution if no data
      return NextResponse.json([
        { name: "Low Risk (0-30)", value: 70, color: "#10b981" },
        { name: "Medium Risk (31-70)", value: 20, color: "#f59e0b" },
        { name: "High Risk (71-100)", value: 10, color: "#ef4444" },
      ]);
    }

    const data = [
      {
        name: "Low Risk (0-30)",
        value: Math.round(((stats.risk_low || 0) / total) * 100),
        color: "#10b981",
      },
      {
        name: "Medium Risk (31-70)",
        value: Math.round(
          (((stats.risk_medium || 0) + (stats.risk_high || 0)) / total) * 100
        ),
        color: "#f59e0b",
      },
      {
        name: "High Risk (71-100)",
        value: Math.round(((stats.risk_critical || 0) / total) * 100),
        color: "#ef4444",
      },
    ];

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching risk distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk distribution" },
      { status: 500 }
    );
  }
}
