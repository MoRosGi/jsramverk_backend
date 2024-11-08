import { ObjectId } from 'mongodb';

import database from '../db/database.mjs';
import documentModel from './documentModel.mjs';
import mailService from '../services/mailService.mjs';

const inviteModel = {
    sendDocumentInvite: async function sendDocumentInvite(user, body) {
        const db = await database.getDb();

        const document = await documentModel.fetchDocumentById(user, body.documentId);

        if (user.email != document.owner) {
            throw new Error("You need to be owner of document to send invite.");
        }
        const collaborators = await documentModel.fetchCollaborators(body.documentId);

        const collaborator = collaborators.includes(body.receiver) ? body.receiver : null;

        if (collaborator == body.receiver) {
            throw new Error("Receiver is already a collaborator.");
        }

        try {
            const invite = await this.fetchInvite(body.documentId, body.receiver);

            if (invite) {
                throw new Error("Invite already sent.");
            }
            await this.storeInvite(user.email, body.documentId, body.receiver);
            const newInvite = await this.fetchInvite(body.documentId, body.receiver);

            const inviteId = newInvite._id;

            await mailService.dispatchInviteEmail(body.receiver, inviteId);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    storeInvite: async function storeInvite(email, documentId, invitedEmail) {
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

            await db.collectionInvites.insertOne(invite);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    fetchInvite: async function fetchInvite(documentId, invitedEmail) {
        const db = await database.getDb();

        try {
            const filter = {
                $and: [
                    { receiver: invitedEmail },
                    { documentId: documentId }
                ]
            };

            const result = await db.collectionInvites.findOne(filter);

            return result;
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    fetchInviteById: async function fetchInviteById(inviteId) {
        const db = await database.getDb();
    
        try {
            const filter = {
                _id: ObjectId.createFromHexString(inviteId)
            };

            const result = await db.collectionInvites.findOne(filter);

            return result;
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    updateInviteStatus: async function updateInviteStatus(inviteId, stringStatus) {
        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(inviteId)
            };

            const status = {
                $set: {
                    status: stringStatus
                }
            };

            return await db.collectionInvites.updateOne(filter, status);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    acceptInvite: async function acceptInvite(user, inviteId) {
        const db = await database.getDb();

        const invite = await this.fetchInviteById(inviteId);

        if (!invite || invite.receiver != user.email || invite.status != "pending") {
            throw new Error("No valid invite or can't be changed.");
        }
        try {
            const documentId = invite.documentId;

            const email = invite.receiver;

            await documentModel.addDocumentCollaborator(documentId, email);
            await this.updateInviteStatus(inviteId, "accepted");
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },
};

export default inviteModel;
