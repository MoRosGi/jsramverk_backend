import database from '../db/database.mjs'
import { ObjectId } from 'mongodb';

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

    // login
        // body.email body.password
        // retrieve email and password from database users_collection
            // compare body.email vs email database and body.password vs password users_collection with bcryptj compare
                // generate JWT token from secret env with jwt.sign and return
    login: async function login(email, password) {
        const db = await database.getDb();

        let data = { success: false, message: "" };

        try {
            const user = await db.collectionUsers.findOne({ email: email });

            if (!user) {
                data.message = "User not found";
                return data;
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                data.message = "Incorrect password";
                return data;
            }

            // const token = generateToken(user);

            // data.success = true;
            // data.token = token;
            // return data;
        } catch (e) {
            data.message = "Login error: " + e.message;
            return data;
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