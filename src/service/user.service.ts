
import { clientDB } from "../config/mongo.js";

export const userService = {


        async getUsers() {
			try {
				const database = clientDB.db('n8n_db');
				const usersCollection = database.collection('users');
				const users = await usersCollection.find({}).toArray();
				return users;
			} catch (error) {
				console.error('Error fetching users:', error);
				throw error;
			} finally {
				await clientDB.close();
			}
		},

        async getSkillbyUsers(): Promise<Record<string, string[]>> {
            try {
                const users = await this.getUsers();
                const result: Record<string, string[]> = {};

                users.forEach(user => {
                    if (user.name && Array.isArray(user.skill as any)) {
                        result[user.name.trim()] = user.skill;
                    }
                });

                return result;
                
            } catch (error) {
                console.error('Error fetching skilled users:', error);
                throw error;
            } finally {
                await clientDB.close();
            }
        }

}

