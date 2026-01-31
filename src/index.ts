import express, { Request, Response } from "express";
import { z } from "zod";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const SKILLS_BY_PERSON: Record<string, string[]> = {
  marie: ["Java", "Spring Boot", "Docker"],
  jean: ["TypeScript", "Node.js", "MongoDB"],
  alice: ["n8n", "Automation"],
};

const app = express();
app.use(express.json({ limit: "1mb" }));

app.all("/mcp", async (req: Request, res: Response) => {
  const server = new McpServer({ name: "Simple Skills MCP (HTTP)", version: "0.0.1" });

  server.registerTool(
    "getSkills",
    {
      description: "Return the list of skills for a given person name.",
      inputSchema: {
        name: z.string().min(1).describe("Person name (e.g. 'Marie')"),
      },
    },
    async ({ name }: { name: string }) => {
      const skills = SKILLS_BY_PERSON[name.toLowerCase()] ?? [];
      return { content: [{ type: "text", text: JSON.stringify(skills) }] };
    }
  );

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error("MCP error:", e);
    if (!res.headersSent) res.status(500).send("MCP error");
  }
});

app.listen(3000, "127.0.0.1", () => {
  console.error("🚀 MCP HTTP on http://127.0.0.1:3000/mcp");
});
