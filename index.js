'use strict';

const Hapi = require('hapi');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const server=Hapi.server({
    host:'localhost',
    port: process.env.APP_PORT || 8082
});

server.route({
    method:'POST',
    path:'/contact',
    handler:function(request,h) {
        const fromEmail = new helper.Email(request.payload.from);
        const toEmail = new helper.Email('renan.bonette@gmail.com');
        const subject = 'Contato de seu Website';
        const content = new helper.Content('text/plain', request.payload.message);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);
        const req = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
           
        sg.API(req, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        });
        return true;
    }
});

async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();