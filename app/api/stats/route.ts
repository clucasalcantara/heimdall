import { NextResponse } from "next/server";
import { decisionEngine } from "@/lib/decision-engine";

export async function GET() {
  try {
    const stats = await decisionEngine.getStats();

    return NextResponse.json({
      ...stats,
      last_updated: new Date().toISOString(),
      system_health: {
        status: "operational",
        avg_latency_ms: stats.avg_processing_time_ms,
        sla_compliance:
          stats.avg_processing_time_ms < 300 ? "compliant" : "non_compliant",
      },
    });
  } catch (error) {
    console.error("Failed to get stats:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to retrieve statistics",
      },
      { status: 500 }
    );
  }
}
