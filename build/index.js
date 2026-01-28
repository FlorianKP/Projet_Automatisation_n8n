"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
// Create server instance
const server = new mcp_js_1.McpServer({
    name: 'n8n',
    version: '1.0.0',
});
