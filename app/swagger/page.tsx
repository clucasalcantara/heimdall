"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Download, ExternalLink, Eye, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SwaggerPage() {
  const downloadSpec = async (format: "json" | "yaml") => {
    try {
      const response = await fetch("/api/docs");
      const spec = await response.json();

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === "json") {
        content = JSON.stringify(spec, null, 2);
        filename = "heimdall-bifrost-api.json";
        mimeType = "application/json";
      } else {
        // Convert to YAML (simple conversion for demo)
        content = jsonToYaml(spec);
        filename = "heimdall-bifrost-api.yaml";
        mimeType = "text/yaml";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download spec:", error);
    }
  };

  // Simple JSON to YAML converter for demo purposes
  const jsonToYaml = (obj: any, indent = 0): string => {
    const spaces = "  ".repeat(indent);
    let yaml = "";

    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        yaml += `${spaces}${key}: null\n`;
      } else if (typeof value === "object" && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach((item) => {
          if (typeof item === "object") {
            yaml += `${spaces}  -\n${jsonToYaml(item, indent + 2)}`;
          } else {
            yaml += `${spaces}  - ${item}\n`;
          }
        });
      } else if (typeof value === "string") {
        yaml += `${spaces}${key}: "${value}"\n`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }

    return yaml;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Nordic Header with Heimdall's golden theme */}
      <div className="relative bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white overflow-hidden">
        {/* Golden particles effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-amber-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping animation-delay-300"></div>
          <div className="absolute bottom-10 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-pulse animation-delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
                  <Eye className="relative h-8 w-8 text-amber-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
                </div>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  HEIMDALL'S
                </span>
                <span className="text-blue-200">BIFROST API</span>
                <Badge
                  variant="outline"
                  className="ml-2 border-amber-400 text-amber-400 bg-amber-400/10"
                >
                  <Code className="h-3 w-3 mr-1" />
                  Golden Gateway
                </Badge>
              </h1>
              <p className="text-amber-200 text-sm mt-1 font-medium">
                ⚔️ Interactive API documentation blessed by the Golden Guardian
                • OpenAPI 3.0 •
                <span className="text-blue-200">All-seeing, all-knowing</span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadSpec("json")}
                className="border-blue-300 text-blue-300 hover:bg-blue-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Sacred JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadSpec("yaml")}
                className="border-blue-300 text-blue-300 hover:bg-blue-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Runic YAML
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-blue-300 text-blue-300 hover:bg-blue-800"
              >
                <a href="/docs" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Testing Grounds
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 dark:bg-slate-800/90 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                4
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sacred Endpoints
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 dark:bg-slate-800/90 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {"<"} 300ms
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Lightning Response
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 dark:bg-slate-800/90 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                99.9%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Divine Uptime
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 dark:bg-slate-800/90 dark:border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                1M+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Req/min
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Swagger UI Iframe */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg dark:bg-slate-800/90 dark:border-slate-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              🌈 Bifrost API Documentation
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Complete OpenAPI 3.0 specification with interactive examples •
              Heimdall is watching
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="swagger-container">
              <iframe
                src="/api/swagger"
                className="w-full h-[800px] border-0 rounded-b-lg"
                title="Swagger UI Documentation"
                onLoad={() => {
                  console.log(
                    "🌈 Bifrost API Portal loaded - Heimdall is watching"
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Nordic Swagger UI Styles */}
      <style jsx global>{`
        .swagger-container {
          min-height: 600px;
        }

        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .info {
          margin: 20px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 24px;
          border: 2px solid #cbd5e1;
        }

        .swagger-ui .info .title {
          color: #1e293b;
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .swagger-ui .info .title:before {
          content: "🌈 ";
        }

        .swagger-ui .info .description {
          color: #475569;
          font-size: 16px;
          margin: 15px 0;
          font-weight: 500;
        }

        .swagger-ui .scheme-container {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .swagger-ui .opblock {
          border-radius: 12px;
          margin: 15px 0;
          border: 2px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .swagger-ui .opblock.opblock-post {
          border-color: #3b82f6;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.05) 0%,
            rgba(99, 102, 241, 0.05) 100%
          );
        }

        .swagger-ui .opblock.opblock-get {
          border-color: #10b981;
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.05) 0%,
            rgba(5, 150, 105, 0.05) 100%
          );
        }

        .swagger-ui .opblock .opblock-summary {
          border-radius: 12px 12px 0 0;
          font-weight: 600;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(99, 102, 241, 0.15) 100%
          );
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
        }

        .swagger-ui .opblock.opblock-get .opblock-summary {
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.15) 0%,
            rgba(5, 150, 105, 0.15) 100%
          );
          border-bottom: 2px solid rgba(16, 185, 129, 0.2);
        }

        .swagger-ui .opblock-summary-method {
          font-weight: 700;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .swagger-ui .btn.execute {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border: none;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          padding: 12px 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .swagger-ui .btn.execute:hover {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 15px -3px rgba(59, 130, 246, 0.4);
        }

        .swagger-ui .btn.execute:before {
          content: "⚡ ";
        }

        .swagger-ui .response-col_status {
          font-weight: 700;
          font-size: 16px;
          border-radius: 6px;
          padding: 4px 8px;
        }

        .swagger-ui .response-col_status.response-200 {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
        }

        .swagger-ui .response-col_status.response-400 {
          color: #d97706;
          background: rgba(245, 158, 11, 0.1);
        }

        .swagger-ui .response-col_status.response-500 {
          color: #dc2626;
          background: rgba(239, 68, 68, 0.1);
        }

        .swagger-ui .model-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }

        .swagger-ui .model .model-title {
          color: #1e293b;
          font-weight: 700;
          font-size: 16px;
        }

        .swagger-ui .parameter__name {
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
        }

        .swagger-ui .parameter__type {
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .swagger-ui .parameter__in {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 500;
        }

        .swagger-ui .tab {
          border-radius: 8px 8px 0 0;
          font-weight: 600;
        }

        .swagger-ui .tab.active {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
        }

        .swagger-ui .highlight-code {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 8px;
          padding: 20px;
          border: 2px solid #475569;
        }

        .swagger-ui .highlight-code .hljs {
          background: transparent;
          color: #f1f5f9;
        }

        .swagger-ui .copy-to-clipboard {
          background: linear-gradient(135deg, #475569 0%, #64748b 100%);
          border: none;
          color: #f1f5f9;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .swagger-ui .copy-to-clipboard:hover {
          background: linear-gradient(135deg, #334155 0%, #475569 100%);
        }

        .swagger-ui .servers {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          border: 2px solid #d1d5db;
        }

        .swagger-ui .servers-title {
          font-weight: 700;
          color: #374151;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .swagger-ui .servers select {
          border-radius: 6px;
          border: 2px solid #d1d5db;
          padding: 8px 12px;
          background: white;
          font-weight: 500;
        }

        /* Custom Nordic scrollbar */
        .swagger-ui ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .swagger-ui ::-webkit-scrollbar-track {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 6px;
        }

        .swagger-ui ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
          border-radius: 6px;
          border: 2px solid #f1f5f9;
        }

        .swagger-ui ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
        }

        /* Add Nordic runes to endpoints */
        .swagger-ui .opblock-summary-path:before {
          content: "ᚱ ";
          color: #6366f1;
          font-weight: bold;
        }

        /* Add mystical glow to execute buttons */
        .swagger-ui .btn.execute {
          position: relative;
          overflow: hidden;
        }

        .swagger-ui .btn.execute:before {
          content: "⚡ ";
          position: relative;
          z-index: 1;
        }

        .swagger-ui .btn.execute:after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .swagger-ui .btn.execute:hover:after {
          left: 100%;
        }
      `}</style>
    </div>
  );
}
