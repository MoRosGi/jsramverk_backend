import database from '../db/database.mjs'
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const authModel = {
    // register
        // body.email body.password
        // check if email already in database users_collection
            // bcryptjs hash -> hash body.password
            // save hash body.password + email in database users_collection
            // generate JWT token from secret env with jwt.sign and return
        // check if email in database invite_collection
            // update users in documents_collection with the body.email
            // delete the entry for body.email from database invite_collection
    register: async function register(email, password) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const db = await database.getDb();

        try {
            // use model from usersModel.mjs
            const user = await db.collectionUsers.findOne({ email: email });

            if (user) {
                throw new Error( "User already registered");
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = {
                email: email,
                password: hashedPassword,
            };

            await db.collectionUsers.insertOne(newUser);

            // const token = generateToken(user);

            // return { success: true, token: token };
            return { success: true };

        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },

    login: async function login(email, password) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const db = await database.getDb();

        try {
            // use model from usersModel.mjs
            const user = await db.collectionUsers.findOne({ email: email });

            if (!user) {
                throw new Error( "User not found");
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new Error("Incorrect password");
            }

            // const token = generateToken(user);

            // return { success: true, token: token };
            return { success: true };

        } catch (e) {
            throw new Error("Login error: " + e.message);
        } finally {
            await db.client.close();
        }
    }

    // remove
        // body.email body.password
        // retrieve email and password from database users_collection
        // check if user own document in database documents_collection
            // -> delete owned documents
        //  delete user from database users_collection

    // invite
        // document ID + user email + API key from Sigrid/Mailgun
            // check if user in database users_collection
                // save user email in database documents_collection
            // ELSE save in database invites_collection

    // logout ??
}

export default authModel;