import database from '../db/database.mjs';

const userModel = {
    fetchUserByEmail: async function fetchUserByEmail(email) {
        const db = await database.getDb();

        try {
            const filter = {
                email: email
            };

            const result = await db.collectionUsers.findOne(filter);

            return result;
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    createUser: async function createUser(email, hashedPassword) {
        const db = await database.getDb();

        try {
            const newUser = {
                email: email,
                password: hashedPassword,
            };

            await db.collectionUsers.insertOne(newUser);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    }
};

export default userModel;
