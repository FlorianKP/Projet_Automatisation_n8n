import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Données en dur : nom -> compétences
const SKILLS_BY_PERSON: Record<string, string[]> = {
	marie: ['Java', 'Spring Boot', 'Docker'],
	jean: ['TypeScript', 'Node.js', 'MongoDB'],
	alice: ['n8n', 'Automation'],
};

const server = new McpServer({
	name: 'n8n',
	version: '0.0.1',
});

server.registerTool(
	'getSkills', // Argument 1 : Le nom
	{
		description:
			'Returns the list of professional skills for a given person. Use this tool when you need to know what technologies or competencies someone has.',
	}, // Argument 2 : La définition (Schéma JSON)
	async ({ name }: any) => {
		// Argument 3 : Le Handler (Callback)
		const normalizedName = name.toLowerCase().trim();
		const skills = SKILLS_BY_PERSON[normalizedName];

		if (!skills) {
			return {
				content: [
					{
						type: 'text',
						text: `No skills found for "${name}".`,
					},
				],
				isError: true,
			};
		}

		return {
			content: [
				{
					type: 'text',
					text: `Skills for ${name}: ${skills.join(', ')}`,
				},
			],
		};
	}
);

const transport = new StdioServerTransport();
server.connect(transport);
