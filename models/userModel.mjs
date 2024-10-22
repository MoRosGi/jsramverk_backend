import database from '../db/database.mjs'

const userModel = {
    getUserByMail: async function getOne(email) {
        const db = await database.getDb();

        try {
            const filter = {
                email: email
            }

            const result = await db.collectionUsers.findOne(filter);

            if (result == null) {
                throw new Error("No user found.");
            }

            return result

        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },
}

export default userModel;
