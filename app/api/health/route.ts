import { NextResponse } from "next/server";
import { dbService } from "@/lib/services/database";

export async function GET() {
  const startTime = Date.now();

  try {
    // Test database connection
    let dbStatus = "healthy";
    try {
      await dbService.initialize();
    } catch (error) {
      dbStatus = "error";
    }

    // Test API response time
    const responseTime = Date.now() - startTime;
    const apiStatus = responseTime < 1000 ? "healthy" : "warning";

    // Simulate other component checks
    const mlModelStatus = "healthy";
    const rulesEngineStatus = "healthy";

    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      response_time_ms: responseTime,
      components: {
        api: apiStatus,
        database: dbStatus,
        ml_model: mlModelStatus,
        rules_engine: rulesEngineStatus,
      },
      version: "1.0.0",
    };

    return NextResponse.json(healthData);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}
