import database from '../db/database.mjs'
import bcrypt from 'bcryptjs';

import userModel from './userModel.mjs';
import tokenService from '../services/tokenService.mjs'

const saltRounds = 10;

const authModel = {

    // check if email in collectionUsers:
        //if(email in collectionUsers): -> throw new Error

    // check if email in database collectionInvites
        // update users in collectionDocuments with the body.email
        // delete the entry for body.email from database collectionInvites
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
            const user = await userModel.getUserByMail(email);

            if (user) {
                throw new Error( "User already registered");
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = {
                email: email,
                password: hashedPassword,
            };

            await db.collectionUsers.insertOne(newUser);

            const token = tokenService.generateToken({ email: email});

            return { success: true, token: token };

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
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
            const user = await userModel.getUserByMail(email);

            if (!user) {
                throw new Error( "User not found");
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new Error("Incorrect password");
            }

            const token = tokenService.generateToken({ email: email});

            return { success: true, token: token };

        } catch (error) {
            throw new Error("Login error: " + error.message);
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