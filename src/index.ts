import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Données en dur : nom -> compétences
const SKILLS_BY_PERSON: Record<string, string[]> = {
  "marie": ["Java", "Spring Boot", "Docker"],
  "jean": ["TypeScript", "Node.js", "MongoDB"],
  "alice": ["n8n", "Automation"],
};

const server = new McpServer({
  name: "n8n",
  version: "0.0.1",
});

// 👇 Tool bien décrit pour le LLM

server.tool(
  "getSkills",
  {
    name: z
      .string()
      .min(1)
      .describe("Name of a person to retrieve their skills"),
  },
  async ({ name }: { name: string }) => {
    const skills = SKILLS_BY_PERSON[name.toLowerCase()] ?? [];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(skills),
        },
      ],
    };
  },
  {
    description:
      "Returns the list of professional skills for a given person. " +
      "Use this tool when you need to know what technologies or competencies someone has.",
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
