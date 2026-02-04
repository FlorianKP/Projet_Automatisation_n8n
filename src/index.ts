import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import Database from "better-sqlite3";
import express from "express";

const StorageEnum = z.enum([
  "FRIGO",
  "PLACARD",
  "CONGELATEUR",
  "CAVE_A_VIN",
  "ETAGERE_A_EPICES",
]);

const Input = z.object({
  storage: StorageEnum.describe("Nom du contenant (doit correspondre à Contenant.name)"),
});

type IngredientRow = {
  id: number;
  name: string;
  type: string;
  quantity: number;
};

export function buildServer(sqlitePath: string) {
  const db = new Database(sqlitePath, { readonly: false }); // mettez true si lecture seule
  db.pragma("journal_mode = WAL");

  const server = new McpServer({ name: "kitchen-mcp", version: "1.0.0" });

  // Récupère les ingrédients d’un contenant via son nom (Contenant.name)
  const stmt = db.prepare(`
    SELECT *
    FROM ingredient`);

  server.registerTool(
    "get_ingredients",
    {
      title: "Get ingredients",
      description:
        "Récupère la liste d’ingrédients pour un contenant (FRIGO, PLACARD, etc.).",
      inputSchema: Input,
    },
    async ({ storage }) => {
      const rows = stmt.all(storage) as IngredientRow[];
      console.log(rows);
      const payload = {
        storage,
        ingredients: rows.map((r) => ({
          id: r.id,
          name: r.name,
          type: r.type,
          quantity: r.quantity,
        })),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(payload, null, 2),
          },
        ],
      };
    }
  );

  return server;
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.all("/mcp", async (req: express.Request, res: express.Response) => {
  const server = buildServer("Z:\BUT 3\Développement avancé\n8n\Projet_Automatisation_n8n\src\seed\sqlite.db")
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
