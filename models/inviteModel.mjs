import database from '../db/database.mjs'
import documentModel from './documentModel.mjs';
import userModel from './userModel.mjs';
import mailService from '../services/mailService.mjs'

const inviteModel = {
    invite: async function invite(user, invitation) {
        const db = await database.getDb();

        const document = await documentModel.getOne(user, invitation.documentId);

        if (user.email != document.owner) {
            throw new Error("You need to be owner of document to send invite.");
        }

        const collaborators = await documentModel.getDocumentCollaborators(invitation.documentId);

        const collaborator = collaborators.includes(user.email ) ? user.email : null;

        if (collaborator == invitation.receiver) {
            throw new Error("Receiver is already a collaborator.");
        }

        try {
            const invite = await this.getOne(invitation.documentId, invitation.receiver);

            if (invite) {
                throw new Error("Invite already sent.");
            }

            await this.addInvite(user.email, invitation.documentId, invitation.receiver);
            const newInvite = await this.getOne(invitation.documentId, invitation.receiver);

            const inviteId = newInvite._id;
            await mailService.sendInvite(invitation.receiver, inviteId);
        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    addInvite: async function addInvite(email, documentId, invitedEmail) {
        const db = await database.getDb();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        if (email == invitedEmail) {
            throw new Error("Receiver can't be sender.");
        }

        try {
            const invite = {
                sender: email,
                receiver: invitedEmail,
                documentId: documentId,
                status: "pending"
            };

            await db.collectionInvites.insertOne(invite)

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    getOne: async function getOne(documentId, invitedEmail) {
        const db = await database.getDb();

        try {
            const filter = {
                $and: [
                    { receiver: invitedEmail },
                    { documentId: documentId }
                ]
            };

            const result = await db.collectionInvites.findOne(filter);

            // if (result == null) {
            //     throw new Error("No valid invite.");
            // }
            return result

        } catch (error) {
            throw new Error("Database query failed: " + error.message);
        } finally {
            await db.client.close();
        }
    },

    // accept invite : control if status pending otherwise error
                // move to acceptInvite
                //const registeredUser = await userModel.getUserByMail(invitation.receiver);

                //if (registeredUser) {
                //    await documentModel.addCollaborator(invitation.documentId, registeredUser.email);
                //}
            //
}

export default inviteModel;
