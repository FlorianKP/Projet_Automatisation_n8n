import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import Database from "better-sqlite3";

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
    SELECT i.id, i.name, i.type, i.quantity
    FROM ingredient i
    JOIN Contenant c ON c.id = i.contenant_id
    WHERE c.name = ?
    ORDER BY i.name ASC
  `);

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
