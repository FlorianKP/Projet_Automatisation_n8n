import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.KEY_MONGODB;
const dbUsername = process.env.DB_USERNAME;
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@n8n.igr1ilm.mongodb.net/?appName=N8N`;

export const clientDB = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});


