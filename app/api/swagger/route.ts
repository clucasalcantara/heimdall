import { NextResponse } from "next/server";

// Swagger UI HTML template
const swaggerUIHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Heimdall API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.10.5/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.10.5/favicon-16x16.png" sizes="16x16" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    
    /* Custom Heimdall styling */
    .topbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 15px 0;
    }
    
    .topbar .download-url-wrapper {
      display: none;
    }
    
    .topbar .topbar-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .topbar .topbar-wrapper .link {
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-decoration: none;
    }
    
    .topbar .topbar-wrapper .link:after {
      content: " - Real-time Fraud Detection API";
      font-size: 14px;
      font-weight: normal;
      opacity: 0.8;
    }
    
    .swagger-ui .info .title {
      color: #667eea;
      font-size: 36px;
      margin: 0;
    }
    
    .swagger-ui .info .description {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin: 15px 0;
    }
    
    .swagger-ui .scheme-container {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border: none;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .swagger-ui .opblock {
      border-radius: 10px;
      margin: 15px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: none;
      overflow: hidden;
    }
    
    .swagger-ui .opblock.opblock-post {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .swagger-ui .opblock.opblock-get {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    
    .swagger-ui .opblock .opblock-summary {
      border: none;
      padding: 15px 20px;
    }
    
    .swagger-ui .opblock.opblock-post .opblock-summary {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    
    .swagger-ui .opblock.opblock-get .opblock-summary {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    
    .swagger-ui .opblock .opblock-summary .opblock-summary-method {
      background: rgba(255,255,255,0.2);
      color: white;
      border-radius: 6px;
      font-weight: bold;
      min-width: 80px;
      text-align: center;
    }
    
    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      padding: 10px 20px;
      transition: all 0.3s ease;
    }
    
    .swagger-ui .btn.execute:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .swagger-ui .response-col_status {
      font-weight: 700;
      font-size: 16px;
    }
    
    .swagger-ui .response-col_status.response-200 {
      color: #11998e;
    }
    
    .swagger-ui .response-col_status.response-400 {
      color: #f39c12;
    }
    
    .swagger-ui .response-col_status.response-500 {
      color: #e74c3c;
    }
    
    .swagger-ui .model-box {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;
      border: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .swagger-ui .highlight-code {
      background: #2c3e50;
      border-radius: 8px;
      padding: 20px;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .swagger-ui .parameter__name {
      font-weight: 700;
      color: #2c3e50;
    }
    
    .swagger-ui .tab {
      border-radius: 8px 8px 0 0;
      border: none;
    }
    
    .swagger-ui .tab.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    /* Performance indicators */
    .performance-badge {
      display: inline-block;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 10px;
    }
    
    .fraud-detection-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        defaultModelRendering: "example",
        displayRequestDuration: true,
        tryItOutEnabled: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        requestInterceptor: function(request) {
          // Add custom headers or modify requests
          console.log('Heimdall API Request:', request);
          return request;
        },
        responseInterceptor: function(response) {
          // Log responses for debugging
          console.log('Heimdall API Response:', response);
          
          // Add performance indicators
          if (response.headers && response.headers['x-response-time']) {
            const responseTime = parseFloat(response.headers['x-response-time']);
            if (responseTime < 300) {
              console.log('✅ SLA Compliant: ' + responseTime + 'ms');
            } else {
              console.log('⚠️ SLA Breach: ' + responseTime + 'ms');
            }
          }
          
          return response;
        },
        onComplete: function() {
          console.log('🛡️ Heimdall API Documentation Loaded');
          
          // Add custom badges to endpoints
          setTimeout(() => {
            const analyzeEndpoint = document.querySelector('[data-path="/analyze"]');
            if (analyzeEndpoint) {
              const summary = analyzeEndpoint.querySelector('.opblock-summary-description');
              if (summary) {
                summary.innerHTML += '<span class="performance-badge">< 300ms</span><span class="fraud-detection-badge">ML + Rules</span>';
              }
            }
            
            // Add performance info to other endpoints
            const healthEndpoint = document.querySelector('[data-path="/health"]');
            if (healthEndpoint) {
              const summary = healthEndpoint.querySelector('.opblock-summary-description');
              if (summary) {
                summary.innerHTML += '<span class="performance-badge">< 50ms</span>';
              }
            }
          }, 1000);
        }
      });
    };
  </script>
</body>
</html>
`;

export async function GET() {
  return new NextResponse(swaggerUIHTML, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
