import database from '../db/database.mjs'
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

saltRounds = 10;

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
    register: async function register(body) {
        const db = await database.getDb();

        // here use function from models/usersModel.mjs to control if user in database
        try {
            const hashedPassword = await bcrypt.hash(body.password, saltRounds);

            const newUser = {
                email: body.email,
                password: hashedPassword,
            };
            return db.collectionUsers.insertOne(newUser);
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    }

    // login
        // body.email body.password
        // retrieve email and password from database users_collection
            // compare body.email vs email database and body.password vs password users_collection with bcryptj compare
                // generate JWT token from secret env with jwt.sign and return

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