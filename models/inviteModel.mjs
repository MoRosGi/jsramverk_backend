import database from '../db/database.mjs'
import documentModel from './documentModel.mjs';
import userModel from './userModel.mjs';

const inviteModel = {
    invite: async function invite(user, invitation) {
        const db = await database.getDb();

        const document = await documentModel.getOne(user, invitation.id);

        if (user.email != document.owner) {
            throw new Error("You need to be owner of document to send invite.");
        }

        try {
            const registeredUser = await userModel.getUserByMail(invitation.email);

            if (registeredUser) {
                await documentModel.addCollaborator(invitation.id, registeredUser.email);
            }

            // addInvite(user.email, invitation.id, invitation.email) (inviteModel function addInvite)
            // sendInviteEmail(invitation) (mailService function sendInviteEmail)

            // return await db.collectionDocuments.find(filter).toArray();
        } catch (e) {
            throw new Error("Database query failed: " + e.message);
        } finally {
            await db.client.close();
        }
    },

    addInvite: async function addInvite(email, documentId, invitedEmail) {
        const db = await database.getDb();

    }
}

export default inviteModel;
