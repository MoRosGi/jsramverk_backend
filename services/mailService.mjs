import formData from 'form-data';
import Mailgun from 'mailgun.js';

import * as dotenv from 'dotenv';
dotenv.config();

const mailgun = new Mailgun(formData);

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY, url: 'https://api.mailgun.net'});

const mailService = {
    dispatchInviteEmail: async function dispatchInviteEmail(receiver, inviteId) {
        try {
            const link = `https://www.student.bth.se/~angt23/editor/#/invite/${inviteId}`;

            await mg.messages.create('sandbox9a319d4452b34ccca15cbcac022c6900.mailgun.org', {
                from: "annie.v.gustafsson@gmail.com",
                to: [receiver],
                subject: "Inbjudan till att redigera dokumentet",
                text: `Du har blivit inbjuden till att redigera ett dokument. Klicka här: ${link} för att acceptera och logga in.`,
                html: `<h1>Du har blivit inbjuden till att redigera ett dokument. <a href="${link}">Klicka här</a> för att acceptera och logga in.</h1>`
              });
        } catch (error) {
            throw new Error(error.message ? error.message : "Error when sending email.");
        }
    }
};

export default mailService;
