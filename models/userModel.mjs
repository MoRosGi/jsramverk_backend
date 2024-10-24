import database from '../db/database.mjs'

const userModel = {
    getUserByMail: async function getUserByMail(email) {
        const db = await database.getDb();

        try {
            const filter = {
                email: email
            }

            const result = await db.collectionUsers.findOne(filter);

            // if (result == null) {
            //     throw new Error("No user found.");
            // }

            return result

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    addOne: async function addOne(email, hashedPassword) {
        const db = await database.getDb();

        try {
            const newUser = {
                email: email,
                password: hashedPassword,
            };

            await db.collectionUsers.insertOne(newUser);

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    }
}

export default userModel;
